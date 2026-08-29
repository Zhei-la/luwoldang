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

/**
 * 각 편 끝에 1/4 같은 번호를 붙인다.
 * 번호도 글자 수에 들어가므로 길이를 잴 때와 저장 직전에만 붙인다.
 */
function numberParts(parts) {
  const n = parts.length;
  if (n <= 1) return parts.slice();
  return parts.map((t, i) => t + '\n\n' + (i + 1) + '/' + n);
}

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

module.exports = { THREADS_MAX, threadsLength, numberParts, proseSentences, formOf };
