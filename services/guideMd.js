/* ============================================================
 * services/guideMd.js — 자료집 글을 화면용 HTML 로 바꾼다
 *
 * 관리자가 쓴 글에 간단한 서식을 허용한다.
 * 다만 HTML 을 그대로 통과시키면 화면이 깨지거나 위험할 수 있으므로,
 * 먼저 전부 막아둔 뒤 허용한 서식만 다시 살려낸다.
 *
 * 쓸 수 있는 것
 *   # 제목 / ## 중제목 / ### 소제목
 *   **굵게**  *기울임*  `코드`
 *   - 목록    1. 번호목록
 *   > 인용
 *   ---       가로줄
 *   ![](/guide/img/1)   사진
 *   [글자](주소)        링크
 *   ```                 그대로 보여주기 (복사용)
 * ============================================================ */

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* 한 줄 안의 서식 (굵게·기울임·링크·사진) */
function inline(t) {
  return t
    .replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (m, alt, src) =>
      /^\/guide\/img\/\d+$/.test(src)
        ? `<img src="${src}" alt="${esc(alt)}" loading="lazy">`
        : esc(m))                                            // 우리 사진만 허용
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g,
      (m, txt, url) => `<a href="${esc(url)}" target="_blank" rel="noopener">${txt}</a>`)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>');
}

function render(src) {
  const lines = String(src || '').replace(/\r\n?/g, '\n').split('\n');
  const out = [];
  let list = null;      // 'ul' | 'ol'
  let quote = false;
  let code = false;
  let buf = [];

  const closeList = () => { if (list) { out.push(`</${list}>`); list = null; } };
  const closeQuote = () => { if (quote) { out.push('</blockquote>'); quote = false; } };
  const flushP = () => {
    if (!buf.length) return;
    out.push('<p>' + buf.map(inline).join('<br>') + '</p>');
    buf = [];
  };

  for (const raw of lines) {
    const line = esc(raw);            // 먼저 전부 막는다

    if (/^```/.test(raw.trim())) {    // 그대로 보여주기 시작·끝
      flushP(); closeList(); closeQuote();
      out.push(code ? '</pre>' : '<pre>');
      code = !code;
      continue;
    }
    if (code) { out.push(line); continue; }

    if (!raw.trim()) { flushP(); closeList(); closeQuote(); continue; }

    let m;
    if ((m = /^(#{1,3})\s+(.*)$/.exec(line))) {
      flushP(); closeList(); closeQuote();
      const lv = m[1].length + 1;     // 글 제목이 h1 이므로 h2 부터
      out.push(`<h${lv}>${inline(m[2])}</h${lv}>`);
      continue;
    }
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(line.trim())) {
      flushP(); closeList(); closeQuote(); out.push('<hr>'); continue;
    }
    if ((m = /^&gt;\s?(.*)$/.exec(line))) {
      flushP(); closeList();
      if (!quote) { out.push('<blockquote>'); quote = true; }
      out.push('<p>' + inline(m[1]) + '</p>');
      continue;
    }
    if ((m = /^[-*]\s+(.*)$/.exec(line))) {
      flushP(); closeQuote();
      if (list !== 'ul') { closeList(); out.push('<ul>'); list = 'ul'; }
      out.push('<li>' + inline(m[1]) + '</li>');
      continue;
    }
    if ((m = /^\d+\.\s+(.*)$/.exec(line))) {
      flushP(); closeQuote();
      if (list !== 'ol') { closeList(); out.push('<ol>'); list = 'ol'; }
      out.push('<li>' + inline(m[1]) + '</li>');
      continue;
    }
    /* 사진만 있는 줄은 문단으로 감싸지 않고 그대로 */
    if (/^!\[[^\]]*\]\(\/guide\/img\/\d+\)$/.test(raw.trim())) {
      flushP(); closeList(); closeQuote();
      out.push('<figure>' + inline(line) + '</figure>');
      continue;
    }
    closeList(); closeQuote();
    buf.push(line);
  }
  flushP(); closeList(); closeQuote();
  if (code) out.push('</pre>');
  return out.join('\n');
}

module.exports = { render };
