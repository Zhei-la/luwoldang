/* ============================================================
 * services/threads/parse.js — AI 응답에서 JSON 건져내기
 *
 * 흔한 사고: 코드펜스, 앞뒤 설명, 응답이 중간에서 잘림, 트레일링 콤마.
 * 잘렸어도 앞쪽 글은 살려낸다. 다 버리면 요금만 나가고 남는 게 없다.
 * ============================================================ */

class ParseError extends Error {
  constructor(message, hint) {
    super(message);
    this.name = 'ParseError';
    this.hint = hint || '';
  }
}

/** 코드펜스가 있으면 그 안을, 여러 개면 가장 긴 블록을 쓴다 */
function unfence(text) {
  const blocks = [...text.matchAll(/```(?:json)?\s*([\s\S]*?)```/g)].map((m) => m[1]);
  if (blocks.length) return blocks.sort((a, b) => b.length - a.length)[0];
  const open = text.match(/```(?:json)?\s*([\s\S]*)$/);
  if (open) return open[1];
  return text;
}

/** 첫 { 부터 짝이 맞는 } 까지. 문자열 안의 괄호는 세지 않는다. */
function sliceObject(text) {
  const start = text.indexOf('{');
  if (start === -1) {
    throw new ParseError(
      'JSON 을 찾지 못했습니다.',
      'AI 응답에 { 로 시작하는 부분이 없습니다. 다시 만들어 보세요.'
    );
  }

  let depth = 0, inStr = false, esc = false;
  for (let i = start; i < text.length; i++) {
    const c = text[i];
    if (esc) { esc = false; continue; }
    if (c === '\\') { esc = true; continue; }
    if (c === '"') { inStr = !inStr; continue; }
    if (inStr) continue;
    if (c === '{' || c === '[') depth++;
    else if (c === '}' || c === ']') {
      depth--;
      if (depth === 0) return { body: text.slice(start, i + 1), truncated: false };
    }
  }
  return { body: text.slice(start), truncated: true };   // 끝까지 안 닫힘 = 잘림
}

/** 문자열 밖에 있는 닫는 중괄호 위치 (뒤에서부터) */
function closingBracePositions(s) {
  const out = [];
  let inStr = false, esc = false;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (esc) { esc = false; continue; }
    if (c === '\\') { esc = true; continue; }
    if (c === '"') { inStr = !inStr; continue; }
    if (inStr) continue;
    if (c === '}') out.push(i);
  }
  return out.reverse();
}

/** 남은 열린 괄호를 닫아 완결시킨다 */
function closeOpen(s) {
  const st = [];
  let inStr = false, esc = false;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (esc) { esc = false; continue; }
    if (c === '\\') { esc = true; continue; }
    if (c === '"') { inStr = !inStr; continue; }
    if (inStr) continue;
    if (c === '{') st.push('}');
    else if (c === '[') st.push(']');
    else if (c === '}' || c === ']') st.pop();
  }
  if (inStr) return '';                       // 문자열 한가운데면 이 자르기는 못 쓴다
  return s.replace(/,\s*$/, '') + st.reverse().join('');
}

function stripTrailingCommas(s) {
  return s.replace(/,(\s*[}\]])/g, '$1');
}

/** 잘린 JSON 을 살려낸다. 마지막 완결 지점까지 뒤에서부터 물러난다. */
function repair(body) {
  const whole = closeOpen(body);
  if (whole) {
    const fixed = stripTrailingCommas(whole);
    try { JSON.parse(fixed); return fixed; } catch (e) { /* 계속 */ }
  }
  for (const pos of closingBracePositions(body).slice(0, 400)) {
    const candidate = closeOpen(body.slice(0, pos + 1));
    if (!candidate) continue;
    const fixed = stripTrailingCommas(candidate);
    try { JSON.parse(fixed); return fixed; } catch (e) { /* 더 물러난다 */ }
  }
  return null;
}

/** 응답 텍스트에서 JSON 을 읽어낸다 */
function parseLoose(text) {
  const raw = String(text == null ? '' : text).trim();
  if (!raw) throw new ParseError('빈 응답입니다.', 'AI 가 아무것도 돌려주지 않았습니다.');

  const { body, truncated } = sliceObject(unfence(raw));

  try {
    return { data: JSON.parse(stripTrailingCommas(body)), truncated: false };
  } catch (e) { /* 복구 시도 */ }

  const fixed = repair(body);
  if (fixed) {
    try {
      return {
        data: JSON.parse(fixed),
        truncated: true,
        warning: truncated
          ? '응답이 중간에서 끊겨 온전한 부분까지만 읽었습니다. 글 개수를 확인해주세요.'
          : '형식이 살짝 어긋나 있어 고쳐서 읽었습니다.',
      };
    } catch (e) { /* 아래로 */ }
  }

  throw new ParseError(
    'AI 응답을 읽지 못했습니다.',
    [
      '받은 길이 ' + raw.length + '자' + (truncated ? ' — 중간에서 끊긴 것으로 보입니다' : ''),
      '',
      '글 개수를 줄여서 다시 만들어 보세요. 응답이 길면 잘립니다.',
    ].join('\n')
  );
}

/** posts 만 있어도 받아들인다. hookScan 이 없으면 빈 배열로 채운다. */
function normalize(data) {
  if (!data || typeof data !== 'object') return { ok: false, reason: '객체가 아닙니다.' };

  const posts = Array.isArray(data.posts) ? data.posts : null;
  if (!posts || !posts.length) return { ok: false, reason: 'posts 배열이 없거나 비어 있습니다.' };

  const clean = posts
    .map((p) => Object.assign({}, p, {
      parts: (Array.isArray(p.parts) ? p.parts : [])
        .map((t) => String(t == null ? '' : t).trim())
        .filter(Boolean),
    }))
    .filter((p) => p.parts.length > 0);

  if (!clean.length) return { ok: false, reason: '본문이 있는 글이 하나도 없습니다.' };

  return {
    ok: true,
    value: {
      topic: data.topic || '',
      situation: data.situation || '',
      hookScan: Array.isArray(data.hookScan) ? data.hookScan : [],
      unusable: Array.isArray(data.unusable) ? data.unusable : [],
      posts: clean,
    },
  };
}

module.exports = { parseLoose, normalize, ParseError };
