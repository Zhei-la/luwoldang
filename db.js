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
  // 관리자 메모 (수강생이 누구인지 관리자가 적어두는 메모)
  await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS admin_note TEXT;`);

  // 랜딩 페이지 (빌더로 꾸민 내용 JSON)
  await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS landing JSONB;`);

  // 입금 계좌 안내 (유료 신청 접수 후 내담자에게 보여줌)
  await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS bank_name TEXT;`);    // 은행명
  await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS bank_account TEXT;`); // 계좌번호
  await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS bank_holder TEXT;`);  // 예금주
  await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS bank_notice TEXT;`);  // 추가 안내 문구

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

  // 랜딩 페이지 방문 기록 (방문자 통계용)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS page_visits (
      id          BIGSERIAL PRIMARY KEY,
      teacher_id  INTEGER REFERENCES users(id) ON DELETE CASCADE,
      visited_at  TIMESTAMPTZ DEFAULT NOW(),
      visitor_key TEXT
    );
  `);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_visits_teacher ON page_visits(teacher_id, visited_at);`);

  // 브라우저 알림 구독 정보 (기기마다 한 줄)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS push_subs (
      id          BIGSERIAL PRIMARY KEY,
      teacher_id  INTEGER REFERENCES users(id) ON DELETE CASCADE,
      endpoint    TEXT UNIQUE NOT NULL,
      p256dh      TEXT NOT NULL,
      auth        TEXT NOT NULL,
      created_at  TIMESTAMPTZ DEFAULT NOW()
    );
  `);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_push_teacher ON push_subs(teacher_id);`);

  // 개인정보 자동 폐기 (발송 완료 후 3일 → 연락처·이메일 마스킹)
  await pool.query(`ALTER TABLE leads ADD COLUMN IF NOT EXISTS masked_at TIMESTAMPTZ;`);
  await pool.query(`ALTER TABLE leads ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMPTZ;`);
  // 이메일 말고 카톡 등으로 직접 전달한 경우를 구분한다
  await pool.query(`ALTER TABLE leads ADD COLUMN IF NOT EXISTS delivered_by TEXT;`);

  // 연인궁합용 상대방 정보 (연인궁합 리포트일 때만 사용)
  await pool.query(`ALTER TABLE leads ADD COLUMN IF NOT EXISTS partner_name TEXT;`);
  await pool.query(`ALTER TABLE leads ADD COLUMN IF NOT EXISTS partner_gender TEXT;`);
  await pool.query(`ALTER TABLE leads ADD COLUMN IF NOT EXISTS partner_birth TEXT;`);
  await pool.query(`ALTER TABLE leads ADD COLUMN IF NOT EXISTS partner_hour TEXT;`);
  await pool.query(`ALTER TABLE leads ADD COLUMN IF NOT EXISTS partner_calendar TEXT;`);
  // 궁합 상대방 출생지 (비어 있으면 종전대로 서울 기준으로 계산)
  await pool.query(`ALTER TABLE leads ADD COLUMN IF NOT EXISTS partner_region TEXT;`);

  // 지역시(진태양시) 보정 사용 여부.
  // 기본 TRUE = 종전 동작 그대로. 체크를 풀면 표준시(시계 시각) 그대로 계산한다.
  await pool.query(`ALTER TABLE leads ADD COLUMN IF NOT EXISTS use_local_time BOOLEAN DEFAULT TRUE;`);

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
  // 발송 스냅샷: 한 번 발송하면 그 시점 리포트를 고정 보관 (나중에 수정해도 발송본은 안 바뀜)
  await pool.query(`ALTER TABLE pdfs ADD COLUMN IF NOT EXISTS sent_sections JSONB;`);
  await pool.query(`ALTER TABLE pdfs ADD COLUMN IF NOT EXISTS sent_meta JSONB;`);
  // 편집본이 발송본과 달라졌는지 (수정했지만 발송본에 미적용) 표시
  await pool.query(`ALTER TABLE pdfs ADD COLUMN IF NOT EXISTS edits_pending BOOLEAN DEFAULT FALSE;`);

  /* 표지에 얹는 상호명·내담자 정보의 위치를 교육생이 직접 고를 수 있게 한다.
     이 값이 없으면 직접 올린 표지는 늘 '위쪽 가로'로만 나온다. */
  for (const t of ['teacher_covers', 'cover_set_items', 'cover_presets']) {
    await pool.query(`ALTER TABLE ${t} ADD COLUMN IF NOT EXISTS brand_pos TEXT;`);
    await pool.query(`ALTER TABLE ${t} ADD COLUMN IF NOT EXISTS info_pos TEXT;`);
  }

  /* 만들 때 쓴 사주 설정을 그대로 찍어둔다 (지역시 보정 On/Off · 지역 등).
     이게 없으면 나중에 신청자 설정을 바꿨을 때 만세력만 다시 계산되어
     본문(이미 써서 저장된 글)과 서로 안 맞게 된다. */
  await pool.query(`ALTER TABLE pdfs ADD COLUMN IF NOT EXISTS saju_meta JSONB;`);

  /* ── 사주 자료집 ──
     관리자가 글과 사진을 올리면 로그인한 교육생이 읽는다.
     노션 링크와 달리 계정으로 막혀 있어, 수강이 끝난 사람은 자동으로 접근이 끊긴다. */
  await pool.query(`
    CREATE TABLE IF NOT EXISTS guide_cats (
      id    SERIAL PRIMARY KEY,
      name  TEXT NOT NULL,
      sort  INTEGER DEFAULT 0
    );
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS guide_posts (
      id         SERIAL PRIMARY KEY,
      cat_id     INTEGER REFERENCES guide_cats(id) ON DELETE SET NULL,
      title      TEXT NOT NULL,
      body       TEXT NOT NULL DEFAULT '',
      pinned     BOOLEAN DEFAULT FALSE,
      published  BOOLEAN DEFAULT TRUE,
      views      INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
  /* 사진은 파일이 아니라 DB 에 담는다. Railway 는 배포할 때마다 파일이 지워지기 때문이다. */
  await pool.query(`
    CREATE TABLE IF NOT EXISTS guide_images (
      id         SERIAL PRIMARY KEY,
      post_id    INTEGER REFERENCES guide_posts(id) ON DELETE CASCADE,
      img        TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
  /* 글쓰기 화면이 블로그 방식으로 바뀌면서 본문이 HTML 로 저장된다.
     예전에 쓴 글은 그대로 두고, 이 값으로 어느 방식인지 구분한다. */
  await pool.query(`ALTER TABLE guide_posts ADD COLUMN IF NOT EXISTS format TEXT DEFAULT 'html';`);
  /* ── 판매 페이지 설정 ──
     기수·금액·모집 인원처럼 자주 바뀌는 값을 한곳에 둔다.
     판매 페이지가 이 값을 읽어가 화면을 채운다. */
  await pool.query(`
    CREATE TABLE IF NOT EXISTS lp_settings (
      id           INTEGER PRIMARY KEY DEFAULT 1,
      cohort       TEXT    DEFAULT '3기',
      price        INTEGER DEFAULT 70,      -- 계좌이체가 (만원)
      list_price   INTEGER DEFAULT 80,      -- 정가 (만원)
      next_cohort  TEXT    DEFAULT '4기',
      next_price   INTEGER DEFAULT 110,
      seats        INTEGER DEFAULT 10,
      deadline     TEXT    DEFAULT '2026년 11월',
      ladder       TEXT    DEFAULT '1기 30만 / 50만 / 2기 60만',
      early_until  TEXT    DEFAULT '9월 30일',    -- 이때까지가 사전예약가
      late_price   INTEGER DEFAULT 80,            -- 그 뒤 금액 (만원)
      live_date    TEXT    DEFAULT '9월 19일',    -- 무료 설명회 라이브
      live_url     TEXT    DEFAULT 'https://open.kakao.com/o/gdlttwDi',
      updated_at   TIMESTAMPTZ DEFAULT NOW(),
      CONSTRAINT lp_settings_one CHECK (id = 1)
    );
  `);
  /* 나중에 늘어난 칸은 하나씩 더한다 (이미 표가 있는 경우) */
  for (const [col, def] of [
    ['early_until', "TEXT DEFAULT '9월 30일'"],
    ['late_price',  'INTEGER DEFAULT 80'],
    ['live_date',   "TEXT DEFAULT '9월 19일'"],
    ['live_url',    "TEXT DEFAULT 'https://open.kakao.com/o/gdlttwDi'"],
    ['ebook_price', 'INTEGER DEFAULT 89000'],      /* 전자책 얼리버드가 */
    ['ebook_step',  'INTEGER DEFAULT 30000'],      /* 몇 명마다 얼마 오르는지 */
    ['ebook_seats', 'INTEGER DEFAULT 10'],
  ]) {
    await pool.query(`ALTER TABLE lp_settings ADD COLUMN IF NOT EXISTS ${col} ${def};`);
  }
  await pool.query(`INSERT INTO lp_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;`);
  /* 신청 마감 기본값을 10월 31일로 */
  await pool.query(`UPDATE lp_settings SET deadline='10월 31일' WHERE id=1 AND deadline='2026년 11월';`);
  /* 일정 조정 — 라이브 당일까지 사전예약가, 이후 10월 10일 마감 */
  await pool.query(`UPDATE lp_settings SET live_date='9월 30일' WHERE id=1 AND live_date='9월 19일';`);
  await pool.query(`UPDATE lp_settings SET early_until='9월 30일' WHERE id=1 AND early_until='9월 30일';`);
  await pool.query(`UPDATE lp_settings SET deadline='10월 10일' WHERE id=1 AND deadline='10월 31일';`);

  /* ── 판매 페이지 후기 ──
     관리자가 직접 사진과 글을 올려 관리한다.
     판매 페이지(/lp/)는 여기서 읽어와 보여준다. */
  await pool.query(`
    CREATE TABLE IF NOT EXISTS lp_reviews (
      id        SERIAL PRIMARY KEY,
      img       TEXT,            -- 올린 사진 (없으면 글만 나온다)
      img_url   TEXT,            -- 이미 파일로 있는 사진을 가리킬 때
      body      TEXT NOT NULL DEFAULT '',
      who       TEXT,            -- 예: 1기 수강생
      sort      INTEGER DEFAULT 0,
      published BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
  /* 처음 한 번만 — 지금 판매 페이지에 있는 후기를 그대로 옮겨둔다 */
  const lr = await pool.query('SELECT COUNT(*)::int AS n FROM lp_reviews');
  if (!lr.rows[0].n) {
    await pool.query(`
      INSERT INTO lp_reviews (img_url, body, who, sort) VALUES
      ('/lp/img/rev-letter.jpg',
       '7월 11일에 시작했는데 처음엔 생각보다 쉽지 않았어요. 중간에 포기하고 싶은 마음도 있었지만, 1:1 피드백을 받으면서 하나씩 방향을 잡아갈 수 있었습니다.

그 결과 24일부터 첫 수익이 발생했고, 현재까지 총 175,000원의 수익을 만들었습니다. 저에게는 ''정말 되는구나''라는 확신을 갖게 해준 첫 결과였어요.',
       '1기 수강생', 10),
      ('/lp/img/rev-cafe.jpg', '7월 시작하고 총 30만원 정도 벌었네요! 인증합니다 :)', '1기 수강생 · 카페 인증글', 20),
      ('/lp/img/rev-bank1.jpg',
       '저녁에 게시글 하나 올릴 때마다 1~2개씩 전환이 이루어져서 다행입니다 ^^
총 223,000원. 얼른 수강비 벌러 떠나보시죠!!',
       '1기 수강생', 30),
      ('/lp/img/rev-bank2.jpg',
       '어제 첫 수익으로 5천원 벌고 오늘 4만원 벌었어요 😊
4만 5천원으로 정정하겠습니다 ㅋㅋㅋ',
       '수강 시작 직후 수강생', 40),
      ('/lp/img/rev-kakao.jpg',
       '하나하나 물어보고 해야겠어요 ㅋㅋㅋㅋㅋ
바로바로 피드백 오니 이리 든든할 수가 없어요~~!!!',
       '수강생 카톡 대화 중', 50)
    `);
  }

  /* 후기 말고 '프로그램 실제 화면'도 같은 표에 담는다 (kind 로 구분) */
  await pool.query(`ALTER TABLE lp_reviews ADD COLUMN IF NOT EXISTS kind TEXT DEFAULT 'review';`);
  await pool.query(`ALTER TABLE lp_reviews ADD COLUMN IF NOT EXISTS title TEXT;`);
  const sh = await pool.query("SELECT COUNT(*)::int AS n FROM lp_reviews WHERE kind='shot'");
  if (!sh.rows[0].n) {
    /* 노션 안내에 있던 화면 설명을 그대로 옮겨둔다. 사진은 관리자가 올린다. */
    await pool.query(`
      INSERT INTO lp_reviews (kind, title, body, sort) VALUES
      ('shot','개인 사주 웹사이트','금액·문구·디자인을 바꿀 수 있는 내 사주 사이트. 무료사주로 카톡 유도하는 방식과 바로 신청받는 방식 모두 들어 있습니다.',10),
      ('shot','PDF 생성기 · 메일 자동 발송','신청자 목록에서 바로 여러 종류의 리포트를 만들고, 내 사주 이름으로 메일까지 보냅니다.',20),
      ('shot','내담자 추가질문 응대','리포트를 읽은 AI가 추가 질문에 답을 정리해 줍니다. 내담자 질문을 복사해 넣기만 하면 됩니다.',30),
      ('shot','나만의 웹사이트 꾸미기','글은 기본, 사진도 넣을 수 있습니다. 원하는 색과 모양으로 바꿔 보세요.',40),
      ('shot','PDF 표지 고르기 · 직접 만들기','다른 분과 겹치지 않게 표지를 고를 수 있고, 내 표지를 직접 넣을 수도 있습니다.',50),
      ('shot','실제 명리학자가 만든 만세력 계산기','루월당에서만 쓰는 사주 명식 엔진입니다. 어려운 사주 용어까지 풀어서 나옵니다.',60)
    `);
  }

  /* 나중에 늘어난 화면 항목은 제목으로 확인해 하나씩 넣는다
     (앞의 6개가 이미 있어도 새 것만 들어간다) */
  for (const [t, b, so] of [
    ['프로그램 안에 정리된 교육생 자료집',
     '스레드 글쓰기부터 상담까지, 화면을 하나하나 캡처해 순서대로 정리해 두었습니다. 궁금한 게 생기면 프로그램 안에서 바로 찾아보실 수 있습니다.', 70],
    ['매일 사주 브리핑 (일진첩)',
     '매일 밤 11시에 다음날 일진으로 자동 갱신됩니다. 그날의 총운과 띠별 풀이, 스레드에 바로 올릴 원고 5종, 블로그·카페용 프롬프트까지 준비돼 있습니다.', 65],
    ['상담 응대 · 대처법 매뉴얼',
     '"이거 AI 돌린 거 아니에요?" "안 맞는 것 같아요" 같은 곤란한 질문부터 환불 요청·폭언까지, 실제로 어떻게 답할지 상황별로 정리해 두었습니다.', 80],
  ]) {
    await pool.query(
      `INSERT INTO lp_reviews (kind, title, body, sort)
       SELECT 'shot', $1, $2, $3
        WHERE NOT EXISTS (SELECT 1 FROM lp_reviews WHERE kind='shot' AND title=$1)`,
      [t, b, so]
    );
  }

  /* 후기 한 건에 사진을 여러 장 넣을 수 있게 따로 보관한다 */
  await pool.query(`
    CREATE TABLE IF NOT EXISTS lp_review_imgs (
      id        SERIAL PRIMARY KEY,
      review_id INTEGER REFERENCES lp_reviews(id) ON DELETE CASCADE,
      img       TEXT,
      img_url   TEXT,
      sort      INTEGER DEFAULT 0
    );
  `);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_lp_rimg ON lp_review_imgs(review_id, sort, id);`);
  /* 예전에 한 장씩 넣어둔 사진을 옮긴다 (한 번만 일어난다) */
  await pool.query(`
    INSERT INTO lp_review_imgs (review_id, img, img_url, sort)
    SELECT r.id, r.img, r.img_url, 10
      FROM lp_reviews r
     WHERE (r.img IS NOT NULL OR r.img_url IS NOT NULL)
       AND NOT EXISTS (SELECT 1 FROM lp_review_imgs i WHERE i.review_id = r.id);
  `);

  /* ── 공지사항 ──
     관리자가 올리면 교육생 홈에 일정 기간 팝업으로 뜬다. */
  await pool.query(`
    CREATE TABLE IF NOT EXISTS notices (
      id         SERIAL PRIMARY KEY,
      title      TEXT NOT NULL,
      body       TEXT NOT NULL DEFAULT '',
      popup      BOOLEAN DEFAULT TRUE,      -- 홈에 팝업으로 띄울지
      popup_days INTEGER DEFAULT 7,         -- 며칠 동안 띄울지
      published  BOOLEAN DEFAULT TRUE,
      views      INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
  /* 공지 분류 — 자료집과 같은 방식으로 관리자가 직접 만들고 고친다 */
  await pool.query(`
    CREATE TABLE IF NOT EXISTS notice_cats (
      id   SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      sort INTEGER DEFAULT 0
    );
  `);
  await pool.query(`ALTER TABLE notices ADD COLUMN IF NOT EXISTS cat_id INTEGER REFERENCES notice_cats(id) ON DELETE SET NULL;`);
  const nc = await pool.query('SELECT COUNT(*)::int AS n FROM notice_cats');
  if (!nc.rows[0].n) {
    await pool.query(
      `INSERT INTO notice_cats (name, sort) VALUES ('일반',10),('업데이트',20),('일정 안내',30)`
    );
  }

  /* 공지에 영상 넣기 — 유튜브 일부공개 링크를 붙인다.
     영상 파일을 직접 담으면 용량이 커서 느려지고 요금도 많이 든다. */
  await pool.query(`ALTER TABLE notices ADD COLUMN IF NOT EXISTS video_url TEXT;`);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS notice_images (
      id        SERIAL PRIMARY KEY,
      notice_id INTEGER REFERENCES notices(id) ON DELETE CASCADE,
      img       TEXT NOT NULL
    );
  `);

  /* ── 문의하기 ──
     교육생이 남기면 관리자에게 알림이 가고,
     답변을 달면 남긴 사람에게 알림이 간다.
     내가 쓴 것만 보이고 남의 글은 보이지 않는다. */
  await pool.query(`
    CREATE TABLE IF NOT EXISTS inquiries (
      id          SERIAL PRIMARY KEY,
      teacher_id  INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      kind        TEXT NOT NULL DEFAULT '기타',   -- 기능 요청 / 오류 / 문의 / 기타
      title       TEXT NOT NULL,
      body        TEXT NOT NULL DEFAULT '',
      answer      TEXT,
      answered_at TIMESTAMPTZ,
      created_at  TIMESTAMPTZ DEFAULT NOW()
    );
  `);
  /* 문의에 붙이는 사진 — 화면을 캡처해서 같이 보내면 훨씬 빨리 파악된다 */
  await pool.query(`
    CREATE TABLE IF NOT EXISTS inquiry_imgs (
      id         SERIAL PRIMARY KEY,
      inquiry_id INTEGER REFERENCES inquiries(id) ON DELETE CASCADE,
      img        TEXT NOT NULL,
      sort       INTEGER DEFAULT 0
    );
  `);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_inq_img ON inquiry_imgs(inquiry_id, sort, id);`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_inq_teacher ON inquiries(teacher_id, created_at DESC);`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_inq_open ON inquiries(answered_at NULLS FIRST, created_at DESC);`);

  /* ── 자료집 주차별 공개 ──
     0 = 언제나 보임
     1~4 = 승인일로부터 그 주차가 되면 열림
     5 = 4주차가 다 지난 뒤에 열림 (지금의 전체 자료집) */
  await pool.query(`ALTER TABLE guide_posts ADD COLUMN IF NOT EXISTS week INTEGER DEFAULT 0;`);
  /* 교육생마다 시작일을 따로 둘 수 있게 (비어 있으면 승인일을 쓴다).
     ⚠️ 아래에서 이 칸을 쓰므로 반드시 먼저 만들어야 한다. */
  await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS guide_start TIMESTAMPTZ;`);

  /* ── 주차별 과제 ──
     한 주에 하나씩. 앞 주차 과제를 마쳐야 다음 과제가 열린다. */
  await pool.query(`
    CREATE TABLE IF NOT EXISTS guide_tasks (
      week      INTEGER PRIMARY KEY,
      title     TEXT NOT NULL DEFAULT '',
      body      TEXT NOT NULL DEFAULT '',
      published BOOLEAN DEFAULT TRUE,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS guide_task_done (
      teacher_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      week       INTEGER NOT NULL,
      note       TEXT,
      done_at    TIMESTAMPTZ DEFAULT NOW(),
      PRIMARY KEY (teacher_id, week)
    );
  `);

  /* 주차마다 제목을 붙일 수 있게 */
  await pool.query(`
    CREATE TABLE IF NOT EXISTS guide_weeks (
      week     INTEGER PRIMARY KEY,
      title    TEXT NOT NULL DEFAULT '',
      subtitle TEXT
    );
  `);
  const gw = await pool.query('SELECT COUNT(*)::int AS n FROM guide_weeks');
  if (!gw.rows[0].n) {
    await pool.query(`
      INSERT INTO guide_weeks (week, title) VALUES
      (0,'프롤로그'),(1,'1주차'),(2,'2주차'),(3,'3주차'),(4,'4주차'),(5,'총정리')
    `);
  }

  /* 한 번만 하는 정리 — 이미 올려둔 자료를 '전체 자료집'(4주차 완료 후)으로 옮긴다.
     1~4주차는 비워두고 관리자가 직접 채운다.
     두 번 돌면 나중에 정한 주차가 지워지므로 표시를 남겨 한 번만 하게 한다. */
  await pool.query(`
    CREATE TABLE IF NOT EXISTS app_flags (
      key  TEXT PRIMARY KEY,
      done TIMESTAMPTZ DEFAULT NOW()
    );
  `);
  /* 이미 가입해 계신 분들은 주차 제한 없이 전부 보시게 한다.
     3기부터 새로 들어오는 분들만 주차별로 열린다. */
  const openFlag = await pool.query("SELECT 1 FROM app_flags WHERE key = 'guide_open_existing_v2'");
  if (!openFlag.rowCount) {
    /* 지금까지 가입한 분은 모두 전부 열어 드린다.
       (앞선 판이 중간에 멈춰 적용되지 않은 경우가 있어 다시 한 번 돌린다) */
    const r = await pool.query(
      `UPDATE users SET guide_start = NOW() - INTERVAL '60 days'
        WHERE role <> 'admin'`
    );
    await pool.query("INSERT INTO app_flags (key) VALUES ('guide_open_existing_v2')");
    console.log('[자료집] 기존 교육생 ' + r.rowCount + '명에게 전체 자료를 열었습니다.');
  }

  const flag = await pool.query("SELECT 1 FROM app_flags WHERE key = 'guide_week_init'");
  if (!flag.rowCount) {
    await pool.query('UPDATE guide_posts SET week = 5 WHERE COALESCE(week, 0) = 0');
    await pool.query("INSERT INTO app_flags (key) VALUES ('guide_week_init')");
    console.log('[자료집] 기존 자료를 전체 자료집(4주차 완료 후)으로 옮겼습니다.');
  }

  /* 누가 어떤 자료를 언제 봤는지 남긴다.
     캡처가 돌아다닐 때 어느 계정에서 나갔는지 좁힐 수 있다. */
  await pool.query(`
    CREATE TABLE IF NOT EXISTS guide_views (
      id         SERIAL PRIMARY KEY,
      post_id    INTEGER REFERENCES guide_posts(id) ON DELETE CASCADE,
      teacher_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      viewed_at  TIMESTAMPTZ DEFAULT NOW()
    );
  `);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_guide_views ON guide_views(post_id, viewed_at DESC);`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_guide_posts_cat ON guide_posts(cat_id, pinned DESC, created_at DESC);`);

  /* 처음 한 번만 기본 분류를 넣어준다 */
  const gc = await pool.query('SELECT COUNT(*)::int AS n FROM guide_cats');
  if (!gc.rows[0].n) {
    await pool.query(
      `INSERT INTO guide_cats (name, sort) VALUES ('기초',10),('실전',20),('상담 응대',30),('마케팅',40)`
    );
  }

  /* 만세력 계산기에서 저장한 사주.
     예전에는 교육생 브라우저 안에만 저장돼서 PC 에서 저장한 것이 폰에서 안 보였다.
     계정에 묶어 두면 어느 기기에서 열어도 같은 목록이 나온다. */
  await pool.query(`
    CREATE TABLE IF NOT EXISTS manse_saved (
      id         SERIAL PRIMARY KEY,
      teacher_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      filename   TEXT    NOT NULL,
      type       TEXT    NOT NULL DEFAULT '개인',
      data       JSONB   NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE (teacher_id, filename)
    );
  `);
  /* 예전에 만들어진 표에는 없던 칸이 있을 수 있다.
     칸이 하나라도 없으면 목록 조회가 통째로 실패해 '불러오지 못했습니다'만 나온다. */
  for (const [col, def] of [
    ['type',       "TEXT NOT NULL DEFAULT '개인'"],
    ['data',       "JSONB NOT NULL DEFAULT '{}'::jsonb"],
    ['created_at', 'TIMESTAMPTZ DEFAULT NOW()'],
    ['updated_at', 'TIMESTAMPTZ DEFAULT NOW()'],
  ]) {
    await pool.query(`ALTER TABLE manse_saved ADD COLUMN IF NOT EXISTS ${col} ${def};`);
  }
  /* 덮어쓰기(ON CONFLICT)가 되려면 이 짝이 유일해야 한다 */
  await pool.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
         WHERE conrelid = 'manse_saved'::regclass AND contype = 'u'
      ) THEN
        ALTER TABLE manse_saved ADD CONSTRAINT manse_saved_teacher_file UNIQUE (teacher_id, filename);
      END IF;
    END $$;
  `);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_manse_saved_teacher ON manse_saved(teacher_id, updated_at DESC);`);

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
  // 후기 링크 — 교육생이 직접 넣는다 (당근·네이버 등). 비어 있으면 버튼을 안 띄운다
  await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS review_link TEXT;`);

  /* 리포트 생성 작업 — 창을 닫아도 뒤에서 계속 만들기 위해 상태를 여기에 둔다 */
  await pool.query(`
    CREATE TABLE IF NOT EXISTS pdf_jobs (
      id          SERIAL PRIMARY KEY,
      teacher_id  INTEGER NOT NULL,
      lead_id     INTEGER NOT NULL,
      type        TEXT    NOT NULL,
      status      TEXT    NOT NULL DEFAULT 'running',  -- running | done | error
      done        INTEGER NOT NULL DEFAULT 0,
      total       INTEGER NOT NULL DEFAULT 0,
      title       TEXT,
      pdf_id      INTEGER,
      error       TEXT,
      created_at  TIMESTAMPTZ DEFAULT NOW(),
      updated_at  TIMESTAMPTZ DEFAULT NOW()
    );
  `);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_pdf_jobs_lead ON pdf_jobs(lead_id, created_at DESC);`);

  // 서버가 재시작되면 돌던 작업은 사라진다. 남아 있는 '진행 중'을 정리한다.
  await pool.query(
    `UPDATE pdf_jobs SET status='error', error='서버가 다시 시작되어 중단되었습니다. 다시 만들어주세요.', updated_at=NOW()
     WHERE status='running'`
  ).catch(() => {});

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

  /* 운세별 본문 배경지 — 올린 종류만 이걸 쓰고, 나머지는 고른 기본 배경지를 쓴다 */
  await pool.query(`
    CREATE TABLE IF NOT EXISTS teacher_bg_papers (
      id          SERIAL PRIMARY KEY,
      teacher_id  INTEGER REFERENCES users(id) ON DELETE CASCADE,
      type        TEXT NOT NULL,
      img         TEXT NOT NULL,
      created_at  TIMESTAMPTZ DEFAULT NOW()
    );
  `);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_teacher_bg ON teacher_bg_papers(teacher_id, type);`);

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
