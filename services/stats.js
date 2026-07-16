/**
 * stats.js — 방문자 / 신청 / 전환 통계
 */

const { pool } = require('../db');

/** 랜딩 방문 1건 기록 (같은 방문자 30분 내 중복은 무시) */
async function recordVisit(teacherId, visitorKey) {
  if (!teacherId) return;
  try {
    // 30분 내 같은 visitor_key 방문이 있으면 중복으로 보고 스킵
    if (visitorKey) {
      const dup = await pool.query(
        `SELECT 1 FROM page_visits
         WHERE teacher_id = $1 AND visitor_key = $2
           AND visited_at > NOW() - INTERVAL '30 minutes' LIMIT 1`,
        [teacherId, visitorKey]
      );
      if (dup.rows[0]) return;
    }
    await pool.query(
      'INSERT INTO page_visits (teacher_id, visitor_key) VALUES ($1, $2)',
      [teacherId, visitorKey || null]
    );
  } catch (e) { /* 통계 실패가 페이지를 막지 않도록 조용히 무시 */ }
}

/** 한 교육생의 통계 (teacherId 지정) 또는 전체(null=관리자) */
async function getStats(teacherId) {
  const where = teacherId ? 'WHERE teacher_id = $1' : '';
  const params = teacherId ? [teacherId] : [];
  const leadWhere = teacherId ? 'WHERE l.teacher_id = $1' : '';

  // 방문 (오늘 / 전체)
  const visitToday = await pool.query(
    `SELECT COUNT(*)::int AS n FROM page_visits ${where ? where + ' AND' : 'WHERE'} visited_at::date = NOW()::date`,
    params
  );
  const visitTotal = await pool.query(
    `SELECT COUNT(*)::int AS n FROM page_visits ${where}`, params
  );

  // 신청 (무료사주 / 상담신청 / 전체) — 전체 기간
  const leads = await pool.query(
    `SELECT
       COUNT(*) FILTER (WHERE source = '무료사주')::int AS free_cnt,
       COUNT(*) FILTER (WHERE source = '상담신청')::int AS consult_cnt,
       COUNT(*)::int AS total_cnt
     FROM leads l ${leadWhere}`,
    params
  );

  // 유료 발송 (유료 리포트 = FREE 아닌 것, mail_sent) — 전환 계산용
  const paid = await pool.query(
    `SELECT COUNT(DISTINCT p.lead_id)::int AS n
     FROM pdfs p ${teacherId ? 'WHERE p.teacher_id = $1 AND' : 'WHERE'} p.mail_sent = TRUE AND p.type <> '무료사주'`,
    params
  );

  const visits = visitTotal.rows[0].n;
  const totalLeads = leads.rows[0].total_cnt;
  const paidCount = paid.rows[0].n;

  // 전환율: 방문→신청, 신청→유료
  const visitToLead = visits > 0 ? Math.round((totalLeads / visits) * 1000) / 10 : 0;
  const leadToPaid = totalLeads > 0 ? Math.round((paidCount / totalLeads) * 1000) / 10 : 0;

  return {
    visitToday: visitToday.rows[0].n,
    visitTotal: visits,
    freeCnt: leads.rows[0].free_cnt,
    consultCnt: leads.rows[0].consult_cnt,
    totalLeads,
    paidCount,
    visitToLead,   // 방문 대비 신청 전환율 (%)
    leadToPaid,    // 신청 대비 유료 전환율 (%)
  };
}

module.exports = { recordVisit, getStats };
