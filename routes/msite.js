/* ============================================================
 * routes/msite.js — 공개 만세력 (교육생 개인 링크)
 *
 *   /saju@김도사아이디   무료 만세력 입력
 *   /@김도사아이디        같은 곳 (짧은 주소)
 *
 * 손님을 모으는 미끼다. 로그인도 이메일도 받지 않고,
 * 생년월일만 넣으면 원국·오늘의 운세·짧은 풀이를 보여준다.
 * OpenAI 를 쓰지 않으므로 손님이 아무리 많이 와도 요금이 0원이다.
 * (무료사주 /s/:slug 는 AI 로 글을 써서 조회마다 요금이 나간다. 그것과 다르다.)
 *
 * 다 보여준 다음에야 상담을 권한다. 번호를 남기면 그 교육생 신청자 목록으로 간다.
 * ⚠️ 로그인 없이 열려야 하므로 server.js 에서 leadsRouter 보다 먼저 붙인다.
 * ============================================================ */

const express = require('express');
const router = express.Router();
const { pool } = require('../db');
/* ⚠️ services/cbEngine.js 를 쓰지 않는다.
   그것은 명리학자가 준 파일이라 그대로 두고,
   교육생 만세력 계산기(/manse)가 계속 쓴다.
   이 페이지는 cbFortune 안에 함께 들어있는 엔진을 쓴다. */
const fortune = require('../services/cbFortune');
const engine = fortune;
const { REGIONS } = require('../services/cbRegions');
const theme = require('../services/msiteTheme');
const { notify } = require('../services/push');

/* ── 도우미 ───────────────────────────────────────── */

/** 그 아이디를 쓰는 교육생. 승인된 사람만 링크가 산다. */
async function teacherOf(slug) {
  const s = String(slug || '').trim().toLowerCase();
  if (!s) return null;
  const { rows } = await pool.query(
    `SELECT id, name, site_name, slug, kakao_consult_link, consult_message, button_text,
            msite_theme
       FROM users
      WHERE LOWER(slug) = $1 AND status = 'approved'
      LIMIT 1`,
    [s]
  );
  return rows[0] || null;
}

/** 화면 맨 위에 보일 이름 */
function siteName(t) {
  return (t.site_name || t.name || '').trim() || '사주 한 장';
}

const num = (v) => {
  const n = Number(String(v == null ? '' : v).replace(/[^0-9-]/g, ''));
  return Number.isFinite(n) ? n : NaN;
};

/**
 * 보낸 값을 엔진이 받는 모양으로 바꾼다.
 * 잘못된 값은 여기서 다 걸러낸다 — 엔진에 이상한 값을 넣으면 통째로 터진다.
 */
function readBirth(b) {
  const year = num(b.year), month = num(b.month), day = num(b.day);
  if (!(year >= 1900 && year <= 2100)) return { why: '태어난 해를 1900~2100 사이로 넣어주세요.' };
  if (!(month >= 1 && month <= 12)) return { why: '태어난 달을 1~12 사이로 넣어주세요.' };
  if (!(day >= 1 && day <= 31)) return { why: '태어난 날을 1~31 사이로 넣어주세요.' };

  const hourUnknown = b.hourUnknown === 'on' || b.hourUnknown === true || b.hourUnknown === '1';
  let hour = num(b.hour), minute = num(b.minute);
  if (hourUnknown || !Number.isFinite(hour)) { hour = 12; minute = 0; }
  if (!(hour >= 0 && hour <= 23)) return { why: '태어난 시를 0~23 사이로 넣어주세요.' };
  if (!(minute >= 0 && minute <= 59)) minute = 0;

  /* 양력은 있을 수 없는 날을 걸러낸다 — 2월 31일 같은 것.
     음력은 달마다 끝나는 날이 달라 엔진에게 맡긴다. */
  const lunar = b.calendar === '음력' || b.calendar === '음력 윤달';
  if (!lunar) {
    const d = new Date(Date.UTC(year, month - 1, day));
    if (d.getUTCFullYear() !== year || d.getUTCMonth() !== month - 1 || d.getUTCDate() !== day) {
      return { why: year + '년 ' + month + '월에는 ' + day + '일이 없습니다. 날짜를 다시 확인해주세요.' };
    }
  }

  const region = REGIONS.find((r) => r.name === b.region);

  return {
    input: {
      year, month, day, hour, minute,
      hourUnknown,
      isLunar: lunar,
      isLeapMonth: b.calendar === '음력 윤달' || b.leap === 'on' || b.leap === '1',
      gender: b.gender === 'male' ? 'male' : 'female',
      correctionMinutes: region ? region.correctionMinutes : 0,
      birthRegionLabel: region ? region.name : '',
      jasi: 'normal',
      name: String(b.name || '').trim().slice(0, 20),
    },
    regionName: region ? region.name : '',
  };
}

/* ── 화면 ─────────────────────────────────────────── */

/**
 * 이 손님이 들어온 주소의 앞자리.
 *   /saju@kimdosa  →  '/saju@kimdosa'
 *   /kimdosa       →  '/kimdosa'
 *   서브도메인      →  ''  (맨 뿌리)
 * 안쪽 링크를 이걸로 만들어야 주소창에 루월당이 안 드러난다.
 */
function basePath(req, t) {
  /* 서브도메인으로 들어온 경우는 앞자리가 없다.
     주소만 보고 짐작하면 /guide/ilju 의 「/guide」 를 이름으로 잘못 읽는다.
     그래서 서브도메인 미들웨어가 여기에 표시를 남겨둔다. */
  if (req._msiteRoot) return '';
  const p = (req.originalUrl || '').split('?')[0].replace(/\/+$/, '');
  const m = p.match(/^(\/(?:saju@|@)?[A-Za-z0-9-]+)/);
  if (!m) return '';
  /* 「/guide」 처럼 우리가 쓰는 말이면 이름이 아니다 */
  const first = m[1].replace(/^\/(?:saju@|@)?/, '');
  if (first === 'guide' || first === 'join') return '';
  return m[1];
}

/** 해마다 고를 수 있는 연도 — 올해부터 1900년까지 */
function yearList() {
  const out = [];
  for (let y = new Date().getFullYear(); y >= 1900; y--) out.push(y);
  return out;
}

/**
 * 첫 화면에 늘 필요한 것들.
 * 보낼 주소(postTo)는 들어온 주소에 맞춘다 —
 * 서브도메인이나 맨 주소로 들어온 손님을 /saju@ 로 되돌리면
 * 주소창에 루월당이 드러난다.
 */
function pageBits(req, t) {
  return {
    t, siteName: siteName(t), slug: t.slug,
    themeVars: theme.cssVars(t.msite_theme),
    regions: REGIONS,
    years: yearList(),
    samples: fortune.allIlju().slice(0, 6),
    postTo: req.originalUrl.split('?')[0] || ('/saju@' + t.slug),
    base: basePath(req, t),
  };
}

/** 입력 화면 */
async function showInput(req, res, next) {
  try {
    const t = await teacherOf(req.params.slug);
    if (!t) return next();          // 없는 아이디면 다른 라우터에게 넘긴다

    res.render('msite/input', Object.assign(pageBits(req, t), { err: '', old: {} }));
  } catch (e) { next(e); }
}

/** 결과 화면 */
async function showResult(req, res, next) {
  try {
    const t = await teacherOf(req.params.slug);
    if (!t) return next();

    const b = readBirth(req.body || {});
    if (b.why) {
      return res.render('msite/input',
        Object.assign(pageBits(req, t), { err: b.why, old: req.body || {} }));
    }

    let r;
    try {
      r = engine.명식표상세(b.input);
    } catch (e) {
      console.error('[만세력] 계산 실패:', e.message);
      return res.render('msite/input', Object.assign(pageBits(req, t), {
        err: '그 날짜로는 계산하지 못했습니다. 날짜를 다시 확인해주세요.',
        old: req.body || {},
      }));
    }

    const c = r.raw.consult;
    const reading = fortune.buildReading(c);

    /* 오늘의 운세 — 용신/기신은 이미 계산돼 있으니 그대로 쓴다 */
    let today = null;
    try {
      today = fortune.오늘의운세({
        일간: c.일간, 일지: String(c.일주 || '').slice(1, 2),
        용신: c.용신, 희신: c.희신, 기신: c.기신, 구신: c.구신,
        date: new Date(),
      });
    } catch (e) {
      console.error('[만세력] 오늘의 운세 실패:', e.message);
    }

    res.render('msite/result', {
      t, siteName: siteName(t), slug: t.slug,
      themeVars: theme.cssVars(t.msite_theme),
      name: b.input.name,
      birthLabel: b.input.year + '년 ' + b.input.month + '월 ' + b.input.day + '일' +
        (b.input.isLunar ? (b.input.isLeapMonth ? ' (음력 윤달)' : ' (음력)') : '') +
        (b.input.hourUnknown ? ' · 시간 모름' : ' ' + b.input.hour + '시 ' + b.input.minute + '분') +
        (b.regionName ? ' · ' + b.regionName : ''),
      wonguk: r.raw.wonguk || [],
      wolun: r.raw.월운목록 || [],
      /* 여기서부턴는 사람이 읽어야 하는 곳이라는 걸 보여준다 */
      teaser: fortune.LOCKED_TEASER,
      base: basePath(req, t),
      consult: c,
      reading,
      today,
      joined: false,
      joinTo: (req.originalUrl.split('?')[0] || ('/saju@' + t.slug)).replace(/\/$/, '') + '/join',
    });
  } catch (e) { next(e); }
}

/** 상담 신청 — 이름·번호만 받는다. 적을수록 덜 도망간다. */
async function join(req, res, next) {
  try {
    const t = await teacherOf(req.params.slug);
    if (!t) return next();

    const b = req.body || {};
    const name = String(b.name || '').trim().slice(0, 60);
    const digits = String(b.phone || '').replace(/[^0-9]/g, '');
    if (!name || digits.length < 9) {
      return res.status(400).json({ ok: false, error: '이름과 연락처를 확인해주세요.' });
    }
    if (b.agree !== 'on' && b.agree !== true && b.agree !== '1') {
      return res.status(400).json({ ok: false, error: '개인정보 수집에 동의해주셔야 합니다.' });
    }
    const phone = digits.length === 11
      ? digits.slice(0, 3) + '-' + digits.slice(3, 7) + '-' + digits.slice(7)
      : digits;

    const memo = ['만세력 · ' + siteName(t) + ' 링크로 들어옴'];
    if (String(b.memo || '').trim()) memo.unshift(String(b.memo).trim().slice(0, 500));

    const { rows } = await pool.query(
      `INSERT INTO leads (teacher_id, name, phone, memo, status, source, recruiter)
       VALUES ($1,$2,$3,$4,'접수완료','만세력',$5) RETURNING id`,
      [t.id, name, phone, memo.join('\n'), t.slug]
    );

    notify(t.id, {
      title: '만세력에서 신청이 들어왔어요',
      body: name + '님이 번호를 남겼습니다',
      url: '/leads/' + rows[0].id,
    });

    /* 식기 전에 바로 이야기가 시작되도록 카톡으로 넘긴다 */
    res.json({ ok: true, kakao: t.kakao_consult_link || '' });
  } catch (e) { next(e); }
}


/* ── 일주·일간 설명 ────────────────────────────────
 * 검색으로 들어오는 자리다. 「무오 일주」 같은 말로 찾아온 손님이
 * 설명을 읽고, 그 아래에서 자기 만세력을 보게 된다.
 * ============================================================ */

const EL_HANJA = { 목: '木', 화: '火', 토: '土', 금: '金', 수: '水' };

/** 60갑자 목록 — 일간 열 개로 묶어 보여준다 */
async function guideIljuIndex(req, res, next) {
  try {
    const t = await teacherOf(req.params.slug);
    if (!t) return next();
    const all = fortune.allIlju();
    const groups = Object.keys(fortune.ILGAN).map((stem) => {
      const g = fortune.ILGAN[stem];
      return {
        stem, hanja: g.hanja, elem: g.elem,
        list: all.filter((x) => x.ganzhi[0] === stem),
      };
    }).filter((g) => g.list.length);

    res.render('msite/guide-ilju-index', {
      t, siteName: siteName(t), slug: t.slug,
      themeVars: theme.cssVars(t.msite_theme),
      base: basePath(req, t),
      groups,
    });
  } catch (e) { next(e); }
}

/** 일주 하나 */
async function guideIlju(req, res, next) {
  try {
    const t = await teacherOf(req.params.slug);
    if (!t) return next();

    const ganzhi = decodeURIComponent(String(req.params.ganzhi || '')).trim();
    const info = fortune.ilju(ganzhi);
    /* 없는 간지면 다음 라우터로 넘긴다. 억지로 빈 화면을 보여주지 않는다. */
    if (!info || !info.tagline) return next();

    const stem = ganzhi[0], branch = ganzhi[1];
    const all = fortune.allIlju();

    res.render('msite/guide-ilju', {
      t, siteName: siteName(t), slug: t.slug,
      themeVars: theme.cssVars(t.msite_theme),
      base: basePath(req, t),
      info, stem, branch,
      stemHanja: fortune.STEM_K2H[stem] || '',
      branchHanja: fortune.BRANCH_K2H[branch] || '',
      stemElem: fortune.STEM_ELEM_KO[stem] || '',
      branchElem: fortune.BRANCH_ELEM_KO[branch] || '',
      animal: fortune.BRANCH_ANIMAL[branch] || '',
      g: fortune.ILGAN[stem] || null,
      EL: { 목: 'mok', 화: 'hwa', 토: 'to', 금: 'geum', 수: 'su' },
      others: all.filter((x) => x.ganzhi[0] === stem && x.ganzhi !== ganzhi),
      sameAnimal: all.filter((x) => x.ganzhi[1] === branch && x.ganzhi !== ganzhi),
    });
  } catch (e) { next(e); }
}

/** 일간 하나 */
async function guideIlgan(req, res, next) {
  try {
    const t = await teacherOf(req.params.slug);
    if (!t) return next();

    const stem = decodeURIComponent(String(req.params.stem || '')).trim();
    const g = fortune.ILGAN[stem];
    if (!g) return next();

    res.render('msite/guide-ilgan', {
      t, siteName: siteName(t), slug: t.slug,
      themeVars: theme.cssVars(t.msite_theme),
      base: basePath(req, t),
      g, elemHanja: EL_HANJA[g.elem] || '',
      iljus: fortune.allIlju().filter((x) => x.ganzhi[0] === stem),
    });
  } catch (e) { next(e); }
}

/** 한 라우터에 설명 페이지 세 개를 붙인다. 주소 모양마다 다시 쓰지 않으려고 함수로 뺐다. */
function addGuide(r, pre) {
  r.get(pre + '/guide/ilju', guideIljuIndex);
  r.get(pre + '/guide/ilju/:ganzhi', guideIlju);
  r.get(pre + '/guide/ilgan/:stem', guideIlgan);
}

/* ── 어느 주소로 들어와도 알아듣는다 ────────────────
 *
 *   luwolsaju.com/saju@kimdosa      긴 주소 — 무엇인지 알아보기 쉽다
 *   luwolsaju.com/@kimdosa          짧은 주소 — 문자로 보내기 좋다
 *   새도메인.kr/kimdosa           이름만 — 루월당이 안 보인다
 *   kimdosa.새도메인.kr           서브도메인 — 제일 깔끔하다
 *
 * 뒤의 둘은 도메인을 하나 붙이시면 그 때부터 살아난다.
 * 지금 도메인으로 들어오면 긴 주소·짧은 주소만 도다.
 * ============================================================ */

router.get('/saju@:slug', showInput);
router.get('/@:slug', showInput);
router.post('/saju@:slug', showResult);
router.post('/@:slug', showResult);
router.post('/saju@:slug/join', join);
router.post('/@:slug/join', join);
addGuide(router, '/saju@:slug');
addGuide(router, '/@:slug');

/**
 * 서브도메인으로 들어왔는지 본다 — kimdosa.어디.kr
 *
 * 루월당 본 주소(환경변수 MAIN_HOST, 기본 luwolsaju.com)와
 * www · railway 기본 주소는 건드리지 않는다.
 * 그러지 않으면 대시보드가 통째로 막힐 수 있다.
 */
const MAIN_HOSTS = String(process.env.MAIN_HOST || 'luwolsaju.com')
  .split(',').map((h) => h.trim().toLowerCase()).filter(Boolean);

function subSlug(req) {
  const host = String(req.hostname || '').toLowerCase();
  if (!host || /^[0-9.]+$/.test(host)) return '';        /* IP 주소 */
  if (host === 'localhost') return '';
  const parts = host.split('.');
  if (parts.length < 3) return '';                        /* 맨 도메인 */
  const first = parts[0];
  if (first === 'www') return '';
  /* 루월당 본 주소나 railway 기본 주소면 손대지 않는다 */
  const rest = parts.slice(1).join('.');
  if (MAIN_HOSTS.includes(host) || MAIN_HOSTS.includes(rest)) return '';
  if (host.endsWith('.railway.app') || host.endsWith('.up.railway.app')) return '';
  if (!/^[a-z0-9-]{2,40}$/.test(first)) return '';
  return first;
}

router.use(async (req, res, next) => {
  const slug = subSlug(req);
  if (!slug) return next();
  const t = await teacherOf(slug).catch(() => null);
  if (!t) return next();
  req.params.slug = slug;
  req._msiteRoot = true;   /* 앞자리가 없는 주소다 */
  if (req.method === 'GET' && req.path === '/') return showInput(req, res, next);
  if (req.method === 'POST' && req.path === '/') return showResult(req, res, next);
  if (req.method === 'POST' && req.path === '/join') return join(req, res, next);
  if (req.method === 'GET') {
    /* 서브도메인은 이름이 주소에 없으므로 여기서 갈라준다 */
    if (req.path === '/guide/ilju') return guideIljuIndex(req, res, next);
    let m = req.path.match(/^\/guide\/ilju\/(.+)$/);
    if (m) { req.params.ganzhi = m[1]; return guideIlju(req, res, next); }
    m = req.path.match(/^\/guide\/ilgan\/(.+)$/);
    if (m) { req.params.stem = m[1]; return guideIlgan(req, res, next); }
  }
  next();
});

/**
 * 맨 주소 — 새도메인.kr/kimdosa
 *
 * ⚠️ 이건 모든 주소를 다 잡을 수 있어
 *    server.js 에서 제일 마지막에 붙인다.
 *    그래야 /leads 같은 진짜 주소가 먼저 이긴다.
 */
const tail = express.Router();
tail.get('/:slug', showInput);
tail.post('/:slug', showResult);
tail.post('/:slug/join', join);
addGuide(tail, '/:slug');

module.exports = router;
module.exports.tail = tail;
