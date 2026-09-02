/* ============================================================
 * services/threads/copycheck.js — 벤치마크를 베꼈는지 본다
 *
 * BENCHMARK.md 에 실제로 터진 글의 원문이 들어 있다.
 * 프롬프트에 "짜임새만 빌려라" 라고 적어두긴 했지만,
 * 그 말만 믿으면 안 된다. 모델은 눈앞에 있는 문장을 가져다 쓴다.
 *
 * 그래서 만들어진 글을 원문과 기계적으로 대조한다.
 *   · 글자를 이어 붙인 덩어리(n-gram)가 얼마나 겹치는지
 *   · 원문에만 나오는 특징적인 소재를 그대로 썼는지
 *
 * 걸리면 그 글은 버리고 다시 만든다. 사람 눈으로 잡을 수 없는 일이다.
 * ============================================================ */

const fs = require('fs');
const path = require('path');

const GRAM = 12;          // 이만큼 이어 붙은 글자가 똑같으면 베낀 것으로 본다
const RATIO_LIMIT = 0.18; // 겹치는 덩어리가 글의 18%를 넘으면 걸러낸다

/** 견주기 좋게 다듬는다 — 공백·문장부호·이모지를 털어낸다 */
function norm(s) {
  return String(s == null ? '' : s)
    .replace(/[\s]+/g, '')
    .replace(/[.,!?~·…"'`()[\]{}<>:;/\\|@#$%^&*+=_—–-]/g, '')
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '');
}

/** 벤치마크에서 「원문」만 뽑는다 — 인용줄(>)이 원문이다 */
function quotesFrom(md) {
  return String(md || '')
    .split(/\r?\n/)
    .filter((l) => /^\s*>/.test(l))
    .map((l) => l.replace(/^\s*>\s?/, '').trim())
    .filter((l) => norm(l).length >= GRAM);
}

let cache = null;
function refs() {
  if (cache) return cache;
  let md = '';
  try { md = fs.readFileSync(path.join(__dirname, 'BENCHMARK.md'), 'utf8'); }
  catch (e) { md = ''; }

  const lines = quotesFrom(md);
  const grams = new Set();
  lines.forEach((l) => {
    const t = norm(l);
    for (let i = 0; i + GRAM <= t.length; i++) grams.add(t.slice(i, i + GRAM));
  });

  /* 원문에만 나오는 소재 — 짜임새는 빌려도 이건 다시 쓰면 안 된다.
     BENCHMARK.md 맨 아래에 적어둔 것과 같은 목록이다. */
  const topics = [
    { key: '먹는거좋아', why: '「먹는 거 좋아한다=병화일간」' },
    { key: '귀한사주는', why: '「귀한 사주는 ~가 아님」' },
    { key: '현침살', why: '「현침살은 저주가 잘 맞는다」' },
    { key: '개운하는법', why: '「개운법 알려주고 가」' },
    { key: '개운법', why: '「개운법 알려주고 가」' },
    { key: '인천남동구', why: '「인천 남동구 신점」' },
    { key: '신점잘보는곳', why: '「신점 잘 보는 곳 알려줘」' },
  ];

  cache = { grams, lines, topics };
  return cache;
}

/**
 * 글 하나가 벤치마크를 베꼈는지 본다.
 * @returns null(괜찮음) 또는 { reason, sample, ratio }
 */
function copied(text) {
  const t = norm(text);
  if (t.length < GRAM) return null;

  const R = refs();
  if (!R.grams.size) return null;   // 벤치마크가 없으면 검사할 것도 없다

  // ① 소재를 그대로 가져왔나
  const hitTopic = R.topics.find((x) => t.indexOf(x.key) >= 0);
  if (hitTopic) {
    return {
      reason: '벤치마크에 이미 나온 소재를 그대로 썼습니다 — ' + hitTopic.why,
      sample: hitTopic.why,
      ratio: 1,
    };
  }

  // ② 문장 덩어리가 얼마나 겹치나
  let hit = 0, total = 0, sample = '';
  for (let i = 0; i + GRAM <= t.length; i++) {
    total++;
    const g = t.slice(i, i + GRAM);
    if (R.grams.has(g)) { hit++; if (!sample) sample = g; }
  }
  if (!total) return null;

  const ratio = hit / total;
  if (ratio >= RATIO_LIMIT) {
    return {
      reason: '벤치마크 원문과 겹치는 대목이 많습니다 (' + Math.round(ratio * 100) + '%)',
      sample,
      ratio,
    };
  }
  return null;
}

/** 여러 편을 한 번에 — 베낀 것만 골라 돌려준다 */
function scan(posts) {
  const out = [];
  (posts || []).forEach((p, i) => {
    const body = Array.isArray(p && p.parts) ? p.parts.join('\n') : String(p || '');
    const bad = copied(body);
    if (bad) out.push(Object.assign({ index: i }, bad));
  });
  return out;
}

module.exports = { copied, scan, norm, GRAM, RATIO_LIMIT };
