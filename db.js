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

  console.log('[DB] 준비 완료');
}

module.exports = { pool, initDb };
