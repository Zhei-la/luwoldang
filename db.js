const { Pool } = require('pg');

// Railway Postgres / Supabase는 SSL 필요, 로컬은 불필요
const url = process.env.DATABASE_URL || '';
const isLocal = url.includes('localhost') || url.includes('127.0.0.1');

const pool = new Pool({
  connectionString: url,
  ssl: isLocal ? false : { rejectUnauthorized: false },
});

async function initDb() {
  // 교육생 · 관리자 통합 테이블
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id                 SERIAL PRIMARY KEY,
      kakao_id           TEXT UNIQUE NOT NULL,
      name               TEXT,
      account_email      TEXT,
      role               TEXT NOT NULL DEFAULT 'trainee',   -- admin / trainee
      status             TEXT NOT NULL DEFAULT 'pending',   -- pending / approved / rejected
      slug               TEXT UNIQUE,                       -- 무료사주 고유 링크 (/s/:slug)
      site_name          TEXT,
      kakao_consult_link TEXT,
      consult_message    TEXT,
      button_text        TEXT,
      can_make_pdf       BOOLEAN DEFAULT TRUE,
      can_set_free       BOOLEAN DEFAULT TRUE,
      can_view_records   BOOLEAN DEFAULT TRUE,
      can_manage_api     BOOLEAN DEFAULT TRUE,
      created_at         TIMESTAMPTZ DEFAULT NOW(),
      approved_at        TIMESTAMPTZ
    );
  `);

  // 교육생 OpenAI 키 (무료사주·PDF 생성에 사용)
  await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS openai_key TEXT;`);

  // 랜딩 페이지 (빌더로 꾸민 내용 JSON)
  await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS landing JSONB;`);

  // 교육생별 메일 발송 설정 (각자 Gmail 사용 → 자기 이름으로 발송, 한도도 각자)
  // 메일 발송 설정 (도메인은 공통, 교육생별로 아이디/이름/답장주소)
  await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS mail_local TEXT;`); // @앞 아이디
  await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS mail_name TEXT;`); // 발신인 이름
  await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS mail_reply TEXT;`); // 답장 받을 주소
  await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS mail_key TEXT;`); // (선택) 개인 Resend 키

  // PDF 마지막 페이지 추가질문 CTA
  await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS pdf_cta_text TEXT;`);   // 버튼 문구
  await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS pdf_cta_desc TEXT;`);   // 안내 문구

  // 무료사주 PDF 업셀 설정 (프리미엄 안내 · Q&A · 할인문구 · 후기이미지 · 만세력 해설)
  await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS free_promo JSONB;`);

  // 상담 신청 (랜딩 폼)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS leads (
      id          SERIAL PRIMARY KEY,
      teacher_id  INTEGER REFERENCES users(id),
      name        TEXT,
      gender      TEXT,
      birth       TEXT,
      calendar    TEXT,
      hour        TEXT,
      region      TEXT,
      phone       TEXT,
      email       TEXT,
      product     TEXT,
      memo        TEXT,
      status      TEXT DEFAULT '접수완료',
      source      TEXT DEFAULT '상담신청',
      created_at  TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  await pool.query(`ALTER TABLE leads ADD COLUMN IF NOT EXISTS source TEXT DEFAULT '상담신청';`);

  // 개인정보 자동 폐기 (발송 완료 후 3일 → 연락처·이메일 마스킹)
  await pool.query(`ALTER TABLE leads ADD COLUMN IF NOT EXISTS masked_at TIMESTAMPTZ;`);
  await pool.query(`ALTER TABLE leads ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMPTZ;`);
  // 이메일 말고 카톡 등으로 직접 전달한 경우를 구분한다
  await pool.query(`ALTER TABLE leads ADD COLUMN IF NOT EXISTS delivered_by TEXT;`);

  // 제작한 PDF (내담자별)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS pdfs (
      id          SERIAL PRIMARY KEY,
      teacher_id  INTEGER REFERENCES users(id),
      lead_id     INTEGER REFERENCES leads(id),
      type        TEXT,
      sections    JSONB,
      mail_sent   BOOLEAN DEFAULT FALSE,
      sent_at     TIMESTAMPTZ,
      sent_to     TEXT,
      created_at  TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  // 리포트 부가 데이터 (체크리스트 · 연애카드 등) — leads.js 에서 JSON 으로 저장
  await pool.query(`ALTER TABLE pdfs ADD COLUMN IF NOT EXISTS extra JSONB;`);

  // 내담자 공개 열람 링크 (/r/:token) — 로그인 없이 리포트를 보고 PDF로 저장
  await pool.query(`ALTER TABLE pdfs ADD COLUMN IF NOT EXISTS share_token TEXT;`);
  await pool.query(`CREATE UNIQUE INDEX IF NOT EXISTS idx_pdfs_share ON pdfs(share_token) WHERE share_token IS NOT NULL;`);

  // 무료사주 웹사이트 기록
  await pool.query(`
    CREATE TABLE IF NOT EXISTS free_logs (
      id             SERIAL PRIMARY KEY,
      teacher_id     INTEGER REFERENCES users(id),
      input          JSONB,
      result         JSONB,
      kakao_clicked  BOOLEAN DEFAULT FALSE,
      created_at     TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  // ⚠️ ALTER 는 반드시 CREATE 뒤에 (앞에 두면 새 DB에서 relation does not exist 로 서버가 안 뜸)
  await pool.query(`ALTER TABLE free_logs ADD COLUMN IF NOT EXISTS mail_sent BOOLEAN DEFAULT FALSE;`);
  await pool.query(`ALTER TABLE free_logs ADD COLUMN IF NOT EXISTS lead_id INTEGER;`);
  // 무료사주 PDF 공개 링크 (아이디만 바꿔서 남의 사주를 보는 걸 막는다)
  await pool.query(`ALTER TABLE free_logs ADD COLUMN IF NOT EXISTS share_token TEXT;`);
  await pool.query(`CREATE UNIQUE INDEX IF NOT EXISTS idx_free_share ON free_logs(share_token) WHERE share_token IS NOT NULL;`);

  // 내담자 추가질문 (리포트별 채팅방)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS chat_qa (
      id          SERIAL PRIMARY KEY,
      pdf_id      INTEGER REFERENCES pdfs(id) ON DELETE CASCADE,
      teacher_id  INTEGER REFERENCES users(id),
      question    TEXT,
      answer      TEXT,
      created_at  TIMESTAMPTZ DEFAULT NOW()
    );
  `);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_chat_qa_pdf ON chat_qa(pdf_id);`);

  // 내담자 후기 (리포트 링크에서 작성 → 교육생이 골라서 랜딩에 노출)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS reviews (
      id          SERIAL PRIMARY KEY,
      teacher_id  INTEGER REFERENCES users(id),
      pdf_id      INTEGER REFERENCES pdfs(id) ON DELETE SET NULL,
      lead_id     INTEGER,
      name        TEXT,           -- 표시 이름 (김*영)
      rating      INTEGER,        -- 1~5
      body        TEXT,
      photo       TEXT,           -- data URI (선택)
      shown       BOOLEAN DEFAULT FALSE,   -- 랜딩에 노출할지
      created_at  TIMESTAMPTZ DEFAULT NOW()
    );
  `);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_reviews_teacher ON reviews(teacher_id);`);
  await pool.query(`CREATE UNIQUE INDEX IF NOT EXISTS idx_reviews_pdf ON reviews(pdf_id) WHERE pdf_id IS NOT NULL;`);

  // 리포트 하단 후기 폼 표시 여부 (교육생이 켜고 끔, 기본 켜짐)
  await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS review_on BOOLEAN DEFAULT TRUE;`);
  // 후기 유도 문구 (교육생이 직접 작성 — 예: '후기를 남기시면 추가질문이 가능합니다')
  await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS review_notice TEXT;`);

  // ── PDF 표지 ──
  await pool.query(`
    CREATE TABLE IF NOT EXISTS cover_presets (
      id          SERIAL PRIMARY KEY,
      type        TEXT NOT NULL,
      name        TEXT,
      img         TEXT NOT NULL,
      style       TEXT DEFAULT 'circle',
      brand_top   REAL DEFAULT 18.2,
      active      BOOLEAN DEFAULT TRUE,
      sort        INTEGER DEFAULT 0,
      created_at  TIMESTAMPTZ DEFAULT NOW()
    );
  `);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_cover_presets_type ON cover_presets(type) WHERE active;`);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS teacher_covers (
      id          SERIAL PRIMARY KEY,
      teacher_id  INTEGER REFERENCES users(id) ON DELETE CASCADE,
      type        TEXT NOT NULL,
      img         TEXT NOT NULL,
      style       TEXT DEFAULT 'circle',
      brand_top   REAL DEFAULT 18.2,
      created_at  TIMESTAMPTZ DEFAULT NOW()
    );
  `);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_teacher_covers ON teacher_covers(teacher_id, type);`);

  // ── 표지 세트 ──
  // 교육생이 고른 세트 키 (null=세트 안 씀)
  await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS cover_set TEXT;`);
  // 교육생이 고른 본문 배경지 키 (null=기본 frame)
  await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS bg_paper TEXT;`);
  // 관리자가 만든 커스텀 세트 (기본 4세트는 코드 내장이라 여기 없음)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS cover_sets (
      set_key     TEXT PRIMARY KEY,
      name        TEXT NOT NULL,
      builtin     BOOLEAN DEFAULT FALSE,
      created_at  TIMESTAMPTZ DEFAULT NOW()
    );
  `);
  // 세트 안의 종류별 표지 (data URI)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS cover_set_items (
      id          SERIAL PRIMARY KEY,
      set_key     TEXT NOT NULL,
      type        TEXT NOT NULL,
      img         TEXT NOT NULL,
      style       TEXT DEFAULT 'plain',
      brand_top   REAL DEFAULT 18.2,
      created_at  TIMESTAMPTZ DEFAULT NOW()
    );
  `);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_cover_set_items ON cover_set_items(set_key, type);`);

  console.log('[DB] 준비 완료');
}

module.exports = { pool, initDb };
