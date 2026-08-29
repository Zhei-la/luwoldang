/* ============================================================
 * services/threads/tail.js — 글 끝에 붙는 꼬리말
 *
 * 두 가지가 붙는다.
 *
 *   1) 고정 멘트 — 적어두면 올리는 글마다 매번 붙는다.
 *   2) 신청 링크 — 매번 붙이면 광고 계정으로 몰려 노출이 줄고,
 *      심하면 계정이 정지된다. 그래서 일주일에 몇 번만 붙인다 (1~3번).
 *
 * 꼬리말은 본문에 이어 붙이지 않고 **맨 뒤에 답글 한 편으로** 나간다.
 * 본문에 이어 붙이면 500자를 넘겨버리고, 나중에 글을 고칠 때 멘트가
 * 딸려 들어가 두 번 붙는 사고가 난다. 따로 두면 그럴 일이 없다.
 *
 * 링크를 언제 붙일지는 주 단위로 흩뿌린다 —
 * 남은 횟수 ÷ 남은 날수 를 확률로 쓴다.
 * 이러면 월요일에 몰아 쓰지도, 주말에 못 쓰고 넘기지도 않는다.
 * ============================================================ */

const { pool } = require('../../db');

const TZ_OFFSET_MS = 9 * 60 * 60 * 1000;    // 한국 시각. 서버는 UTC 로 돈다.

/** 그 시각이 속한 주의 월요일 0시 (한국 기준) 를 UTC 시각으로 준다 */
function weekStart(now) {
  const kst = new Date((now ? now.getTime() : Date.now()) + TZ_OFFSET_MS);
  const dow = (kst.getUTCDay() + 6) % 7;                 // 월=0 … 일=6
  const midnight = Date.UTC(kst.getUTCFullYear(), kst.getUTCMonth(), kst.getUTCDate());
  return new Date(midnight - dow * 86400000 - TZ_OFFSET_MS);
}

/** 이번 주에 아직 안 지난 날이 며칠 남았는지 (오늘 포함, 1~7) */
function daysLeftInWeek(now) {
  const kst = new Date((now ? now.getTime() : Date.now()) + TZ_OFFSET_MS);
  return 7 - ((kst.getUTCDay() + 6) % 7);
}

/** 이번 주에 링크를 이미 몇 번 내보냈는지 */
async function linksThisWeek(userId, now) {
  const { rows } = await pool.query(
    `SELECT COUNT(*)::int AS n
       FROM th_posts
      WHERE user_id = $1
        AND link_sent = TRUE
        AND COALESCE(published_at, scheduled_for) >= $2`,
    [userId, weekStart(now)]
  );
  return (rows[0] && rows[0].n) || 0;
}

/**
 * 이번 글에 링크를 붙일까?
 *
 * 남은 날수보다 남은 횟수가 많거나 같으면 무조건 붙인다 —
 * 안 그러면 주말에 못 채우고 넘어간다.
 * 그 밖에는 남은횟수/남은날수 확률로 정한다.
 */
function rollLink(used, perWeek, daysLeft) {
  const left = perWeek - used;
  if (left <= 0) return false;
  if (left >= daysLeft) return true;
  return Math.random() < left / daysLeft;
}

/**
 * 이 글에 붙일 꼬리말을 정한다.
 * 반환 { text, withLink, why } — text 가 비면 붙일 게 없다는 뜻이다.
 *
 * force 를 주면 확률을 건너뛴다 (미리보기에서 「이번엔 붙습니다」 를
 * 보여준 뒤 실제로 보낼 때 말이 달라지면 안 되므로 쓰지 않는다).
 */
async function build(userId, settings, opts) {
  const o = opts || {};
  const s = settings || {};
  const line = String(s.dailyLine || '').trim();
  const link = String(s.ctaLink || '').trim();
  const perWeek = Math.max(0, Math.min(3, Number(s.ctaPerWeek == null ? 2 : s.ctaPerWeek)));

  let withLink = false;
  let why = '';

  if (link && perWeek > 0) {
    const used = await linksThisWeek(userId, o.now);
    const daysLeft = daysLeftInWeek(o.now);
    if (used >= perWeek) {
      why = '이번 주 ' + perWeek + '번을 이미 채웠습니다.';
    } else if (o.force === true) {
      withLink = true;
      why = '이번 주 ' + (used + 1) + '번째입니다.';
    } else if (o.force === false) {
      why = '링크 없이 보냅니다.';
    } else {
      withLink = rollLink(used, perWeek, daysLeft);
      why = withLink
        ? '이번 주 ' + (used + 1) + '번째입니다.'
        : '이번 글은 건너뜁니다. (이번 주 ' + used + '/' + perWeek + '번)';
    }
  } else if (link) {
    why = '주당 횟수가 0번이라 붙이지 않습니다.';
  }

  const bits = [];
  if (line) bits.push(line);
  if (withLink) bits.push(link);

  return { text: bits.join('\n\n'), withLink: withLink, why: why };
}

/** 본문 뒤에 꼬리말 한 편을 더 붙인 배열을 준다 */
function attach(parts, tailText) {
  const out = (parts || []).slice();
  const t = String(tailText || '').trim();
  if (t) out.push(t);
  return out;
}

module.exports = { build, attach, weekStart, daysLeftInWeek, linksThisWeek, rollLink };
