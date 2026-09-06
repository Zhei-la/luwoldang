/* ============================================================
 * services/threads/length.js — 스레드 글자 수 세는 법
 *
 * ⚠️ 한글을 UTF-8 바이트로 세면 실제보다 3배 크게 나온다.
 *    300자짜리가 694바이트로 잡혀 발행이 막히는 사고가 있었다.
 *    일반 문자는 1자로 세고, URL 과 이모지만 바이트로 센다.
 * ============================================================ */

const THREADS_MAX = 500;

function byteLen(s) {
  return Buffer.byteLength(s, 'utf8');
}

/** 스레드가 세는 방식 그대로 길이를 잰다 */
function threadsLength(text) {
  let extra = 0;
  let rest = String(text == null ? '' : text);

  rest = rest.replace(/https?:\/\/\S+/g, (m) => {
    extra += byteLen(m);
    return '';
  });
  rest = rest.replace(/\p{Extended_Pictographic}(️|‍\p{Extended_Pictographic})*/gu, (m) => {
    extra += byteLen(m);
    return '';
  });

  return extra + [...rest].length;
}

/* ⚠️ 예전엔 각 편 끝에 「1/2 · 2/2」를 붙였다. 뺐다.
      켤 방법도 없이 늘 붙었고, 운세 글 끝에 번호가 달려 나갔다.
      본문 아래 이어지는 글은 스레드에서 이미 이어져 보인다 —
      번호를 손으로 달아줄 이유가 없다. */

/** 산문 문장 수. 리스트 항목(1. / - / <소제목>)은 세지 않는다 */
function proseSentences(text) {
  const prose = String(text == null ? '' : text)
    .split('\n')
    .filter((line) => {
      const t = line.trim();
      if (!t) return false;
      if (/^\d+[.)]/.test(t)) return false;      // 1. 2. 3.
      if (/^[-·ㆍ•]/.test(t)) return false;       // 불릿
      if (/^<.*>$/.test(t)) return false;         // <소제목>
      if (/^\d+\/\d+$/.test(t)) return false;     // 1/4
      return true;
    })
    .join(' ');

  const hits = prose.match(/[.!?。]|다\s|요\s|음\s|임\s/g);
  const n = hits ? hits.length : 0;
  return Math.max(prose.trim() ? 1 : 0, n);
}

/** 편 개수로 형태를 정한다. 모델이 준 form 은 믿지 않는다. */
function formOf(count) {
  if (count >= 3) return 'chain';
  if (count === 2) return 'pair';
  return 'single';
}

module.exports = { THREADS_MAX, threadsLength, proseSentences, formOf };
