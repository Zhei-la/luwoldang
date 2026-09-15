/* ============================================================
 * routes/siteV2.js — 통합 사이트 (내 웹사이트 + 무료 만세력을 한 페이지로)
 *
 * 켜진 교육생은 아래 주소가 모두 같은 통합 사이트로 열린다.
 *   /{아이디}  ← 대표 주소
 *   /s/{아이디} · /@{아이디} · /saju@{아이디}  → 대표 주소로 넘긴다 (이미 공유한 링크도 산다)
 * 꺼진 교육생은 next() 로 넘겨 예전 화면(웹사이트·만세력)이 그대로 열린다.
 *
 * 켜는 방법: 환경변수 SITE_V2_SLUGS=아이디1,아이디2  (비워두면 lu-saju 만, '*' 는 전원)
 *   → 서버가 뜰 때 그 계정의 users.site_v2_on 을 켠다. 이후 링크 주소를 바꿔도 계속 켜져 있다.
 *
 * 화면은 ruwoldang-site 저장소(React)에서 묶어 온 파일이 그린다.
 *   services/siteV2/render.js    서버에서 HTML 을 만들고 무료사주를 계산한다
 *                                (엔진은 services/cbFortune.js, 시각 보정은 services/siteV2/correction.js)
 *   public/site-v2/*             브라우저 스크립트 · CSS
 * 이 묶음 파일은 고치지 말고 그 저장소에서 scripts/build-ruwoldang.mjs 로 다시 만든다.
 *
 * 꾸미기 화면은 /site-design 이다. (/site-v2 는 public/site-v2 폴더라 정적 파일이 먼저 가로챈다)
 *
 * ⚠️ server.js 에서
 *   publicRouter 는 msiteRouter · freeRouter 보다 먼저 (손님 주소 벽 앞)
 *   dashRouter   는 손님 주소 벽 뒤 (로그인한 교육생만)
 * ============================================================ */

'use strict';

const express = require('express');
const { pool } = require('../db');
const guest = require('../services/guestSite');
const { notify } = require('../services/push');
const { requireAuth, requireApproved } = require('../middleware/auth');
const v2 = require('../services/siteV2/render');

const MAX_HISTORY = 15;

/* ── 켜진 아이디 ───────────────────────────────────── */

/* 켜짐 표시는 아이디가 아니라 계정(users.site_v2_on)에 붙인다 — 교육생이 링크 주소를 바꿔도 꺼지지 않게.
 * SITE_V2_SLUGS 는 서버가 뜰 때 그 아이디 계정에 표시를 붙이는 데 쓴다 (비우면 lu-saju). '*' 는 전원.
 * 요청마다 DB 를 부르지 않도록 켜진 아이디를 메모리에 들고 있고,
 * 서버가 뜰 때(init)와 아이디를 바꿀 때(routes/pages.js → reload) 다시 읽는다. */
const SEED = String(process.env.SITE_V2_SLUGS ? process.env.SITE_V2_SLUGS : 'lu-saju')
  .split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
const ALL = SEED.includes('*');
const onSlugs = new Set(SEED.filter((s) => s !== '*'));   // DB 를 읽기 전에도 켜져 있게

function isOn(slug) {
  const s = String(slug || '').trim().toLowerCase();
  return !!s && (ALL || onSlugs.has(s));
}

async function reload() {
  const { rows } = await pool.query(
    `SELECT LOWER(slug) AS slug FROM users WHERE site_v2_on = TRUE AND slug IS NOT NULL`
  );
  onSlugs.clear();
  rows.forEach((r) => onSlugs.add(r.slug));
}

async function init() {
  const seed = SEED.filter((s) => s !== '*');
  if (seed.length) {
    await pool.query(
      `UPDATE users SET site_v2_on = TRUE WHERE LOWER(slug) = ANY($1::text[]) AND site_v2_on IS NOT TRUE`,
      [seed]
    );
  }
  await reload();
}

/** 켜진 아이디의 교육생. 켜지지 않은 아이디는 DB 를 부르지도 않는다. */
async function teacherOf(slug) {
  const s = String(slug || '').trim().toLowerCase();
  if (!isOn(s)) return null;
  const { rows } = await pool.query(
    `SELECT id, name, site_name, slug, kakao_consult_link,
            bank_name, bank_account, bank_holder, bank_notice, site_v2
       FROM users
      WHERE LOWER(slug) = $1 AND status = 'approved'
      LIMIT 1`,
    [s]
  );
  return rows[0] || null;
}

/* ── 설정 저장 ─────────────────────────────────────── */

/** 아직 꾸미지 않았으면 기본 디자인에 교육생 이름·카카오 링크를 넣는다 */
function seedConfig(t) {
  const cfg = JSON.parse(JSON.stringify(v2.DEFAULT_SITE));
  const name = String(t.site_name || t.name || '').trim();
  if (name) cfg.brand.name = name;
  if (t.kakao_consult_link) cfg.contact.kakao = t.kakao_consult_link;
  return v2.normalizeSite(cfg);
}

function storeOf(t) {
  let sv = t.site_v2;
  if (typeof sv === 'string') { try { sv = JSON.parse(sv); } catch (e) { sv = null; } }
  sv = sv && typeof sv === 'object' ? sv : {};
  const seed = seedConfig(t);
  return {
    draft: v2.normalizeSite(sv.draft || seed),
    published: v2.normalizeSite(sv.published || seed),
    draftSavedAt: sv.draftSavedAt || null,
    publishedAt: sv.publishedAt || null,
    history: (Array.isArray(sv.history) ? sv.history : [])
      .filter((h) => h && h.config)
      .map((h) => ({ at: h.at, config: v2.normalizeSite(h.config) })),
  };
}

/** base(주소 앞자리)는 저장하지 않는다 */
const strip = (c) => { const x = Object.assign({}, c); delete x.base; return x; };

async function saveStore(userId, s) {
  const data = {
    draft: strip(s.draft),
    published: strip(s.published),
    draftSavedAt: s.draftSavedAt,
    publishedAt: s.publishedAt,
    history: s.history.map((h) => ({ at: h.at, config: strip(h.config) })),
  };
  await pool.query('UPDATE users SET site_v2 = $1 WHERE id = $2', [JSON.stringify(data), userId]);
}

/** 편집기가 받는 모양 (ruwoldang-site 의 /api/admin/site 와 같다) */
const view = (s) => ({
  draft: s.draft,
  published: s.published,
  draftSavedAt: s.draftSavedAt,
  publishedAt: s.publishedAt,
  history: s.history.map((h) => ({ at: h.at, preset: h.config.theme.preset, brand: h.config.brand.name })),
});

const withBase = (cfg, t) => Object.assign({}, cfg, { base: '/' + t.slug });

/* ── HTML ──────────────────────────────────────────── */

const esc = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** <script> 안에 넣는 JSON — </script> 로 끊기지 않게 */
const inlineJson = (o) => JSON.stringify(o)
  .replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');

const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Song+Myung&display=swap">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css">`;

function sendPage(res, { kind, cfg, opts, noindex }) {
  const o = opts || {};
  const r = v2.renderPage(kind, cfg, o);
  const themeFonts = v2.fontHrefs(cfg.theme).map((h) => `<link rel="stylesheet" href="${esc(h)}">`).join('\n');
  res.set('Cache-Control', 'no-store');
  res.type('html').send(`<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(r.title)}</title>
${r.description ? `<meta name="description" content="${esc(r.description)}">` : ''}
<meta property="og:title" content="${esc(r.title)}">
${r.description ? `<meta property="og:description" content="${esc(r.description)}">` : ''}
${noindex ? '<meta name="robots" content="noindex">' : ''}
${FONTS}
${themeFonts}
<link rel="stylesheet" href="/site-v2/site.css?v=${v2.BUILD_ID}">
</head>
<body>
<div id="rw-root">${r.html}</div>
<script>window.__RW_PAGE__=${inlineJson(Object.assign({ kind, cfg }, o))};</script>
<script src="/site-v2/site.js?v=${v2.BUILD_ID}" defer></script>
</body>
</html>`);
}

/* 방문 기록 — msite.js 와 같은 규칙 (봇 제외, 기록 실패가 화면을 막지 않는다) */
function mark(req, t, kind) {
  try {
    const ua = req.headers['user-agent'] || '';
    if (/bot|crawler|spider|slurp|facebookexternalhit|preview/i.test(ua)) return;
    const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim();
    const key = require('crypto').createHash('sha1').update(ip + '|' + ua).digest('hex').slice(0, 16);
    require('../services/stats').recordVisit(t.id, key, kind);
  } catch (e) { /* 통계가 화면을 막지 않는다 */ }
}

/** 상품명에 적힌 금액 — '종합사주 (35,000원)' → 35000 */
function priceOf(product) {
  const m = String(product || '').match(/([\d,]{3,})\s*원/);
  if (!m) return null;
  const n = parseInt(m[1].replace(/,/g, ''), 10);
  return Number.isFinite(n) && n > 0 ? n : null;
}

/* ══════════════════════════════════════════
   손님 화면 (로그인 없음)
   ══════════════════════════════════════════ */

const publicRouter = express.Router();

async function landing(req, res, next) {
  try {
    const t = await teacherOf(req.params.slug);
    if (!t) return next();
    if (guest.bounce(req, res)) return;   /* 루월당 주소로 온 링크는 손님 주소로 */
    const canonical = '/' + t.slug;
    if (req.path.replace(/\/+$/, '') !== canonical) {
      const q = req.originalUrl.indexOf('?');
      return res.redirect(301, canonical + (q >= 0 ? req.originalUrl.slice(q) : ''));
    }
    mark(req, t, 'site');
    sendPage(res, { kind: 'landing', cfg: withBase(storeOf(t).published, t) });
  } catch (e) { next(e); }
}

publicRouter.get(['/s/:slug', '/@:slug', '/saju@:slug', '/:slug'], landing);

publicRouter.get('/:slug/apply', async (req, res, next) => {
  try {
    const t = await teacherOf(req.params.slug);
    if (!t) return next();
    if (guest.bounce(req, res)) return;
    sendPage(res, {
      kind: 'apply',
      cfg: withBase(storeOf(t).published, t),
      opts: { product: String(req.query.product || '').slice(0, 30) },
    });
  } catch (e) { next(e); }
});

publicRouter.get('/:slug/apply/done', async (req, res, next) => {
  try {
    const t = await teacherOf(req.params.slug);
    if (!t) return next();
    if (guest.bounce(req, res)) return;
    const no = String(req.query.no || '').replace(/[^0-9]/g, '').slice(0, 9);
    /* 계좌를 넣어 두셨으면 입금 안내를 보여준다 (만세력 신청과 같은 문구) */
    let bank = null;
    if (t.bank_account) {
      let amount = null;
      if (no) {
        const { rows } = await pool.query('SELECT product FROM leads WHERE id = $1 AND teacher_id = $2', [Number(no), t.id]);
        amount = priceOf(rows[0] && rows[0].product);
      }
      bank = {
        bankName: t.bank_name || '', account: t.bank_account, holder: t.bank_holder || '',
        notice: t.bank_notice || '입금자명을 신청하신 분 성함으로 남겨주세요. 확인되는 대로 작업을 시작합니다.',
        amount,
      };
    }
    sendPage(res, {
      kind: 'done',
      cfg: withBase(storeOf(t).published, t),
      opts: { no, bank, kakao: t.kakao_consult_link || '' },
      noindex: true,
    });
  } catch (e) { next(e); }
});

publicRouter.get('/:slug/policy', async (req, res, next) => {
  try {
    const t = await teacherOf(req.params.slug);
    if (!t) return next();
    if (guest.bounce(req, res)) return;
    sendPage(res, { kind: 'policy', cfg: withBase(storeOf(t).published, t) });
  } catch (e) { next(e); }
});

/* 무료사주 · 오늘의 운세 · 만세력 계산 — 입력은 저장하지 않는다.
   ⚠️ 넘기지(bounce) 않는다. 대시보드 미리보기(루월당 주소)에서도 불러야 한다. */
publicRouter.post('/:slug/api/saju', async (req, res, next) => {
  try {
    const t = await teacherOf(req.params.slug);
    if (!t) return next();
    const b = req.body || {};
    const str = (v) => (typeof v === 'string' ? v.trim() : '');
    const birthDate = str(b.birthDate);
    const birthTime = str(b.birthTime);
    const calendar = b.calendar === '음력' ? '음력' : '양력';
    const gender = b.gender === '남' ? '남' : '여';
    const region = v2.REGIONS.includes(str(b.region)) ? str(b.region) : '';
    const year = Number(birthDate.slice(0, 4));
    if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate) || year < 1920 || year > new Date().getFullYear()) {
      return res.status(400).json({ error: '생년월일을 1920년 이후 날짜로 입력해주세요.' });
    }
    if (birthTime && !/^([01]\d|2[0-3]):[0-5]\d$/.test(birthTime)) {
      return res.status(400).json({ error: '태어난 시간을 다시 확인해주세요.' });
    }
    let data;
    try {
      data = v2.freeReading({
        birthDate, birthTime: birthTime || null, calendar,
        isLeapMonth: calendar === '음력' && b.isLeapMonth === true, gender, region,
      });
    } catch (e) {
      if (e instanceof v2.SajuInputError) return res.status(400).json({ error: e.message });
      console.error('[통합 사이트] 무료사주 계산 실패:', e.message);
      return res.status(500).json({ error: '계산하지 못했어요. 날짜를 다시 확인해주세요.' });
    }
    mark(req, t, 'manse_result');
    res.set('Cache-Control', 'no-store').json(data);
  } catch (e) { next(e); }
});

/* 리포트 신청 → 사주 신청자 목록 */
const PHONE = /^01[016789]-?\d{3,4}-?\d{4}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
/* 신청자 목록·만세력 계산기와 같은 지역 이름으로 저장한다 */
const REGION_FULL = {
  서울: '서울특별시', 부산: '부산광역시', 대구: '대구광역시', 인천: '인천광역시', 광주: '광주광역시',
  대전: '대전광역시', 울산: '울산광역시', 세종: '세종특별자치시', 경기: '경기도', 강원: '강원특별자치도',
  충북: '충청북도', 충남: '충청남도', 전북: '전북특별자치도', 전남: '전라남도', 경북: '경상북도',
  경남: '경상남도', 제주: '제주특별자치도',
};

publicRouter.post('/:slug/api/orders', async (req, res, next) => {
  try {
    const t = await teacherOf(req.params.slug);
    if (!t) return next();
    const cfg = storeOf(t).published;
    const body = req.body || {};
    const bad = (error) => res.status(400).json({ error });
    const cut = (v, n) => String(v == null ? '' : v).trim().slice(0, n);

    const product = v2.productById(cut(body.productId, 30), cfg);
    if (!product || !product.report || !product.visible) return bad('상품을 다시 골라주세요');
    const a = body.applicant || {};
    if (!cut(a.name, 60)) return bad('신청자 이름을 입력해주세요');
    if (!PHONE.test(cut(a.phone, 20))) return bad('전화번호 형식을 확인해주세요');
    if (!EMAIL.test(cut(a.email, 120))) return bad('이메일 주소를 확인해주세요');
    if (!cut(a.depositor, 60)) return bad('입금자명을 입력해주세요');
    if (!body.consents || !body.consents.privacy || !body.consents.refund) return bad('필수 동의 항목을 확인해주세요');
    const persons = Array.isArray(body.persons) ? body.persons : [];
    if (persons.length !== product.persons) return bad('풀이 받을 분의 정보를 확인해주세요');

    const P = [];
    for (const p of persons) {
      if (!p || !cut(p.name, 60) || !/^\d{4}-\d{2}-\d{2}$/.test(cut(p.birthDate, 10)) || !cut(p.region, 20)) {
        return bad('풀이 받을 분의 이름·생년월일·지역을 확인해주세요');
      }
      const time = !p.timeUnknown && /^\d{1,2}:\d{2}$/.test(cut(p.birthTime, 5)) ? cut(p.birthTime, 5) : '';
      const lunar = p.calendar === '음력';
      P.push({
        name: cut(p.name, 60),
        gender: p.gender === '남' ? '남' : '여',
        birth: cut(p.birthDate, 10),
        calendar: lunar ? (p.isLeapMonth ? '윤달' : '음력') : '양력',
        hour: time,
        regionText: cut(p.region, 20),
        region: REGION_FULL[cut(p.region, 20)] || '',
      });
    }

    const digits = cut(a.phone, 20).replace(/[^0-9]/g, '');
    const phone = digits.length === 11 ? digits.slice(0, 3) + '-' + digits.slice(3, 7) + '-' + digits.slice(7) : digits;
    const productText = `${product.name} (${v2.won(product.price)})`;

    const memo = [
      `통합 사이트 · ${cfg.brand.name} 리포트 신청`,
      `신청자 ${cut(a.name, 60)} · 입금자 ${cut(a.depositor, 60)}`,
    ];
    if (product.love) memo.push(`관계: ${body.relation === '배우자' ? '배우자' : '연인'}`);
    P.forEach((p, i) => {
      const who = i === 0 ? '' : '상대방 ';
      if (!p.hour) memo.push(`${who}태어난 시간 모름`);
      if (!p.region) memo.push(`${who}태어난 지역: ${p.regionText}`);
    });
    if (cut(a.question, 500)) memo.push('궁금한 점: ' + cut(a.question, 500));

    const [p1, p2] = P;
    const { rows } = await pool.query(
      `INSERT INTO leads (teacher_id, name, gender, birth, calendar, hour, region,
                          phone, email, product, memo, status, source, recruiter,
                          partner_name, partner_gender, partner_birth, partner_hour,
                          partner_calendar, partner_region, use_local_time)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,'접수완료','상담신청',$12,
               $13,$14,$15,$16,$17,$18,$19) RETURNING id`,
      [t.id, p1.name, p1.gender, p1.birth, p1.calendar, p1.hour || null, p1.region || null,
       phone, cut(a.email, 120), productText, memo.join('\n'), t.slug,
       p2 ? p2.name : null, p2 ? p2.gender : null, p2 ? p2.birth : null, p2 ? (p2.hour || null) : null,
       p2 ? p2.calendar : null, p2 ? (p2.region || null) : null, !!p1.region]
    );
    const id = rows[0].id;

    Promise.resolve()
      .then(() => notify(t.id, { title: '웹사이트에서 리포트 신청이 들어왔어요', body: p1.name + '님 · ' + productText, url: '/leads/' + id }))
      .catch(() => { /* 알림 실패가 신청을 막지 않는다 */ });

    res.json({ no: String(id), mode: 'ruwoldang', message: '' });
  } catch (e) { next(e); }
});

/* ══════════════════════════════════════════
   교육생 대시보드 — 사이트 꾸미기
   ══════════════════════════════════════════ */

const dashRouter = express.Router();
dashRouter.use('/site-design', requireAuth, requireApproved);

dashRouter.get('/site-design', (req, res) => {
  const u = req.user;
  if (!isOn(u.slug)) return res.redirect('/builder');
  const s = storeOf(u);
  const siteUrl = guest.base(req) + '/' + u.slug;
  const data = {
    draft: s.draft,
    publishedAt: s.publishedAt,
    savedAt: s.draftSavedAt,
    history: view(s).history,
    unpublished: JSON.stringify(s.draft) !== JSON.stringify(s.published),
  };
  res.set('Cache-Control', 'no-store');
  res.type('html').send(`<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>사이트 꾸미기 · 루월당</title>
${FONTS}
<link rel="stylesheet" href="/site-v2/site.css?v=${v2.BUILD_ID}">
<link rel="stylesheet" href="/site-v2/editor.css?v=${v2.BUILD_ID}">
</head>
<body>
<div class="admin admin-design-only">
  <aside class="admin-side">
    <a href="/home" class="brand" style="color:inherit"><span class="brand-mark sym-moon" aria-hidden="true"></span><span class="brand-name">사이트 꾸미기</span></a>
    <nav class="side-nav" aria-label="메뉴">
      <a href="/home">← 대시보드</a>
      <a href="/free-saju-settings">링크 · 설정</a>
      <a href="${esc(siteUrl)}" target="_blank" rel="noopener">사이트 보기 ↗</a>
    </nav>
  </aside>
  <main class="admin-main"><div id="rw-editor"></div></main>
</div>
<script>window.__RW_PATHS__=${inlineJson({ admin: '/site-design', site: siteUrl, inlineImages: true })};window.__RW_EDITOR__=${inlineJson(data)};</script>
<script src="/site-v2/editor.js?v=${v2.BUILD_ID}" defer></script>
</body>
</html>`);
});

/* 편집기 안 미리보기 — 임시 저장본을 그린다 */
dashRouter.get('/site-design/preview', (req, res) => {
  const u = req.user;
  if (!isOn(u.slug)) return res.status(404).end();
  const s = storeOf(u);
  sendPage(res, { kind: 'preview', cfg: withBase(req.query.src === 'published' ? s.published : s.draft, u), noindex: true });
});

dashRouter.get('/site-design/api/admin/site', (req, res) => {
  if (!isOn(req.user.slug)) return res.status(403).json({ error: '아직 켜지지 않은 계정이에요' });
  res.json(view(storeOf(req.user)));
});

dashRouter.put('/site-design/api/admin/site', async (req, res, next) => {
  try {
    if (!isOn(req.user.slug)) return res.status(403).json({ error: '아직 켜지지 않은 계정이에요' });
    const config = req.body && req.body.config;
    if (!config || typeof config !== 'object') return res.status(400).json({ error: '설정을 저장하지 못했어요' });
    const s = storeOf(req.user);
    s.draft = v2.normalizeSite(config);
    s.draftSavedAt = new Date().toISOString();
    await saveStore(req.user.id, s);
    res.json({ savedAt: s.draftSavedAt });
  } catch (e) { next(e); }
});

dashRouter.post('/site-design/api/admin/site', async (req, res, next) => {
  try {
    if (!isOn(req.user.slug)) return res.status(403).json({ error: '아직 켜지지 않은 계정이에요' });
    const b = req.body || {};
    const s = storeOf(req.user);
    const now = new Date().toISOString();
    if (b.action === 'publish') {
      s.history = [{ at: s.publishedAt || now, config: s.published }].concat(s.history).slice(0, MAX_HISTORY);
      s.published = JSON.parse(JSON.stringify(s.draft));
      s.publishedAt = now;
    } else if (b.action === 'revert' && typeof b.index === 'number' && s.history[b.index]) {
      s.draft = JSON.parse(JSON.stringify(s.history[b.index].config));
      s.draftSavedAt = now;
    } else if (b.action === 'reset') {
      s.draft = seedConfig(req.user);
      s.draftSavedAt = now;
    } else {
      return res.status(400).json({ error: '알 수 없는 요청이에요' });
    }
    await saveStore(req.user.id, s);
    res.json(view(s));
  } catch (e) { next(e); }
});

module.exports = { publicRouter, dashRouter, isOn, init, reload };
