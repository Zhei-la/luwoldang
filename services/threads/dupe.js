/* ============================================================
 * services/threads/dupe.js — 같은 글이 두 번 나가는 것을 막는다
 *
 * ⚠️ 실제로 있었던 일 — 같은 오늘의 운세가 두 계정에 나란히 올라갔다.
 *    규칙을 두 개 만들어 두면 둘 다 같은 운세 틀을 쓰고, 날짜도 띠도
 *    계산값이라 같다. 그러면 **글자까지 거의 같은 글**이 두 계정에 나간다.
 *
 * 이건 창피한 정도가 아니라 위험하다. 여러 계정에 같은 글을 뿌리는 것은
 * 스레드가 스팸으로 보는 대표적인 모양이다. 계정이 막힐 수 있다.
 *
 * 그래서 내보내기 직전에 **최근에 나간 글과 같은지** 본다.
 * 규칙이 몇 개든, 계정이 몇 개든, 어느 길로 오든 여기서 걸린다.
 * ============================================================ */

const { pool } = require('../../db');

/* 며칠치를 되돌아볼지. 운세는 날마다 다르니 사흘이면 넉넉하다. */
const LOOKBACK_DAYS = 3;
/* 이만큼 닮았으면 같은 글로 본다.
 *
 * ⚠️ 문턱이 하나뿐이면 **멀쩡한 다음 날 운세가 막힌다.**
 *    오늘의 운세는 틀이 같고 띠만 바뀌어서, 이틀 사이가 89% 까지 나온다.
 *    막아야 하는 것은 「같은 글이 두 계정에 뿌려지는 것」이고,
 *    한 계정에서 날마다 띠가 바뀌는 것은 막을 일이 아니다.
 *    그래서 **다른 계정이면 조이고, 같은 계정이면 느슨하게** 본다. */
const SAME_ENOUGH = 0.9;        // 다른 계정 — 뿌리기를 막는다
const SAME_ACCOUNT = 0.97;      // 같은 계정 — 사실상 똑같을 때만

/**
 * 견줄 수 있게 글을 다듬는다.
 *
 * 공백·줄바꿈·문장부호를 걷어낸다.
 *
 * ⚠️ 예전엔 숫자까지 걷어냈다. 「9월 6일」과 「9월 7일」을 같은 글로 보려던
 *    것인데, 그러면 **날마다 나가는 운세가 서로 같은 글이 되어** 다음 날
 *    글이 막힌다. 날짜는 남겨둔다 — 같은 날 두 계정에 뿌리는 것은
 *    날짜까지 똑같으니 그래도 걸린다.
 */
function normalize(text) {
  return String(text == null ? '' : text)
    .replace(/[\s​]+/g, '')
    .replace(/[.,!?·…—–\-~()[\]{}"'「」『』:;]/g, '')
    .trim();
}

/** 두 글이 얼마나 닮았나. 0~1. 짧은 쪽을 기준으로 본다. */
function similarity(a, b) {
  const x = normalize(a);
  const y = normalize(b);
  if (!x || !y) return 0;
  if (x === y) return 1;

  /* 세 글자씩 끊어 겹치는 조각을 센다.
     글자 단위로 세면 「~니다」 같은 흔한 어미 때문에 다 닮아 보인다. */
  const grams = (s) => {
    const out = new Set();
    for (let i = 0; i + 3 <= s.length; i++) out.add(s.slice(i, i + 3));
    return out;
  };
  const gx = grams(x);
  const gy = grams(y);
  if (!gx.size || !gy.size) return x === y ? 1 : 0;

  let hit = 0;
  gx.forEach((g) => { if (gy.has(g)) hit++; });
  return hit / Math.min(gx.size, gy.size);
}

/**
 * 이 글과 거의 같은 글이 최근에 나갔거나 예약돼 있나.
 *
 * 반환 null(없음) 또는 { id, accountName, status, at, score }
 */
async function findTwin(userId, post) {
  const body = (post.parts || []).join(String.fromCharCode(10));
  if (!normalize(body)) return null;

  const { rows } = await pool.query(
    `SELECT id, parts, status, account_id, account_name, scheduled_for, published_at, slot_at
       FROM th_posts
      WHERE user_id = $1
        AND id <> $2
        AND status IN ('scheduled', 'published')
        AND COALESCE(published_at, scheduled_for, slot_at) > NOW() - ($3 || ' days')::interval
      ORDER BY COALESCE(published_at, scheduled_for, slot_at) DESC
      LIMIT 40`,
    [userId, post.id || '', String(LOOKBACK_DAYS)]
  );

  const myAcct = post.accountId || null;
  for (const r of rows) {
    const other = (r.parts || []).join(String.fromCharCode(10));
    const score = similarity(body, other);
    /* 같은 계정끼리는 사실상 똑같을 때만 막는다 */
    const same = myAcct && r.account_id && Number(r.account_id) === Number(myAcct);
    if (score >= (same ? SAME_ACCOUNT : SAME_ENOUGH)) {
      return {
        id: r.id,
        status: r.status,
        accountName: r.account_name || '',
        at: r.published_at || r.scheduled_for || r.slot_at,
        score: Math.round(score * 100),
      };
    }
  }
  return null;
}

/** 사람이 읽을 한 줄로 */
function why(twin, myAccountName) {
  const where = twin.accountName ? '@' + twin.accountName : '다른 계정';
  const when = twin.status === 'published' ? '이미 올라갔습니다' : '예약돼 있습니다';
  const same = (myAccountName && twin.accountName && myAccountName === twin.accountName);

  return '똑같은 글이 ' + where + ' 에 ' + when + ' (' + twin.score + '% 같음). ' +
    (same
      ? '같은 계정에 같은 글을 두 번 올리면 스팸으로 걸립니다.'
      : '여러 계정에 같은 글을 뿌리면 스팸으로 걸려 계정이 막힐 수 있습니다.') +
    ' 「글 재생성」으로 다시 만들거나 「수정하기」로 고쳐주세요.';
}

module.exports = { findTwin, why, similarity, normalize,
  LOOKBACK_DAYS, SAME_ENOUGH, SAME_ACCOUNT };
