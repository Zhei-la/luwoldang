/**
 * privacy.js — 개인정보 자동 마스킹
 *
 * 발송 완료(delivered_at) 후 7일이 지난 상담신청(leads)의 개인정보를 가린다.
 *   - 고객 안내는 "3일 후 파기"로 하되, 실제로는 7일 유예를 둔다 (문의 대비).
 *   - 이미 발송된 리포트(pdfs.sent_sections)는 건드리지 않으므로,
 *     내담자가 받은 리포트 링크는 그대로 열린다.
 *   - masked_at 을 기록해 중복 실행을 막는다.
 */

const { pool } = require('../db');

const MASK_AFTER_DAYS = 7;

/** 개인정보 마스킹 1회 실행. 마스킹된 건수 반환. */
async function runMasking() {
  try {
    const { rows } = await pool.query(
      `UPDATE leads
          SET name     = CASE WHEN name IS NOT NULL AND name <> ''
                              THEN LEFT(name, 1) || '○○' ELSE name END,
              phone    = CASE WHEN phone IS NOT NULL AND phone <> '' THEN '***-****-****' ELSE phone END,
              email    = CASE WHEN email IS NOT NULL AND email <> '' THEN '***@***' ELSE email END,
              birth    = CASE WHEN birth IS NOT NULL AND birth <> '' THEN '****-**-**' ELSE birth END,
              hour     = CASE WHEN hour  IS NOT NULL AND hour  <> '' THEN '**' ELSE hour END,
              calendar = NULL,
              region   = NULL,
              gender   = NULL,
              memo     = CASE WHEN memo IS NOT NULL AND memo <> '' THEN '(파기됨)' ELSE memo END,
              masked_at = NOW()
        WHERE delivered_at IS NOT NULL
          AND masked_at IS NULL
          AND delivered_at < NOW() - INTERVAL '${MASK_AFTER_DAYS} days'
        RETURNING id`
    );
    if (rows.length) {
      console.log(`[개인정보] ${rows.length}건 마스킹 완료 (발송 ${MASK_AFTER_DAYS}일 경과)`);
    }
    return rows.length;
  } catch (e) {
    console.error('[개인정보] 마스킹 실패:', e.message);
    return 0;
  }
}

/**
 * 주기적 마스킹 시작.
 *   서버 기동 직후 1회 + 이후 6시간마다.
 */
function startMaskingSchedule() {
  // 기동 20초 뒤 첫 실행 (DB 준비 여유)
  setTimeout(runMasking, 20 * 1000);
  // 6시간마다
  setInterval(runMasking, 6 * 60 * 60 * 1000);
}

module.exports = { runMasking, startMaskingSchedule, MASK_AFTER_DAYS };
