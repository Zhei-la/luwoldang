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

  console.log('[DB] 준비 완료');
}

module.exports = { pool, initDb };
