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

/* 표를 화면용으로 그린다. 첫 줄을 머리줄로 본다. */
function renderTable(rows) {
  if (!rows.length) return '';
  const cell = (c, tag) => `<${tag}>${inline(esc(c))}</${tag}>`;
  const head = '<tr>' + rows[0].map((c) => cell(c, 'th')).join('') + '</tr>';
  const body = rows.slice(1).map(
    (r) => '<tr>' + r.map((c) => cell(c, 'td')).join('') + '</tr>'
  ).join('');
  return '<table>' + head + body + '</table>';
}

function render(src) {
  const lines = String(src || '').replace(/\r\n?/g, '\n').split('\n');
  const out = [];
  let list = null;      // 'ul' | 'ol'
  let quote = false;
  let code = false;
  let table = null;
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
    if ((m = /^(#{1,6})\s+(.*)$/.exec(line))) {
      flushP(); closeList(); closeQuote();
      /* 글 제목이 h1 이므로 h2 부터 시작하고, 더 깊은 단계는 h4 로 모은다.
         노션은 #### 까지 자주 쓴다. */
      const lv = Math.min(m[1].length + 1, 4);
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
      /* 노션 할 일 목록의 [ ] · [x] 를 눈에 보이는 기호로 바꾼다 */
      const li = m[1].replace(/^\[( |x|X)\]\s*/, (mm, c) => (c === ' ' ? '☐ ' : '☑ '));
      out.push('<li>' + inline(li) + '</li>');
      continue;
    }
    if ((m = /^\d+\.\s+(.*)$/.exec(line))) {
      flushP(); closeQuote();
      if (list !== 'ol') { closeList(); out.push('<ol>'); list = 'ol'; }
      out.push('<li>' + inline(m[1]) + '</li>');
      continue;
    }
    /* 표 — | 가 | 나 | 형태 */
    if (/^\|.*\|\s*$/.test(line.trim())) {
      flushP(); closeList(); closeQuote();
      if (!table) { table = []; }
      const cells = line.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
      /* | --- | --- | 는 머리줄 구분선이라 화면에 넣지 않는다 */
      if (!cells.every((c) => /^:?-{2,}:?$/.test(c))) table.push(cells);
      continue;
    }
    if (table) { out.push(renderTable(table)); table = null; }

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
  if (table) out.push(renderTable(table));
  if (code) out.push('</pre>');
  return out.join('\n');
}

module.exports = { render };
