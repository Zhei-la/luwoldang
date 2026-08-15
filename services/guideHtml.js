/* ============================================================
 * services/guideHtml.js — 자료집 글(HTML)을 안전하게 걸러낸다
 *
 * 글쓰기 화면이 블로그처럼 바뀌면서 본문이 HTML 로 저장된다.
 * 브라우저에서 온 것을 그대로 믿으면 안 되므로,
 * 허용한 태그와 속성만 남기고 나머지는 전부 버린다.
 *
 * 남기는 것 : 제목, 문단, 굵게/기울임/밑줄, 목록, 인용,
 *             복사용 상자, 가로줄, 사진, 링크
 * 버리는 것 : 그 외 모든 태그와 속성 (onclick 같은 것 포함)
 * ============================================================ */

/* 허용 태그 → 남길 속성 */
const ALLOW = {
  h2: ['class'], h3: ['class'], h4: ['class'],
  p: ['class'], br: [], hr: [],
  strong: [], b: [], em: [], i: [], u: [], s: [], del: [],
  ul: [], ol: [], li: ['class'],
  blockquote: ['class'], pre: ['class'], code: [],
  table: [], thead: [], tbody: [], tr: [], th: [], td: [],
  figure: ['class'], figcaption: [],
  img: ['src', 'alt'],
  a: ['href'],
};

/* 태그도 내용도 통째로 버릴 것 */
const DROP_ALL = new Set(['script', 'style', 'iframe', 'object', 'embed', 'svg', 'link', 'meta', 'form', 'input', 'button']);

/* 스스로 닫는 태그 */
const VOID = new Set(['br', 'hr', 'img']);

function escText(s) {
  return String(s).replace(/&(?!(#\d+|#x[0-9a-fA-F]+|[a-zA-Z]+);)/g, '&amp;')
                  .replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function escAttr(s) {
  return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;')
                  .replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/* 여는 태그 하나를 다시 만든다 (허용 속성만) */
function openTag(name, attrRaw) {
  const keep = ALLOW[name];
  const out = [];

  const re = /([a-zA-Z-]+)\s*=\s*("([^"]*)"|'([^']*)'|([^\s"'>]+))/g;
  let m;
  const attrs = {};
  while ((m = re.exec(attrRaw))) {
    attrs[m[1].toLowerCase()] = m[3] !== undefined ? m[3] : (m[4] !== undefined ? m[4] : m[5]);
  }

  for (const k of keep) {
    const v = attrs[k];
    if (v == null) continue;

    if (name === 'img' && k === 'src') {
      /* 우리 서버에 올린 사진만 허용한다. 바깥 주소는 만료되거나 추적에 쓰일 수 있다. */
      if (!/^\/guide\/img\/\d+$/.test(v)) return '';
      out.push(`src="${escAttr(v)}"`);
    } else if (k === 'class') {
      /* 사진 크기(sz-)와 정렬(al-)만 허용한다. 그 밖의 class 는 화면을 망가뜨릴 수 있다. */
      const ok = String(v).split(/\s+/).filter((c) => /^(sz-[sml]|al-[lcr])$/.test(c));
      if (!ok.length) continue;
      out.push(`class="${ok.join(' ')}"`);
    } else if (name === 'a' && k === 'href') {
      if (/^\/guide\/\d+$/.test(v)) {
        out.push(`href="${escAttr(v)}"`);              // 자료집 안에서 서로 연결
      } else if (/^https?:\/\//i.test(v)) {
        out.push(`href="${escAttr(v)}" target="_blank" rel="noopener"`);
      } else {
        continue;                                       // javascript: 등 차단
      }
    } else {
      out.push(`${k}="${escAttr(v)}"`);
    }
  }

  if (name === 'img') {
    if (!out.some((a) => a.startsWith('src='))) return '';   // 주소가 없으면 사진이 아니다
    out.push('loading="lazy"');
  }
  return '<' + [name, ...out].join(' ') + '>';
}

function sanitize(html) {
  const src = String(html == null ? '' : html);
  let out = '';
  let i = 0;

  while (i < src.length) {
    const lt = src.indexOf('<', i);
    if (lt === -1) { out += escText(src.slice(i)); break; }
    out += escText(src.slice(i, lt));

    const gt = src.indexOf('>', lt);
    if (gt === -1) { out += escText(src.slice(lt)); break; }

    const raw = src.slice(lt, gt + 1);
    const m = /^<\s*(\/?)\s*([a-zA-Z0-9]+)([\s\S]*?)\/?\s*>$/.exec(raw);
    if (!m) { i = gt + 1; continue; }                  // 주석 등은 버린다

    const closing = m[1] === '/';
    const name = m[2].toLowerCase();

    if (DROP_ALL.has(name)) {
      /* 내용까지 통째로 건너뛴다 */
      const close = new RegExp('</\\s*' + name + '\\s*>', 'i');
      const rest = src.slice(gt + 1);
      const cm = close.exec(rest);
      i = cm ? gt + 1 + cm.index + cm[0].length : src.length;
      continue;
    }

    if (!ALLOW[name]) { i = gt + 1; continue; }         // 허용 안 한 태그는 껍데기만 버리고 글자는 남긴다

    out += closing ? (VOID.has(name) ? '' : `</${name}>`) : openTag(name, m[3]);
    i = gt + 1;
  }

  /* 빈 문단이 줄줄이 남으면 화면이 벌어진다 */
  return out.replace(/<p>\s*(<br\s*\/?>)?\s*<\/p>/g, '<p><br></p>').trim();
}

/* 목록에 보여줄 미리보기 (태그를 걷어낸 글자만) */
function toText(html, len = 160) {
  const t = String(html || '')
    .replace(/<figure[\s\S]*?<\/figure>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
  return t.length > len ? t.slice(0, len) + '…' : t;
}

module.exports = { sanitize, toText };
