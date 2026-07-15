/**
 * pdfDoc.js
 * 사주 리포트 PDF 문서 생성
 *
 * 구조:
 *   1p     표지
 *   2p     목차
 *   3~5p   만세력 (원국표 · 오행 · 대운)
 *   6p~    본문 (챕터마다 새 페이지에서 시작)
 *
 * 브라우저 인쇄(Ctrl+P) → PDF 저장으로 출력.
 */

const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));

const EL_COLOR = { 목: '#2e8b57', 화: '#cf4038', 토: '#b8860b', 금: '#6b7684', 수: '#2f6bb0' };

function fmtDate(d) {
  const t = d ? new Date(d) : new Date();
  return `${t.getFullYear()}년 ${t.getMonth() + 1}월 ${t.getDate()}일`;
}

/* ── 1. 표지 ── */
/**
 * 리포트 종류별 표지
 *   img     : 배경 이미지
 *   style   : 'ink'   = 수묵화 (이미지에 브랜드명이 박혀 있음 → 덮어씀)
 *             'circle'= 원형 (브랜드명 자리가 비어 있음 → 그냥 얹음)
 *   brandTop: 브랜드명 세로 위치 (%)
 */
const COVERS = {
  종합사주:  { img: '/img/pdf/cover-jonghap.jpg',  style: 'ink',    brandTop: 12.4 },
  신년운세:  { img: '/img/pdf/cover-sinnyeon.jpg', style: 'ink',    brandTop: 12.4 },
  연애운:    { img: '/img/pdf/cover-yeonae.jpg',   style: 'circle', brandTop: 18.2 },
  결혼운:    { img: '/img/pdf/cover-gyeolhon.jpg', style: 'circle', brandTop: 18.2 },
  연인궁합:  { img: '/img/pdf/cover-gunghap.jpg',  style: 'circle', brandTop: 18.2 },
  재물운:    { img: '/img/pdf/cover-jaemul.jpg',   style: 'circle', brandTop: 18.2 },
  건강운:    { img: '/img/pdf/cover-geongang.jpg', style: 'circle', brandTop: 18.2 },
  무료사주:  { img: '/img/pdf/cover-free.jpg',     style: 'circle', brandTop: 18.2 },
};

function coverPage({ type, client, teacher, baseUrl, cover }) {
  const brand = teacher.site_name || teacher.name || '';
  // 교육생/관리자가 올린 표지가 있으면 최우선. 없으면 코드 기본값(COVERS).
  const cfg = cover || COVERS[type];

  if (cfg) {
    const raw = cfg.img || '';
    const url = /^data:/.test(raw) ? raw : (baseUrl || '') + raw;
    const style = cfg.style || 'circle';
    const brandTop = cfg.brandTop == null ? 18.2 : cfg.brandTop;
    const brandPos = cfg.brandPos || 'top';
    // plain = 표지에 이미 종류 글자가 그려짐. 교육생 상호명을 세트 위치에 맞춰 얹는다.
    let overlay;
    if (style === 'plain') {
      if (!brand) {
        overlay = '';
      } else if (brandPos === 'left') {
        // 왼쪽 세로 (표지 글씨가 세로일 때)
        overlay = `<div class="cv-brand-vert">${esc(brand)}</div>`;
      } else {
        // 위쪽 가로
        overlay = `<div class="cv-brand-top">${esc(brand)}</div>`;
      }
    } else {
      overlay = `<div class="${style === 'ink' ? 'cv-brand-overlay ink' : 'cv-brand-overlay circle'}" style="top:${brandTop}%">${esc(brand)}</div>`;
    }

    return `
<section class="page sheet cover cover-img cover-${style}" style="background-image:url('${esc(url)}')">
  ${overlay}
  <div class="cv-info">
    <p class="cv-name">${esc(client.name)} 님</p>
    <p class="cv-birth">
      ${esc(client.birthDate)} ${esc(client.calendar || '양력')}
      ${client.birthTime ? esc(client.birthTime) : '시간 모름'}
      ${client.gender ? ' · ' + esc(client.gender) : ''}
    </p>
    <p class="cv-date">${fmtDate()}</p>
  </div>
</section>`;
  }

  // 표지 이미지가 없는 종류 → 기본 액자 표지
  return `
<section class="page sheet cover">
  <div class="cv-frame">
    <div class="cv-moon"></div>
    <p class="cv-brand">${esc(brand)}</p>
    <h1 class="cv-type">${esc(type)}</h1>
    <div class="cv-line"></div>
    <p class="cv-name">${esc(client.name)} 님</p>
    <p class="cv-birth">
      ${esc(client.birthDate)} ${esc(client.calendar || '양력')}
      ${client.birthTime ? esc(client.birthTime) : '시간 모름'}
      ${client.gender ? ' · ' + esc(client.gender) : ''}
    </p>
    <p class="cv-date">${fmtDate()}</p>
  </div>
</section>`;
}

/* ── 2. 목차 ── */
/* ── 사주 용어 풀이 ──
 * 십성·12운성·지장간 같은 말이 설명 없이 나오면 내담자가 못 읽는다.
 * 만세력 표 뒤, 본문 앞에 한 장 넣는다. */
const GLOSSARY = [
  {
    h: '오행 (五行)',
    items: [
      ['목 (木)', '뻗어나가는 기운. 시작·성장·기획. 나무가 위로 자라는 모습.'],
      ['화 (火)', '퍼지는 기운. 표현·열정·확산. 사람을 끌어당기는 힘.'],
      ['토 (土)', '머무는 기운. 중심·안정·신뢰. 무엇이든 받아 담는 자리.'],
      ['금 (金)', '거두는 기운. 결단·정리·원칙. 단단하게 마무리하는 힘.'],
      ['수 (水)', '흐르는 기운. 지혜·유연함·저장. 상황을 읽고 돌아가는 힘.'],
    ],
  },
  {
    h: '십성 (十星) — 나와 다른 기운의 관계',
    items: [
      ['비견 · 겁재', '나와 같은 기운. 자립심과 경쟁심. 동료이자 라이벌.'],
      ['식신 · 상관', '내가 내보내는 기운. 표현력·재능·창의. 말과 일로 드러나는 나.'],
      ['편재 · 정재', '내가 다스리는 기운. 재물·현실감각·결과. 손에 쥐는 것들.'],
      ['편관 · 정관', '나를 누르는 기운. 책임·직장·규율. 나를 다듬는 압박.'],
      ['편인 · 정인', '나를 돕는 기운. 배움·보호·인정. 뒤에서 받쳐주는 힘.'],
    ],
  },
  {
    h: '원국을 읽는 말들',
    items: [
      ['천간 (天干)', '겉으로 드러나는 기운. 남들이 보는 나의 모습.'],
      ['지지 (地支)', '바탕에 깔린 기운. 실제로 살아가는 환경과 현실.'],
      ['지장간 (支藏干)', '지지 속에 숨어 있는 천간. 겉으론 안 보이지만 작동하는 기운.'],
      ['일간 (日干)', '나 자신을 나타내는 글자. 사주 전체를 읽는 기준점.'],
      ['12운성', '기운의 생애 단계. 장생(태어남)에서 제왕(정점)을 지나 묘(쉼)까지.'],
    ],
  },
  {
    h: '흐름을 읽는 말들',
    items: [
      ['대운 (大運)', '10년마다 바뀌는 큰 흐름. 인생의 계절이 바뀌는 구간.'],
      ['세운 (歲運)', '한 해의 운. 올해 어떤 기운이 들어오는지.'],
      ['용신 (用神)', '내 사주의 균형을 잡아주는 기운. 도움이 되는 방향.'],
      ['기신 (忌神)', '균형을 깨뜨리는 기운. 조심해야 할 방향.'],
    ],
  },
];

function glossaryPage() {
  const group = (g) => `
  <div class="gl-group">
    <h3 class="gl-h">${esc(g.h)}</h3>
    <table class="gl-tbl">
      ${g.items.map(([k, v]) => `
      <tr>
        <td class="gl-k">${esc(k)}</td>
        <td class="gl-v">${esc(v)}</td>
      </tr>`).join('')}
    </table>
  </div>`;

  // 네 묶음을 한 장에 넣으면 마지막(용신·기신)이 잘린다. 두 장으로 나눈다.
  const half = Math.ceil(GLOSSARY.length / 2);

  return `
<section class="page sheet chapter chapter-start">
  <div class="ch-head">
    <span class="ch-no">※</span>
    <h2 class="ch-title">사주 용어 풀이</h2>
  </div>
  <div class="pg-line"></div>
  <p class="gl-lead">리포트를 읽다가 낯선 말이 나오면 이 장으로 돌아오세요.<br>
  용어를 알고 읽으면 같은 문장도 훨씬 또렷하게 들어옵니다.</p>
  ${GLOSSARY.slice(0, half).map(group).join('')}
</section>
<section class="page sheet chapter">
  ${GLOSSARY.slice(half).map(group).join('')}
  <p class="gl-lead" style="margin-top:22px;padding-top:14px;border-top:1px dotted #ddd3bd">
  본문 페이지 아래에도 그 장에 나온 용어를 <b>*</b> 표시로 짧게 달아두었습니다.</p>
</section>`;
}

/* 목차 — 항목이 많으면 촘촘하게, 아주 많으면 두 장으로 나눈다.
 * (예전엔 전부 한 장에 밀어넣어서 마지막 항목이 구분선 밖으로 튀어나갔다) */
const TOC_ROWS_NORMAL = 14;   // 이보다 많으면 촘촘히
const TOC_ROWS_MAX = 24;      // 이보다 많으면 두 장

function tocPage(chapters, type) {
  const isNewYear = type === '신년운세';

  const fixed = [
    '만세력 · 사주 원국',
    '오행 · 대운',
    ...(isNewYear ? ['올해 운의 흐름 (세운 · 월운)'] : []),
    '사주 용어 풀이',
  ];

  const rows = [
    ...fixed.map((t) => `<li class="toc-fixed"><span>${esc(t)}</span></li>`),
    ...chapters.map((c, i) => `
      <li>
        <span class="toc-no">${String(i + 1).padStart(2, '0')}</span>
        <span class="toc-name">${esc(c.title)}</span>
      </li>`),
  ];

  const total = rows.length;
  const compact = total > TOC_ROWS_NORMAL ? ' toc-compact' : '';

  // 한 장에 담기 벅차면 반으로 쪼갠다
  if (total > TOC_ROWS_MAX) {
    const half = Math.ceil(total / 2);
    return `
<section class="page sheet toc${compact}">
  <h2 class="pg-title">목 차</h2>
  <div class="pg-line"></div>
  <ol class="toc-list">${rows.slice(0, half).join('')}</ol>
</section>
<section class="page sheet toc${compact}">
  <ol class="toc-list" style="margin-top:0">${rows.slice(half).join('')}</ol>
</section>`;
  }

  return `
<section class="page sheet toc${compact}">
  <h2 class="pg-title">목 차</h2>
  <div class="pg-line"></div>
  <ol class="toc-list">${rows.join('')}</ol>
</section>`;
}

/* ── 3. 만세력 (여러 장으로 나눔) ──
 *
 * 한 장에 다 넣으면 넘쳐서 잘린다.
 *   1장: 원국표 (천간·지지·지장간·12운성)
 *   2장: 오행 분포 + 대운
 *   3장: 세운 + 월운 (신년운세만)
 * ── */
function sajuPages({ client, saju, type }) {
  if (!saju) return '';

  const cols = ['hour', 'day', 'month', 'year'];
  const labels = { hour: '생시', day: '생일', month: '생월', year: '생년' };

  const cell = (x) => {
    if (!x) return `<td class="ms-none">미상</td>`;
    const c = EL_COLOR[x.el] || '#252522';
    return `<td>
      <div class="ms-gz" style="color:${c}">${esc(x.ko)}<span>${esc(x.char)}</span></div>
      <div class="ms-el" style="color:${c}">${x.yin ? '-' : '+'}${esc(x.el)}</div>
      <div class="ms-god" style="color:${c}">${esc(x.god || '')}</div>
    </td>`;
  };
  const small = (t) => `<td class="ms-sm">${esc(t || '—')}</td>`;
  const jj = (list) => {
    if (!list || !list.length) return small('—');
    return `<td class="ms-sm">${list.map((g) =>
      `<span style="color:${EL_COLOR[g.el] || '#5a5648'}">${esc(g.ko)}</span>`).join('')}</td>`;
  };

  const pages = [];

  /* ── 1장: 원국표 ── */
  pages.push(`
<section class="page sheet">
  <h2 class="pg-title">만세력 · 사주 원국</h2>
  <div class="pg-line"></div>

  <div class="ms-meta">
    <p><b>${esc(client.name)}</b> ${client.gender ? esc(client.gender) : ''}</p>
    <p>${esc(client.birthDate)} ${esc(client.calendar || '양력')} ${client.birthTime ? esc(client.birthTime) : '(시간 모름)'} · ${esc(client.region || '')}</p>
    ${saju.timeCorrection && saju.timeCorrection.correctedTime
      ? `<p class="ms-corr">적용시각 ${esc(saju.timeCorrection.correctedTime)} (${esc(saju.timeCorrection.notes.join(', '))})</p>` : ''}
  </div>

  <table class="ms-chart">
    <tr class="ms-head">
      <th></th>
      ${cols.map((c) => `<th>${labels[c]}</th>`).join('')}
    </tr>
    <tr><th class="ms-rh">천간</th>${cols.map((c) => cell(saju.detail[c].stem)).join('')}</tr>
    <tr><th class="ms-rh">지지</th>${cols.map((c) => cell(saju.detail[c].branch)).join('')}</tr>
    <tr><th class="ms-rh sm">지장간</th>${cols.map((c) => jj(saju.detail[c].jijanggan)).join('')}</tr>
    <tr><th class="ms-rh sm">12운성</th>${cols.map((c) => small(saju.detail[c].unseong)).join('')}</tr>
  </table>
</section>`);

  /* ── 2장: 오행 + 대운 ── */
  const wheel = saju.elementWheel || [];
  const total = Object.values(saju.elements).reduce((a, b) => a + b, 0) || 1;

  const dw = saju.daewoon && saju.daewoon.list.length ? `
    <h3 class="ms-h">대운 <span>${saju.daewoon.forward ? '순행' : '역행'}</span></h3>
    <table class="ms-dw">
      <tr>${saju.daewoon.list.map((d) => `<th>${d.age}세</th>`).join('')}</tr>
      <tr>${saju.daewoon.list.map((d) => `<td><b>${esc(d.ko)}</b><i>${esc(d.ganzi)}</i></td>`).join('')}</tr>
    </table>` : '';

  pages.push(`
<section class="page sheet">
  <h2 class="pg-title">오행 · 대운</h2>
  <div class="pg-line"></div>

  ${elementWheelSvg(wheel, saju.dayMasterKo, saju.dayMasterElement)}

  <p class="ms-sum">
    강한 기운 <b>${esc(saju.strong.join(', '))}</b> · 부족한 기운 <b>${esc(saju.weak.join(', '))}</b>
  </p>

  ${dw}
</section>`);

  /* ── 3장: 세운 + 월운 (신년운세만) ── */
  const yl = saju.yearLuck;
  if (type === '신년운세' && yl) {
    pages.push(`
<section class="page sheet">
  <h2 class="pg-title">${yl.year}년 운의 흐름</h2>
  <div class="pg-line"></div>

  <h3 class="ms-h">${yl.year}년 세운</h3>
  <table class="ms-el-tbl">
    <tr><th>간지</th><th>천간</th><th>지지</th><th>12운성</th></tr>
    <tr>
      <td><b>${esc(yl.sewoon.ko)}</b></td>
      <td>${esc(yl.sewoon.stem.ko)} · ${esc(yl.sewoon.stem.god)}</td>
      <td>${esc(yl.sewoon.branch.ko)} · ${esc(yl.sewoon.branch.god)}</td>
      <td>${esc(yl.sewoon.unseong || '-')}</td>
    </tr>
  </table>
  ${yl.currentDaewoon
    ? `<p class="ms-sum">현재 대운 <b>${esc(yl.currentDaewoon.ko)}</b> (${yl.currentDaewoon.age}세~, 올해 ${yl.currentDaewoon.currentAge}세)</p>`
    : ''}

  <h3 class="ms-h">${yl.year}년 월운</h3>
  <table class="ms-wol">
    <tr>${yl.wolwoon.map((w) => `<th>${w.month}월</th>`).join('')}</tr>
    <tr>${yl.wolwoon.map((w) => `<td><b>${esc(w.ko)}</b></td>`).join('')}</tr>
    <tr>${yl.wolwoon.map((w) => `<td class="wol-god">${esc(w.stem.god)}<br>${esc(w.branch.god)}</td>`).join('')}</tr>
    <tr>${yl.wolwoon.map((w) => `<td class="wol-us">${esc(w.unseong || '-')}</td>`).join('')}</tr>
  </table>
</section>`);
  }

  return pages.join('');
}

/* ── 4. 본문 챕터 ──
 *
 * ⚠️ 핵심: 서버에서 A4 한 장 분량씩 미리 잘라 각각 별도 .page로 만든다.
 *    브라우저가 알아서 자르게 두면 배경(테두리)이 중간에서 끊기고
 *    글자가 겹친다. 그래서 직접 나눈다.
 *
 * 페이지 용량 (줄 단위로 계산):
 *   A4 297mm - 상하여백 46mm = 251mm 사용 가능
 *   본문 한 줄 ≈ 7.7mm → 페이지당 약 32줄
 * ── */

/* 실측값 기준 (한 줄 = 14.2px × 2.05 = 29.1px = 7.70mm)
 * 예전에는 여백을 전부 '1줄'로 올려 세서 페이지가 25%씩 비었다. 소수점으로 정확히 센다. */
/* 본문 18.5px × 1.95 = 36.1px = 9.54mm.
 * 241mm ÷ 9.54mm = 25.3줄. 각주 자리 3.5줄 빼면 21.8줄. */
const LINES_PER_PAGE = 21.8;
const CHARS_PER_LINE = 33;      // 170mm ÷ (18.5px = 4.90mm) = 34.7자. 여유 두고 33.
const LINES_CH_TITLE = 5;       // 챕터 제목 + 구분선
const LINES_SUB = 1.4;          // 소제목(21px) + margin 14px
const LINES_PARA_GAP = 0.45;    // 문단 margin-bottom 12px = 3.17mm
const LINES_BLOCK_GAP = 1.05;   // .ch-block margin-bottom 30px = 7.94mm
const OVERFLOW_TOLERANCE = 0.6; // 0.6줄까지는 넘쳐도 한 장에 붙인다 (한 줄만 넘어가는 꼴 방지)

/** 문단이 차지하는 줄 수 */
function paraLines(text) {
  const len = String(text || '').length;
  return Math.ceil(len / CHARS_PER_LINE) + LINES_PARA_GAP;
}

/* 문단은 그대로 흘려 쓴다. 문장마다 줄을 바꾸면 시집처럼 보인다.
 * 문단 사이 빈 줄만으로 충분하다. */
function sentenceBreaks(text) {
  return esc(text);
}

/** 문단 줄 수 (페이지 계산용) */
function paraLinesBr(text) {
  return paraLines(text);
}

/**
 * 챕터를 A4 페이지 단위로 나눈다.
 * @returns [{ isFirst, blocks: [{sub, paras:[]}] }, ...]
 */
function paginateChapter(ch) {
  const pages = [];
  let cur = { isFirst: true, blocks: [] };
  let used = LINES_CH_TITLE;     // 첫 장은 챕터 제목이 자리를 먹는다

  const pushPage = () => {
    if (cur.blocks.length) pages.push(cur);
    cur = { isFirst: false, blocks: [] };
    used = 0;
  };

  (ch.blocks || []).forEach((b) => {
    const paras = String(b.body || '').split(/\n{2,}|\n/).filter(Boolean);
    let block = { sub: b.sub || '', paras: [] };
    let need = b.sub ? LINES_SUB : 0;

    // 소제목 + 첫 문단이 이 페이지에 안 들어가면 → 새 페이지에서 시작
    if (used > 0) used += LINES_BLOCK_GAP;   // 블록 사이 여백
    const firstNeed = need + (paras[0] ? paraLinesBr(paras[0]) : 0);
    if (used > 0 && used + firstNeed > LINES_PER_PAGE + OVERFLOW_TOLERANCE) {
      pushPage();
    }
    used += need;

    paras.forEach((p) => {
      const n = paraLinesBr(p);

      // 이 문단이 안 들어가면 페이지를 넘긴다 (아슬아슬하면 그냥 붙인다)
      if (used + n > LINES_PER_PAGE + OVERFLOW_TOLERANCE) {
        if (block.paras.length || block.sub) {
          cur.blocks.push(block);
          block = { sub: '', paras: [] };   // 이어지는 페이지엔 소제목 반복 안 함
        }
        pushPage();
      }

      block.paras.push(p);
      used += n;
    });

    if (block.paras.length || block.sub) cur.blocks.push(block);
  });

  if (cur.blocks.length) pages.push(cur);
  return pages.length ? pages : [{ isFirst: true, blocks: [] }];
}

/* ── 오행 오각형 (상생·상극 다이어그램) ──
 * 대시보드 미리보기(element-wheel.ejs)와 같은 그림을 PDF 에도 그린다.
 * 일간이 12시 방향, 시계방향으로 상생 순서. 원 안의 물 높이 = 그 기운의 비율.
 */
const EL_FILL = { 목: '#7fd0e8', 화: '#f5a9b8', 토: '#f5cb6b', 금: '#d8dade', 수: '#a9aec4' };
const EL_LINE = { 목: '#2e8b57', 화: '#cf4038', 토: '#b8860b', 금: '#6b7684', 수: '#2f6bb0' };

function elementWheelSvg(wheel, dayMasterKo, dayMasterElement) {
  if (!wheel || !wheel.length) return '';

  const CX = 200, CY = 190, R = 128, NR = 46;
  const pts = wheel.map((w, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;   // 12시부터 시계방향
    return { x: CX + R * Math.cos(a), y: CY + R * Math.sin(a), w };
  });

  // 노드 가장자리에서 멈추는 화살표
  const edge = (from, to, pad) => {
    const dx = to.x - from.x, dy = to.y - from.y;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    const ux = dx / len, uy = dy / len;
    return {
      x1: from.x + ux * (NR + 4), y1: from.y + uy * (NR + 4),
      x2: to.x - ux * (NR + pad), y2: to.y - uy * (NR + pad),
    };
  };

  const ke = [0, 1, 2, 3, 4].map((i) => {
    const e = edge(pts[i], pts[(i + 2) % 5], 6);   // 극 — 두 칸 건너 (별 모양)
    return `<line x1="${e.x1.toFixed(1)}" y1="${e.y1.toFixed(1)}" x2="${e.x2.toFixed(1)}" y2="${e.y2.toFixed(1)}"
      stroke="#e05b52" stroke-width="1.6" marker-end="url(#ah-k)" opacity=".85"/>`;
  }).join('');

  const sheng = [0, 1, 2, 3, 4].map((i) => {
    const e = edge(pts[i], pts[(i + 1) % 5], 6);   // 생 — 한 칸씩 (바깥 원)
    return `<line x1="${e.x1.toFixed(1)}" y1="${e.y1.toFixed(1)}" x2="${e.x2.toFixed(1)}" y2="${e.y2.toFixed(1)}"
      stroke="#4a90d9" stroke-width="2" marker-end="url(#ah-s)"/>`;
  }).join('');

  const clips = pts.map((p, i) => {
    const fillY = p.y + NR - (NR * 2 * (p.w.pct / 100));
    return `<clipPath id="ewclip${i}"><rect x="${(p.x - NR).toFixed(1)}" y="${fillY.toFixed(1)}"
      width="${NR * 2}" height="${NR * 2}"/></clipPath>`;
  }).join('');

  const nodes = pts.map((p, i) => {
    const w = p.w;
    const on = w.pct > 0;
    return `
    <circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${NR}" fill="#fff"/>
    ${on ? `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${NR}"
       fill="${EL_FILL[w.el]}" clip-path="url(#ewclip${i})"/>` : ''}
    <circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${NR}" fill="none"
       stroke="${on ? EL_LINE[w.el] : '#dcd6c8'}" stroke-width="${on ? 1.4 : 1}" opacity="${on ? 0.55 : 1}"/>
    <text x="${p.x.toFixed(1)}" y="${(p.y - 6).toFixed(1)}" text-anchor="middle" class="ew-name">${esc(w.el)}(${esc(w.group)})</text>
    <text x="${p.x.toFixed(1)}" y="${(p.y + 15).toFixed(1)}" text-anchor="middle" class="ew-pct">${w.pct}%</text>`;
  }).join('');

  return `
  <div class="ew-wrap">
    <div class="ew-title">나의 오행: <b>${esc(dayMasterKo || '')}${esc(dayMasterElement || '')}</b></div>
    <div class="ew-legend">
      <span><i class="ln-sheng"></i>생(生)</span>
      <span><i class="ln-ke"></i>극(剋)</span>
    </div>
    <svg viewBox="0 0 400 390" class="ew-svg" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="ah-s" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="#4a90d9"/>
        </marker>
        <marker id="ah-k" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="#e05b52"/>
        </marker>
        ${clips}
      </defs>
      ${ke}
      ${sheng}
      ${nodes}
    </svg>
  </div>`;
}

/* ── 페이지 각주 ──
 * 용어가 나온 페이지 맨 아래에 * 로 짧게 달아준다.
 * (뒤에 용어 풀이 장이 있어도, 읽다 보면 까먹는다) */
const TERM_NOTES = {
  '비견': '나와 같은 기운. 자립심과 경쟁심.',
  '겁재': '나와 같은 기운이되 어긋난 쪽. 경쟁·나눠 갖기.',
  '식신': '내가 내보내는 기운. 꾸준한 표현과 재능.',
  '상관': '내가 내보내는 기운이되 튀는 쪽. 재기·반발.',
  '편재': '내가 다스리는 재물. 크게 벌고 크게 쓰는 돈.',
  '정재': '내가 다스리는 재물. 꾸준히 쌓이는 돈.',
  '편관': '나를 누르는 기운. 갑작스러운 압박·시련.',
  '정관': '나를 누르는 기운. 직장·규율·명예.',
  '편인': '나를 돕는 기운. 남다른 배움·직관.',
  '정인': '나를 돕는 기운. 정통한 배움·보호.',
  '지장간': '지지 속에 숨은 천간. 겉으론 안 보이나 작동하는 기운.',
  '12운성': '기운의 생애 단계. 장생에서 제왕을 지나 묘까지.',
  '일간': '나 자신을 나타내는 글자. 사주를 읽는 기준점.',
  '천간': '겉으로 드러나는 기운.',
  '지지': '바탕에 깔린 기운. 실제 환경과 현실.',
  '원국': '태어날 때 정해진 여덟 글자. 사주의 본판.',
  '대운': '10년마다 바뀌는 큰 흐름.',
  '세운': '한 해의 운.',
  '용신': '내 사주의 균형을 잡아주는 기운. 도움이 되는 방향.',
  '기신': '균형을 깨뜨리는 기운. 조심할 방향.',
  '공망': '비어 있는 자리. 채워도 손에 남지 않는 영역.',
  '십성': '나와 다른 기운의 관계를 열 가지로 나눈 것.',
};
const TERM_KEYS = Object.keys(TERM_NOTES).sort((a, b) => b.length - a.length);
const FOOTNOTE_MAX = 4;    // 한 페이지에 최대 4개

/** 이 페이지 글에 나온 용어를 찾는다 */
function pageTerms(text) {
  const found = [];
  TERM_KEYS.forEach((k) => {
    if (found.length >= FOOTNOTE_MAX) return;
    if (String(text).includes(k)) found.push(k);
  });
  return found;
}

function footnote(text) {
  const ts = pageTerms(text);
  if (!ts.length) return '';
  return `
  <div class="fn">
    ${ts.map((t) => `<div class="fn-i"><b>* ${esc(t)}</b> ${esc(TERM_NOTES[t])}</div>`).join('')}
  </div>`;
}

function chapterPages(chapters, question) {
  return chapters.map((ch, i) => {
    const pages = paginateChapter(ch);

    return pages.map((pg, pi) => {
      const isQ = ch.title === '내담자 질문 답변';
      const qBox = (pg.isFirst && isQ && question) ? `
  <div class="q-box">
    <div class="q-label">남겨주신 질문</div>
    <p class="q-text">${esc(question)}</p>
  </div>` : '';

      const head = pg.isFirst ? `
  <div class="ch-head">
    <span class="ch-no">${String(i + 1).padStart(2, '0')}</span>
    <h2 class="ch-title">${esc(ch.title)}</h2>
  </div>
  <div class="pg-line"></div>
  ${qBox}` : '';

      const body = pg.blocks.map((b) => `
      <div class="ch-block">
        ${b.sub ? `<h3 class="ch-sub">${esc(b.sub)}</h3>` : ''}
        ${b.paras.map((p) => `<p>${sentenceBreaks(p)}</p>`).join('')}
      </div>`).join('');

      // 이 페이지에 나온 용어만 맨 아래 각주로
      const pageText = pg.blocks.map((b) => (b.sub || '') + ' ' + b.paras.join(' ')).join(' ');
      const fn = footnote(pageText);

      return `
<section class="page sheet chapter${pg.isFirst ? ' chapter-start' : ''}" data-ch="${i}" data-pg="${pi}">
  ${head}
  ${body || (pg.isFirst ? '<p class="ch-empty">내용을 생성하지 못했습니다.</p>' : '')}
  ${fn}
</section>`;
    }).join('');
  }).join('');
}

/* ── 5. 마무리 + 추가질문 CTA ── */
function endPage({ teacher, reviewUrl, reviewMode }) {
  const link = teacher.kakao_consult_link || '';
  const btnText = teacher.pdf_cta_text || '추가 질문하러 가기';
  const desc = teacher.pdf_cta_desc
    || '리포트를 읽고 더 궁금한 점이 생기셨다면\n아래 버튼을 눌러 편하게 물어보세요.';

  const cta = link ? `
    <div class="end-cta">
      <p class="end-cta-desc">${esc(desc).replace(/\n/g, '<br>')}</p>
      <a class="end-cta-btn" href="${esc(link)}" target="_blank" rel="noopener">${esc(btnText)}</a>
    </div>` : '';

  // 후기 CTA — reviewUrl 이 있고, 교육생이 후기 받기를 켰을 때만
  //   reviewMode='web'  : 같은 페이지 아래 후기 폼으로 스크롤 (새 창 X)
  //   reviewMode='pdf'  : 웹 후기 페이지를 새 창으로 열기
  const reviewCta = (reviewUrl && teacher.review_on !== false) ? `
    <div class="end-review">
      ${teacher.review_notice ? `<p class="end-review-notice">${esc(teacher.review_notice)}</p>` : ''}
      <p class="end-review-desc">읽어보신 소감을 남겨주시면 큰 힘이 됩니다.</p>
      ${reviewMode === 'web'
        ? `<a class="end-review-btn" href="#rvwWrap">후기 남기러 가기</a>`
        : `<a class="end-review-btn" href="${esc(reviewUrl)}" target="_blank" rel="noopener">후기 남기러 가기</a>`}
    </div>` : '';

  return `
<section class="page sheet end">
  <div class="end-box">
    <p class="end-msg">${esc(teacher.consult_message || '여기까지 읽어주셔서 감사합니다.')}</p>
    ${cta}
    ${reviewCta}
    <p class="end-brand">${esc(teacher.site_name || teacher.name || '')}</p>
  </div>
</section>`;
}

/* ── CSS ── */
const CSS_TEMPLATE = `
@import url('https://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@400;700;800&display=swap');
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css');

* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  background: #e8e6e1;
  font-family: Pretendard, -apple-system, 'Malgun Gothic', sans-serif;
  color: #2b2a26;
  line-height: 1.9;
  -webkit-font-smoothing: antialiased;
}

/* A4 페이지
 *
 * .sheet  = 한 장으로 고정 (표지·목차·만세력·마무리)
 * .flow   = 내용이 길면 여러 장에 걸쳐 흐름 (본문 챕터)
 *
 * 테두리 배경은 A4 크기로 반복(repeat-y)시켜 몇 장이 되든 매 장에 나오게 한다.
 */
.page {
  /* 미리보기 = PDF: A4 한 장으로 고정 (내용은 서버에서 이미 분할됨) */
  width: 210mm;
  height: 297mm;
  min-height: 297mm;
  max-height: 297mm;
  overflow: hidden;
  padding: 22mm 20mm 24mm;
  margin: 0 auto 10mm;
  background-color: #fdfaf2;
  background-image: url('BG_PAPER_URL');
  background-size: 210mm 297mm;
  background-repeat: no-repeat;
  background-position: center;
  box-shadow: 0 4px 20px rgba(0,0,0,.12);
  position: relative;
  page-break-after: always;
  break-after: page;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

/* 한 장으로 고정되는 페이지 */
.page.sheet {
  height: 297mm;
  min-height: 297mm;
  background-repeat: no-repeat;
}

/* 내용이 길면 여러 장으로 흐르는 페이지 (본문) */
.page.flow {
  min-height: 297mm;
  height: auto;
}
.page:last-child { page-break-after: auto; break-after: auto; }

/* 챕터 시작을 확실히 새 페이지로 밀어내는 마커 */
.pagebreak {
  page-break-before: always;
  break-before: page;
  height: 0;
  margin: 0;
  border: 0;
}

/* 표지 — 이미지 배경 */
.cover { display: flex; align-items: center; justify-content: center; }
.cover-img {
  background-image: none;
  background-size: 210mm 297mm;
  background-position: center;
  background-repeat: no-repeat;
  padding: 0 !important;
  display: block;
}
/* 브랜드명 — 교육생마다 다른 이름 */
.cv-brand-overlay {
  position: absolute;
  left: 0; right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Nanum Myeongjo', serif;
  z-index: 2;
}
/* 수묵화 표지 — 배경 없이 글자만 얹는다 (이미지에서 원래 글자 제거됨) */
.cv-brand-overlay.ink {
  height: 4%;
  font-size: 21px;
  font-weight: 700;
  letter-spacing: 7px;
  color: #3f3a33;
}
/* 원형 표지 */
.cv-brand-overlay.circle {
  height: 4%;
  font-size: 19px;
  font-weight: 700;
  letter-spacing: 6px;
  color: #5c4633;
}

/* plain 표지 — 상호명을 세트 위치에 맞춰. 표지 글씨체와 비슷한 크기로 */
.cv-brand-top {
  position: absolute;
  top: 6%;
  left: 0; right: 0;
  text-align: center;
  font-family: 'Nanum Myeongjo', serif;
  font-size: 30px;
  font-weight: 700;
  letter-spacing: 8px;
  color: rgba(55, 45, 33, 0.82);
  z-index: 2;
}
/* 왼쪽 세로 (표지 글씨가 세로일 때) */
.cv-brand-vert {
  position: absolute;
  top: 8%;
  left: 8%;
  writing-mode: vertical-rl;
  text-orientation: upright;
  font-family: 'Nanum Myeongjo', serif;
  font-size: 30px;
  font-weight: 700;
  letter-spacing: 6px;
  color: rgba(55, 45, 33, 0.82);
  z-index: 2;
}

/* 원형 표지는 하단 정보를 조금 더 위로 */
.cover-circle .cv-info { bottom: 8%; }
.cover-circle .cv-name { color: #4a3728; }
.cover-circle .cv-birth { color: #7d6a58; }
.cover-circle .cv-date { color: #a08a72; }
.cv-info {
  position: absolute;
  left: 0; right: 0;
  bottom: 6%;
  text-align: center;
}
.cover-img .cv-name {
  font-family: 'Nanum Myeongjo', serif;
  font-size: 19px; font-weight: 700;
  color: #2b2a26; margin-bottom: 6px;
}
.cover-img .cv-birth { font-size: 12.5px; color: #6b6656; }
.cover-img .cv-date { font-size: 11px; color: #9a9384; margin-top: 8px; }
.cv-frame {
  text-align: center; width: 100%;
  padding: 40mm 12mm;
  border: 1px solid #d8cfb8;
  outline: 3px double #e6dcc4;
  outline-offset: 5px;
}
.cv-moon {
  width: 74px; height: 74px; margin: 0 auto 28px; border-radius: 50%;
  background: radial-gradient(circle at 35% 33%, #fff, #f0e6cf 58%, #d6c49e);
  box-shadow: 0 0 0 7px rgba(181,154,98,.10);
}
.cv-moon.small { width: 54px; height: 54px; margin-bottom: 20px; }
.cv-brand { font-family: 'Nanum Myeongjo', serif; font-size: 15px; letter-spacing: 4px; color: #a08a5c; margin-bottom: 26px; }
.cv-type { font-family: 'Nanum Myeongjo', serif; font-size: 40px; font-weight: 800; letter-spacing: 6px; color: #1f2a3d; }
.cv-line { width: 46px; height: 2px; background: #b59a62; margin: 22px auto 26px; }
.cv-name { font-family: 'Nanum Myeongjo', serif; font-size: 23px; font-weight: 700; margin-bottom: 8px; }
.cv-birth { font-size: 13.5px; color: #7c7466; }
.cv-date { font-size: 12px; color: #b3ad9c; margin-top: 34px; }

/* 공통 제목 */
.pg-title { font-family: 'Nanum Myeongjo', serif; font-size: 25px; font-weight: 800; letter-spacing: 3px; color: #1f2a3d; }
.pg-line { width: 100%; height: 1px; background: #e2d9c5; margin: 14px 0 26px; position: relative; }
.pg-line:after { content: ''; position: absolute; left: 0; top: -1px; width: 54px; height: 3px; background: #b59a62; }

/* 목차 */
.toc-list { list-style: none; margin-top: 10px; }
.toc-list li { display: flex; align-items: baseline; gap: 12px; padding: 11px 0; border-bottom: 1px dotted #e2d9c5; font-size: 17.5px; }
.toc-list li:last-child { border-bottom: none; }
/* 항목이 많을 때 — 줄 간격을 줄여서 한 장에 담는다 */
.toc-compact .toc-list li { padding: 6px 0; font-size: 15.7px; gap: 10px; }
.toc-compact .toc-list { margin-top: 4px; }

/* 사주 용어 풀이 */
.gl-lead { font-size: 15.7px; line-height: 1.85; color: #6b6656; margin: 4px 0 20px; }
.gl-group { margin-bottom: 17px; page-break-inside: avoid; break-inside: avoid; }
.gl-h {
  font-family: 'Nanum Myeongjo', serif; font-size: 14.5px; font-weight: 800;
  color: #1f2a3d; margin: 0 0 8px; padding-left: 9px; border-left: 3px solid #b59a62;
}
.gl-tbl { width: 100%; border-collapse: collapse; }
.gl-tbl tr { border-bottom: 1px dotted #e6ddc8; }
.gl-tbl tr:last-child { border-bottom: none; }
.gl-k {
  width: 124px; padding: 6px 10px 6px 10px; vertical-align: top;
  font-family: 'Nanum Myeongjo', serif; font-size: 14.9px; font-weight: 700; color: #8a6f3c;
  white-space: nowrap;
}
.gl-v { padding: 6px 0; font-size: 14.7px; line-height: 1.7; color: #4a473e; }

/* 오행 오각형 (상생·상극) */
.ew-wrap { margin: 16px 0 14px; text-align: center; }
.ew-title { font-size: 14px; color: #1f2a3d; font-weight: 700; margin-bottom: 7px; }
.ew-title b { color: #b59a62; }
.ew-legend {
  display: flex; gap: 16px; justify-content: center;
  font-size: 11.5px; color: #8a8574; margin-bottom: 6px;
}
.ew-legend span { display: flex; align-items: center; gap: 5px; }
.ew-legend i { width: 17px; height: 2px; display: inline-block; }
.ew-legend i.ln-sheng { background: #4a90d9; }
.ew-legend i.ln-ke { background: #e05b52; }
.ew-svg { width: 100%; max-width: 400px; height: auto; display: block; margin: 0 auto; }
.ew-name {
  font-family: Pretendard, -apple-system, sans-serif;
  font-size: 13px; font-weight: 700; fill: #2c2a25;
}
.ew-pct {
  font-family: Pretendard, -apple-system, sans-serif;
  font-size: 14px; font-weight: 800; fill: #1f2a3d;
}

/* 페이지 하단 용어 각주 */
.page { position: relative; }
.fn {
  position: absolute;
  left: 20mm; right: 20mm; bottom: 11mm;
  padding-top: 6px;
  border-top: 1px dotted #ddd3bd;
}
.fn-i {
  font-size: 11.9px; line-height: 1.55; color: #8f8a7c;
  margin-bottom: 2px; word-break: keep-all;
}
.fn-i:last-child { margin-bottom: 0; }
.fn-i b { color: #a08a5c; font-weight: 700; margin-right: 3px; }
.toc-fixed { color: #a08a5c; font-weight: 700; font-family: 'Nanum Myeongjo', serif; }
.toc-no { font-family: 'Nanum Myeongjo', serif; font-weight: 700; color: #b59a62; min-width: 26px; }
.toc-name { flex: 1; }

/* 만세력 */
.ms-meta { margin-bottom: 18px; font-size: 13px; color: #6b6656; }
.ms-meta p { margin: 2px 0; }
.ms-meta b { font-size: 16px; color: #2b2a26; }
.ms-corr { color: #a09a8c; font-size: 12px; }
.ms-chart { width: 100%; border-collapse: collapse; margin-bottom: 26px; }
.ms-chart th, .ms-chart td { border: 1px solid #e6ddc9; text-align: center; padding: 9px 4px; background: #fff; }
.ms-head th { background: #faf6ec; font-size: 12.5px; color: #8a8574; font-weight: 600; }
.ms-rh { background: #faf6ec; font-size: 11.5px; color: #8a8574; width: 54px; }
.ms-rh.sm { font-size: 10.5px; color: #b3ad9c; }
.ms-gz { font-family: 'Nanum Myeongjo', serif; font-size: 25px; font-weight: 700; }
.ms-gz span { font-size: 13px; opacity: .55; margin-left: 2px; }
.ms-el { font-size: 11px; margin-top: 2px; }
.ms-god { font-size: 11.5px; margin-top: 2px; opacity: .9; }
.ms-sm { font-size: 12px; color: #5a5648; padding: 7px 4px; }
.ms-none { color: #c9c3b5; font-size: 13px; }
.ms-h { font-family: 'Nanum Myeongjo', serif; font-size: 15px; margin: 24px 0 10px; padding-left: 9px; border-left: 3px solid #b59a62; }
.ms-h span { font-size: 11px; color: #b59a62; border: 1px solid #b59a62; border-radius: 4px; padding: 0 6px; margin-left: 5px; }
.ms-el-tbl { width: 100%; border-collapse: collapse; }
.ms-el-tbl th, .ms-el-tbl td { border: 1px solid #e6ddc9; text-align: center; padding: 8px 4px; background: #fff; }
.ms-el-tbl th { background: #faf6ec; font-size: 13px; font-weight: 700; }
.ms-el-tbl td b { font-size: 18px; }
.ms-el-tbl td i { display: block; font-style: normal; font-size: 11px; color: #b3ad9c; }
.ms-wheel { text-align: center; font-size: 12px; margin-top: 10px; }
.ms-wheel span { font-weight: 600; }
.ms-sum { text-align: center; font-size: 13px; color: #7c7466; margin-top: 10px; }
.ms-sum b { color: #1f2a3d; }
.ms-dw { width: 100%; border-collapse: collapse; }
.ms-dw th, .ms-dw td { border: 1px solid #e6ddc9; text-align: center; padding: 7px 2px; background: #fff; }
.ms-dw th { background: #faf6ec; font-size: 10.5px; color: #8a8574; font-weight: 500; }
.ms-dw td b { display: block; font-family: 'Nanum Myeongjo', serif; font-size: 15px; color: #1f2a3d; }
.ms-dw td i { display: block; font-style: normal; font-size: 10px; color: #b3ad9c; }

/* 월운 표 */
.ms-wol { width: 100%; border-collapse: collapse; table-layout: fixed; }
.ms-wol th, .ms-wol td { border: 1px solid #e6ddc9; text-align: center; padding: 6px 1px; background: #fff; }
.ms-wol th { background: #faf6ec; font-size: 10px; color: #8a8574; font-weight: 500; }
.ms-wol td b { font-family: 'Nanum Myeongjo', serif; font-size: 13px; color: #1f2a3d; }
.ms-wol .wol-god { font-size: 9px; color: #7c7466; line-height: 1.5; }
.ms-wol .wol-us { font-size: 9.5px; color: #a8a293; }

/* 본문 챕터 */
.chapter { padding-top: 32mm; }              /* 챕터 첫 페이지는 위 여백 넉넉히 */
.ch-head { display: flex; align-items: baseline; gap: 12px; }
.ch-no { font-family: 'Nanum Myeongjo', serif; font-size: 30px; font-weight: 800; color: #d8cfb8; }
.ch-title { font-family: 'Nanum Myeongjo', serif; font-size: 27px; font-weight: 800; letter-spacing: 2px; color: #1f2a3d; }

.ch-block { margin-bottom: 30px; }
.ch-block:last-child { margin-bottom: 0; }

/* 소제목 — 혼자 페이지 끝에 남지 않게 (제목만 남고 본문 넘어가는 것 방지) */
.ch-sub {
  font-family: 'Nanum Myeongjo', serif; font-size: 21px; font-weight: 700;
  color: #1f2a3d; margin: 0 0 14px; padding-left: 11px; border-left: 3px solid #b59a62;
  page-break-after: avoid; break-after: avoid;
  page-break-inside: avoid; break-inside: avoid;
}

.ch-block p {
  font-size: 18.5px; line-height: 1.95; color: #3a3831;
  margin-bottom: 12px; text-align: justify; word-break: keep-all;
  /* 문단이 페이지 경계에서 한두 줄만 남지 않게 */
  orphans: 3; widows: 3;
}
.ch-block p:last-child { margin-bottom: 0; }
.ch-empty { color: #b3ad9c; text-align: center; padding: 40px 0; }

/* 소제목 + 첫 문단을 한 덩어리로 유지 */
.ch-keep {
  page-break-inside: avoid;
  break-inside: avoid;
}

/* 내담자 질문 박스 */
.q-box {
  background: #faf6ec;
  border: 1px solid #ddd2b8;
  border-left: 3px solid #a08a5c;
  border-radius: 0 8px 8px 0;
  padding: 18px 22px;
  margin-bottom: 24px;
}
.q-label {
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: 2px;
  color: #a08a5c;
  margin-bottom: 8px;
}
.q-text {
  font-family: 'Nanum Myeongjo', serif;
  font-size: 16px;
  line-height: 1.85;
  color: #3a3831;
  margin: 0;
}

/* 마무리 — 상하좌우 중앙 */
.end {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.end-box {
  text-align: center;
  max-width: 155mm;
  margin: 0 auto;
}
.end-msg { font-family: 'Nanum Myeongjo', serif; font-size: 20px; line-height: 2.15; color: #4a463d; margin-bottom: 44px; }

/* 추가질문 CTA — 한지 톤에 맞춘 차분한 스타일 */
.end-cta {
  background: transparent;
  border: none;
  padding: 0;
  margin-bottom: 52px;
}
.end-cta-desc {
  font-family: 'Nanum Myeongjo', serif;
  font-size: 17px; line-height: 2.1; color: #5a5648;
  margin-bottom: 32px;
}
.end-cta-btn {
  display: inline-block;
  padding: 19px 54px;
  border-radius: 2px;
  background: #fdfaf2;
  color: #4a3f2f;
  font-family: 'Nanum Myeongjo', serif;
  font-size: 19px;
  font-weight: 700;
  letter-spacing: 3px;
  text-decoration: none;
  border: 1px solid #a08a5c;
  outline: 1px solid #d8cfb8;
  outline-offset: 4px;
}
.end-cta-url {
  font-size: 11px; color: #b8b1a2; margin-top: 26px;
  word-break: break-all; letter-spacing: .3px;
}

/* 후기 CTA */
.end-review {
  margin-top: 38px; padding-top: 34px;
  border-top: 1px solid #e2d9c4;
  text-align: center;
}
.end-review-notice {
  display: inline-block;
  font-family: 'Nanum Myeongjo', serif;
  font-size: 15px; color: #8a6f3c; line-height: 1.7;
  background: #fbf6ec; border: 1px solid #ecdfc4;
  border-radius: 8px; padding: 12px 20px; margin-bottom: 16px;
}
.end-review-desc { font-size: 14px; color: #7c7466; margin-bottom: 18px; line-height: 1.7; }
.end-review-btn {
  display: inline-block;
  padding: 15px 44px;
  border-radius: 2px;
  background: #a08a5c;
  color: #fff;
  font-family: 'Nanum Myeongjo', serif;
  font-size: 17px; font-weight: 700; letter-spacing: 2px;
  text-decoration: none;
}

.end-brand { font-family: 'Nanum Myeongjo', serif; font-size: 17px; letter-spacing: 6px; color: #a08a5c; }

/* ============================================================
 * 인쇄 — 실제 PDF
 *
 * 페이지는 서버에서 이미 A4 단위로 잘라 놓았다.
 * 여기서는 각 .page를 정확히 A4 한 장으로 고정하기만 하면 된다.
 * ============================================================ */
/* ── 무료 PDF 업셀 페이지 ── */
.promo { }
.promo-title {
  font-family: 'Nanum Myeongjo', serif;
  font-size: 27px; font-weight: 800; line-height: 1.45;
  letter-spacing: -0.02em; color: #232220;
  white-space: pre-line; margin-bottom: 26px;
}
.promo-title em { font-style: normal; color: #b03a2e; }
.promo-body p { font-size: 14.5px; line-height: 2.0; color: #45433d; margin-bottom: 15px; }
.promo-lead {
  font-size: 14.5px; line-height: 1.95; color: #45433d;
  padding-bottom: 16px; margin-bottom: 18px; border-bottom: 1px solid #e4ded0;
}
.qa-list { list-style: none; }
.qa-list li {
  font-size: 13.6px; line-height: 1.85; color: #45433d;
  padding: 11px 0 11px 0; border-bottom: 1px dashed #e4ded0;
}
.qa-list li:last-child { border-bottom: 0; }
.qa-tag {
  display: inline-block; font-size: 11px; font-weight: 700;
  color: #8a6f3c; background: #f5efe1; border: 1px solid #e6dcc4;
  border-radius: 3px; padding: 1px 6px; margin-right: 7px;
  font-family: Pretendard, sans-serif; vertical-align: 1px;
}
.rv-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 9px; align-items: start; }
.rv-grid.one { grid-template-columns: 1fr; justify-items: center; }
.rv-grid img {
  width: auto; max-width: 100%;
  /* A4 한 장을 넘지 않도록 높이를 묶는다 (세로로 긴 캡처 대응) */
  max-height: 196mm;
  object-fit: contain;
  border: 1px solid #ded7c6; border-radius: 4px;
  background: #fff; display: block; margin: 0 auto;
}
.rv-grid.one img { max-height: 200mm; }
.price-box {
  border: 1px solid #ded7c6; background: #fbf8f1;
  border-radius: 6px; padding: 20px; text-align: center; margin: 22px 0 18px;
}
.price-off { font-size: 16px; font-weight: 800; color: #b03a2e; margin-right: 9px; }
.price-was { font-size: 14px; color: #a49c8b; text-decoration: line-through; margin-right: 9px; }
.price-now {
  font-family: 'Nanum Myeongjo', serif;
  font-size: 30px; font-weight: 800; color: #232220; letter-spacing: -0.02em;
}
.promo-btn {
  display: block; text-align: center; text-decoration: none;
  padding: 16px; border-radius: 5px;
  background: #2b3a67; color: #fff;
  font-size: 15.5px; font-weight: 800; letter-spacing: 0.02em;
}
.promo-note { margin-top: 12px; text-align: center; font-size: 11.5px; color: #a49c8b; }

@media print {
  html, body {
    background: #fff !important;
    margin: 0 !important;
    padding: 0 !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  /* 페이지 = 정확히 A4 한 장 */
  .page {
    width: 210mm !important;
    height: 297mm !important;
    min-height: 297mm !important;
    max-height: 297mm !important;
    padding: 22mm 20mm 24mm !important;
    margin: 0 !important;
    box-shadow: none !important;
    overflow: hidden !important;
    page-break-after: always !important;
    break-after: page !important;
    page-break-inside: avoid !important;
    break-inside: avoid !important;
    background-size: 210mm 297mm !important;
    background-repeat: no-repeat !important;
    background-position: center !important;
  }
  .page:last-child {
    page-break-after: auto !important;
    break-after: auto !important;
  }

  .cover, .end {
    display: flex !important;
    align-items: center;
    justify-content: center;
  }
  .cover-img {
    display: block !important;
    padding: 0 !important;
    background-size: 210mm 297mm !important;
  }

  .ch-block p { orphans: 2; widows: 2; }
  .no-print { display: none !important; }

  /* margin: 0 → 브라우저 머리말/꼬리말 제거 */
  @page { size: A4; margin: 0; }
}
`;

/**
 * 리포트 전체 HTML
 * @param {object} o { type, client, teacher, saju, chapters }
 */
function buildReportHtml({ type, client, teacher, saju, chapters, baseUrl, cover, reviewUrl, reviewMode, bgPaper }) {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(client.name)}님의 ${esc(type)} 리포트</title>
<style>${buildCSS(baseUrl, bgPaper)}</style>
</head>
<body>
${coverPage({ type, client, teacher, baseUrl, cover })}
${tocPage(chapters, type)}
${sajuPages({ client, saju, type })}
${glossaryPage()}
${chapterPages(chapters, client.question)}
${endPage({ teacher, reviewUrl, reviewMode })}
<script>${REFLOW_SCRIPT}<\/script>
</body>
</html>`;
}

/** baseUrl을 주입한 CSS */
/* ============================================================
 * 리플로우 — 브라우저가 실제 높이를 재서 페이지를 다시 채운다.
 *
 * 서버는 글자 수로 페이지를 어림잡을 수밖에 없어서 빈칸이 생기고
 * 소제목이 혼자 다음 장으로 밀려난다. 그려진 뒤 실제 높이로 바로잡는다.
 *
 *   - 페이지가 넘치면 → 마지막 문단(또는 블록)을 다음 장으로
 *   - 페이지가 비면   → 다음 장 첫 블록을 통째로 끌어올린다
 *                       (소제목 + 내용이 짧으면 앞장에 합쳐진다)
 * ============================================================ */
const REFLOW_SCRIPT = `
(function(){
  function movable(sec){
    return Array.prototype.filter.call(sec.children, function(el){
      return !el.classList.contains('fn') && !el.classList.contains('pg-tools');
    });
  }
  function capacity(sec){
    var cs = getComputedStyle(sec);
    var fn = sec.querySelector('.fn');
    return sec.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom)
         - (fn ? fn.offsetHeight + 12 : 0) - 6;
  }
  // 자식 높이를 더하면 margin collapse 때문에 실제보다 크게 나온다.
  // 마지막 요소의 아래 끝을 직접 재야 정확하다.
  function contentH(sec){
    var kids = movable(sec);
    if (!kids.length) return 0;
    var cs = getComputedStyle(sec);
    var top = sec.getBoundingClientRect().top + parseFloat(cs.paddingTop);
    var last = kids[kids.length - 1].getBoundingClientRect();
    return Math.max(0, last.bottom - top);
  }
  function fits(sec){ return contentH(sec) <= capacity(sec); }

  function lastPara(sec){
    var bs = sec.querySelectorAll('.ch-block');
    for (var i = bs.length - 1; i >= 0; i--) {
      var ps = bs[i].querySelectorAll('p');
      if (ps.length) return ps[ps.length - 1];
    }
    return null;
  }

  function pushDown(p, next){
    var src = p.parentNode;
    var first = next.querySelector('.ch-block');
    if (first && !first.querySelector('.ch-sub')) first.insertBefore(p, first.firstChild);
    else {
      var nb = document.createElement('div');
      nb.className = 'ch-block';
      nb.appendChild(p);
      next.insertBefore(nb, next.firstChild);
    }
    if (src && !src.querySelector('p') && !src.querySelector('.ch-sub')) src.remove();
  }

  function newPage(after, ch){
    var ns = document.createElement('section');
    ns.className = 'page sheet chapter';
    ns.dataset.ch = ch;
    after.parentNode.insertBefore(ns, after.nextSibling);
    return ns;
  }

  function reflow(){
    var groups = {};
    Array.prototype.forEach.call(document.querySelectorAll('.page.chapter'), function(sec){
      var k = sec.dataset.ch;
      if (k === undefined) return;                 // 용어 풀이 등 고정 페이지는 건드리지 않는다
      (groups[k] = groups[k] || []).push(sec);
    });

    Object.keys(groups).forEach(function(k){
      var g = groups[k];

      for (var i = 0; i < g.length; i++) {
        var guard = 0;

        // ① 넘치면 아래로 밀어낸다
        while (!fits(g[i]) && guard++ < 80) {
          var p = lastPara(g[i]);
          if (!p) break;
          if (!g[i + 1]) g.splice(i + 1, 0, newPage(g[i], k));
          pushDown(p, g[i + 1]);
        }

        // ② 자리가 남으면 다음 장에서 끌어올린다
        guard = 0;
        while (g[i + 1] && guard++ < 80) {
          var blk = g[i + 1].querySelector('.ch-block');
          if (!blk) break;

          var hasSub = !!blk.querySelector('.ch-sub');
          var srcParent = blk.parentNode, srcAnchor = blk.nextSibling;

          if (hasSub) {
            // 소제목 블록은 통째로 옮긴다 (짧으면 앞장에 합쳐지고, 길면 그대로 남는다)
            g[i].appendChild(blk);
            if (!fits(g[i])) { srcParent.insertBefore(blk, srcAnchor); break; }
          } else {
            // 소제목 없는 블록은 문단 하나씩 당겨 올린다
            var q = blk.querySelector('p');
            if (!q) { blk.remove(); continue; }
            var qAnchor = q.nextSibling;
            var bs = g[i].querySelectorAll('.ch-block');
            var last = bs.length ? bs[bs.length - 1] : null;
            if (last) last.appendChild(q);
            else {
              var nb = document.createElement('div');
              nb.className = 'ch-block';
              nb.appendChild(q);
              g[i].appendChild(nb);
            }
            if (!fits(g[i])) { blk.insertBefore(q, qAnchor); break; }
          }
        }
      }

      // 빈 페이지 · 빈 블록 정리
      g.forEach(function(sec){
        sec.querySelectorAll('.ch-block').forEach(function(b){
          if (!b.querySelector('p') && !b.querySelector('.ch-sub')) b.remove();
        });
        if (!sec.querySelector('p') && !sec.querySelector('.ch-head')) sec.remove();
      });
    });
  }

  function boot(){
    try { reflow(); } catch (e) { console.error('[reflow]', e); }
    setTimeout(function(){
      try { reflow(); } catch (e) {}
      window.__REFLOW_DONE__ = true;   // 서버(Puppeteer)가 이 신호를 기다린다
      pageMeter();
    }, 400);
  }

  /* 스크롤할 때 살짝 뜨는 페이지 표시 */
  function pageMeter(){
    if (document.getElementById('pgMeter')) return;
    var pages = document.querySelectorAll('.page');
    if (pages.length < 3) return;

    var el = document.createElement('div');
    el.id = 'pgMeter';
    el.className = 'no-print';
    el.style.cssText = 'position:fixed;right:14px;top:50%;transform:translateY(-50%) translateX(8px);' +
      'z-index:90;background:rgba(24,34,52,.88);color:#e8e3d6;padding:7px 12px;border-radius:999px;' +
      'font-family:Pretendard,-apple-system,sans-serif;font-size:12.5px;font-weight:700;' +
      'letter-spacing:.02em;opacity:0;transition:opacity .25s,transform .25s;pointer-events:none;' +
      'backdrop-filter:blur(4px);box-shadow:0 4px 14px rgba(0,0,0,.25)';
    document.body.appendChild(el);

    var hide;
    function tick(){
      var mid = window.innerHeight / 2;
      var cur = 1;
      for (var i = 0; i < pages.length; i++) {
        var r = pages[i].getBoundingClientRect();
        if (r.top <= mid && r.bottom >= mid) { cur = i + 1; break; }
        if (r.top > mid) { cur = Math.max(1, i); break; }
        cur = i + 1;
      }
      el.textContent = cur + ' / ' + pages.length;
      el.style.opacity = '1';
      el.style.transform = 'translateY(-50%) translateX(0)';

      clearTimeout(hide);
      hide = setTimeout(function(){
        el.style.opacity = '0';
        el.style.transform = 'translateY(-50%) translateX(8px)';
      }, 900);
    }
    window.addEventListener('scroll', tick, { passive: true });
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function(){ setTimeout(boot, 60); });
  else window.addEventListener('load', function(){ setTimeout(boot, 200); });
})();
`;

function buildCSS(baseUrl, bgPaper) {
  // bgPaper: 배경지 이미지 경로(상대).
  //   undefined  → 기본 테두리(frame)
  //   null/'none'→ 배경 없음 (흰 종이)
  //   경로       → 그 배경지
  let paperUrl;
  if (bgPaper === null || bgPaper === 'none') {
    paperUrl = '';
  } else if (bgPaper) {
    paperUrl = (baseUrl || '') + bgPaper;
  } else {
    paperUrl = (baseUrl || '') + '/img/pdf/frame.jpg';   // 기본
  }
  return CSS_TEMPLATE
    .split('BG_PAPER_URL').join(paperUrl)
    .split('BASE_URL').join(baseUrl || '');
}

module.exports = {
  buildReportHtml, buildCSS, CSS_TEMPLATE,
  // 무료사주 PDF(freePdf.js)에서 재사용
  coverPage, tocPage, sajuPages, chapterPages, endPage, esc, glossaryPage, footnote, REFLOW_SCRIPT,
  sentenceBreaks,
};
