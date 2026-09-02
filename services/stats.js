/**
 * stats.js — 방문자 / 신청 / 전환 통계
 */

const { pool } = require('../db');

/** 랜딩 방문 1건 기록 (같은 방문자 30분 내 중복은 무시) */
async function recordVisit(teacherId, visitorKey, kind) {
  if (!teacherId) return;
  try {
    // 30분 내 같은 visitor_key 방문이 있으면 중복으로 보고 스킵
    if (visitorKey) {
      /* 예전에는 30분 안의 재방문을 통째로 버렸다. 그러면 조회수가 안 쌓인다.
         새로고침만 걸러내면 되므로 1분으로 줄이고, 화면 종류별로 따로 본다. */
      const dup = await pool.query(
        `SELECT 1 FROM page_visits
         WHERE teacher_id = $1 AND visitor_key = $2
           AND COALESCE(kind, '') = COALESCE($3, '')
           AND visited_at > NOW() - INTERVAL '60 seconds' LIMIT 1`,
        [teacherId, visitorKey, kind || null]
      );
      if (dup.rows[0]) return;
    }
    await pool.query(
      'INSERT INTO page_visits (teacher_id, visitor_key, kind) VALUES ($1, $2, $3)',
      [teacherId, visitorKey || null, kind || null]
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
    `SELECT COUNT(*)::int AS n FROM page_visits ${where ? where + ' AND' : 'WHERE'} (visited_at AT TIME ZONE 'Asia/Seoul')::date = (NOW() AT TIME ZONE 'Asia/Seoul')::date`,
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

/** 지금 이 페이지를 보고 있는 사람 수 — 최근 30분 방문자(실제 기록) */
async function viewingNow(teacherId) {
  if (!teacherId) return 0;
  try {
    const { rows } = await pool.query(
      `SELECT COUNT(DISTINCT visitor_key)::int AS n
       FROM page_visits
       WHERE teacher_id = $1 AND visited_at > NOW() - INTERVAL '30 minutes'`,
      [teacherId]
    );
    return rows[0] ? rows[0].n : 0;
  } catch (e) {
    return 0;   // 통계 실패가 페이지를 막지 않도록
  }
}

/* ══════════════════════════════════════════════
 * 하루 통계 — 방문자 · 조회 · 만세력 · 신청
 *
 *   방문자 : 다녀간 사람 수 (같은 사람은 하루에 한 번만)
 *   조회   : 화면을 연 횟수 (같은 사람이 여러 번 보면 그만큼)
 *   만세력 : 만세력 결과를 본 횟수
 *   신청   : 신청서를 넣은 사람 수
 *
 *   날짜는 모두 한국 시간 기준이다. 서버는 UTC 로 도는데
 *   그대로 세면 밤 9시부터 다음 날로 넘어가 버린다.
 * ══════════════════════════════════════════════ */

const KST = "AT TIME ZONE 'Asia/Seoul'";

/**
 * 최근 N일 하루별 통계 (오늘 포함, 옛날 → 오늘 순)
 * @returns [{ day:'2026-08-31', label:'8/31', dow:'월', visitors, views, manse, joins, today }]
 */
async function dailyStats(teacherId, days = 7) {
  const n = Math.min(60, Math.max(1, Number(days) || 7));
  const empty = () => {
    const out = [];
    const now = new Date(Date.now() + 9 * 3600 * 1000);
    for (let i = n - 1; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 86400000);
      const key = d.toISOString().slice(0, 10);
      out.push({
        day: key,
        label: (d.getUTCMonth() + 1) + '/' + d.getUTCDate(),
        dow: ['일', '월', '화', '수', '목', '금', '토'][d.getUTCDay()],
        visitors: 0, views: 0, manse: 0, joins: 0, today: i === 0,
      });
    }
    return out;
  };

  const rows = empty();
  const at = {};
  rows.forEach((r) => { at[r.day] = r; });

  try {
    /* 방문 — 사람 수와 열어본 횟수를 한 번에 */
    const v = await pool.query(
      `SELECT (visited_at ${KST})::date::text AS day,
              COUNT(DISTINCT visitor_key)::int AS visitors,
              COUNT(*)::int                    AS views,
              COUNT(*) FILTER (WHERE kind = 'manse_result')::int AS manse
         FROM page_visits
        WHERE teacher_id = $1
          AND visited_at >= (NOW() ${KST})::date - ($2::int - 1)
        GROUP BY 1`,
      [teacherId, n]
    );
    v.rows.forEach((r) => {
      const t = at[r.day];
      if (t) { t.visitors = r.visitors; t.views = r.views; t.manse = r.manse; }
    });

    /* 신청 — 사주 신청자 목록에 들어온 수 */
    const j = await pool.query(
      `SELECT (created_at ${KST})::date::text AS day, COUNT(*)::int AS joins
         FROM leads
        WHERE teacher_id = $1
          AND created_at >= (NOW() ${KST})::date - ($2::int - 1)
        GROUP BY 1`,
      [teacherId, n]
    );
    j.rows.forEach((r) => { if (at[r.day]) at[r.day].joins = r.joins; });
  } catch (e) {
    console.error('[통계] 하루별 집계 실패:', e.message);
  }

  return rows;
}

/** 두 묶음의 합계와 증감 */
function sumOf(list) {
  return list.reduce((a, r) => ({
    visitors: a.visitors + r.visitors,
    views: a.views + r.views,
    manse: a.manse + r.manse,
    joins: a.joins + r.joins,
  }), { visitors: 0, views: 0, manse: 0, joins: 0 });
}

function diffPct(now, before) {
  if (!before) return now > 0 ? null : 0;   // 지난주가 0이면 %로 못 잰다
  return Math.round(((now - before) / before) * 100);
}

/**
 * 홈에 띄울 한 덩어리 — 오늘 / 최근 7일 / 지난 7일 비교
 */
async function homeStats(teacherId, days = 7) {
  const all = await dailyStats(teacherId, days * 2);
  const prev = all.slice(0, days);
  const week = all.slice(days);
  const today = week[week.length - 1] || { visitors: 0, views: 0, manse: 0, joins: 0 };
  const yday = week[week.length - 2] || { visitors: 0, views: 0, manse: 0, joins: 0 };

  const a = sumOf(week), b = sumOf(prev);
  const cmp = {};
  ['visitors', 'views', 'manse', 'joins'].forEach((k) => {
    cmp[k] = { now: a[k], before: b[k], pct: diffPct(a[k], b[k]) };
  });

  /* 막대 높이를 그리려면 그 주에서 가장 큰 값이 필요하다 */
  const peak = week.reduce((m, r) => Math.max(m, r.visitors, r.views), 0) || 1;

  return { days, week, today, yday, cmp, peak, sum: a, prevSum: b };
}

module.exports = { recordVisit, getStats, viewingNow, dailyStats, homeStats };
