require('dotenv').config();
// Railway 컨테이너는 IPv6 아웃바운드 미지원 → DNS 조회 시 IPv4 우선
// (미적용 시 Gmail/OpenAI 접속에서 ENETUNREACH 발생)
try { require('dns').setDefaultResultOrder('ipv4first'); } catch (e) { /* Node 18 미만 무시 */ }
const path = require('path');
const express = require('express');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const { pool, initDb } = require('./db');
const authRoutes = require('./routes/auth');
const pagesRouter = require('./routes/pages');
const adminRouter = require('./routes/admin');
const freeRouter = require('./routes/free');
const builderRouter = require('./routes/builder');
const previewRouter = require('./routes/preview');
const coversRouter = require('./routes/covers');
const leadsRouter = require('./routes/leads');
const chatRoutes = require('./routes/chat');
const { router: shareRoutes } = require('./routes/share');
const pushRouter = require('./routes/push');
const manseRouter = require('./routes/manse');   // 만세력(명리) 계산기
const threadsAutoRouter = require('./routes/threadsAuto'); // 스레드 도구
const guideRouter = require('./routes/guide');     // 사주 자료집
const boardRouter = require('./routes/board');     // 공지사항 · 문의하기
const lpReviewRouter = require('./routes/lpReview'); // 판매 페이지 후기
const manseLinkRouter = require('./routes/manseLink'); // 만세력 연동
const msiteRouter = require('./routes/msite'); // 공개 만세력 (교육생 개인 링크)
const guest = require('./services/guestSite'); // 손님 주소와 루월당 주소를 가른다
const { router: reviewRoutes } = require('./routes/reviews');
const { requireAuth } = require('./middleware/auth');
const app = express();
const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// 후기 이미지(data URI)를 폼으로 받기 때문에 기본 100kb 로는 부족하다
app.use(express.urlencoded({ extended: true, limit: '25mb' }));
app.use(express.json({ limit: '25mb' }));
// 알림 수신기는 절대 캐시하지 않는다 — 캐시되면 고친 내용이 폰에 안 내려간다
app.get('/sw.js', (req, res) => {
  res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.sendFile(path.join(__dirname, 'public', 'sw.js'));
});

app.use(express.static(path.join(__dirname, 'public')));
if (isProd) app.set('trust proxy', 1); // Railway(https) 프록시 뒤 쿠키 secure 동작
app.use(
  session({
    store: new pgSession({ pool, tableName: 'session', createTableIfMissing: true }),
    secret: process.env.SESSION_SECRET || 'change-me-please',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 14, // 14일
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
    },
  })
);
/* ⚠️ 손님 주소(saju.pe.kr)에서는 루월당이 한 글자도 보이면 안 된다.
   첫 화면·로그인은 루월당 주소에서만 열린다. */
app.use((req, res, next) => {
  if (!guest.isGuest(req)) return next();
  if (req.path === '/' || /^\/(auth|logout|pending)(\/|$)/.test(req.path)) {
    return guest.block(req, res);
  }
  next();
});

// 랜딩 (비로그인)
app.get('/', (req, res) => {
  if (req.session.userId) return res.redirect('/home');
  res.render('landing', {});
});
// 카카오 로그인
app.use('/auth', authRoutes);

// 테스트 로그인 상태면 계정 전환 바 정보를 모든 화면에 넘긴다
app.use(async (req, res, next) => {
  try {
    res.locals.testSwitch = authRoutes.testSwitchInfo
      ? authRoutes.testSwitchInfo(req)
      : null;
  } catch (e) {
    res.locals.testSwitch = null;
  }
  // 관리자가 다른 계정으로 보는 중이면 상단에 알려준다
  try {
    res.locals.adminAs = authRoutes.adminAsInfo
      ? await authRoutes.adminAsInfo(req)
      : null;
  } catch (e) {
    res.locals.adminAs = null;
  }
  next();
});
// 승인 대기
app.get('/pending', requireAuth, (req, res) => {
  if (req.user.status === 'approved') return res.redirect('/home');
  res.render('pending', { user: req.user });
});
// 로그아웃 (대시보드 라우터보다 먼저 — 승인 대기 유저도 로그아웃 가능하도록)
app.post('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/'));
});
// 무료사주 공개 페이지 (로그인 없음) — 인증 라우터보다 먼저
// ⚠️ 공개 라우트는 로그인 검사가 걸린 라우터들보다 먼저 붙여야 한다.
// (leads/chat 라우터는 접두사 없이 마운트돼서 requireAuth 가 모든 요청을 가로챈다)
app.use(shareRoutes);   // /r/:token — 내담자가 로그인 없이 리포트 열람
app.use(reviewRoutes);
  // 후기 (/r/:token/review 는 공개, /reviews 는 교육생)
app.use(pushRouter);      // 브라우저 알림
// 판매 페이지 후기·설정·사진 — /api/lp/*, /lp/rimg/:id (로그인 없이 열린다)
// 로그인 검사가 걸린 라우터(leads 등)보다 반드시 먼저 붙어야 한다.
app.use('/', lpReviewRouter);
/* 만세력 연동 — /api/manse/lead 는 로그인 없이 열려 있어야 한다.
   leads 라우터의 requireAuth 가 /api/* 를 가로채므로 반드시 그보다 먼저. */
app.use('/', manseLinkRouter);
/* 공개 만세력 — /saju@아이디 · /@아이디 (로그인 없음).
   없는 아이디면 next() 로 넘기므로 뒤에 붙은 라우터를 가로막지 않는다. */
app.use('/', msiteRouter);
// 무료사주 — /s/:slug 등 손님이 보는 화면. 손님 문보다 먼저 붙인다.
app.use('/', freeRouter);

/* ── 손님 주소는 여기까지다 ────────────────────────────────
 * 위까지가 손님이 볼 수 있는 것 전부다 (만세력·무료사주·리포트·후기).
 * 아래는 전부 교육생 대시보드라 손님 주소에서는 닫는다.
 * 다만 맨 주소 만세력(/아이디)은 제일 마지막에 붙는 법이라
 * 여기서 먼저 한 번 불러보고, 그래도 아니면 안내 화면을 준다. */
app.use((req, res, next) => {
  if (!guest.isGuest(req)) return next();
  /* /.well-known 은 막으면 안 된다.
     https 인증서를 받을 때 이 통로로 확인하러 온다. 막으면 인증서가 안 나온다. */
  if (req.path.startsWith('/.well-known/')) return next();
  msiteRouter.tail(req, res, () => guest.block(req, res));
});

// 스레드 자동화 — /threads, /threads/manual, /api/threads/*
// (leads 라우터의 requireAuth 가 /api/* 를 가로채므로 반드시 그보다 먼저)
app.use('/', threadsAutoRouter);
// 관리자 (승인 관리 등) — 대시보드 라우터보다 먼저
app.use('/admin', adminRouter);
// 랜딩 빌더
app.use('/', builderRouter);
// ⚠️ 리포트 미리보기 · 수정하기 — 반드시 leadsRouter 보다 "먼저"
//    leads.js 안에 옛날 /pdfs/:id/preview 가 남아 있는데, 먼저 붙은 쪽이 이긴다.
app.use('/', previewRouter);
// 사주 신청자 + PDF 제작/발송
app.use('/', leadsRouter);
app.use(chatRoutes);
// 만세력 계산기 (교육생용) — /manse, /api/manse/*
app.use('/', manseRouter);
// 사주 자료집 (관리자 작성 · 교육생 열람) — /guide, /admin/guide
app.use('/', guideRouter);
// 공지사항 · 문의하기 — /notice, /support, /admin/notice, /admin/support
app.use('/', boardRouter);
// 멘트 메모장 기기 간 연동
app.use('/', require('./routes/memo'));
// 홈 + 대시보드 전체 (사이드바 메뉴 페이지들)
app.use('/', coversRouter);   // 교육생: 내 PDF 표지
app.use('/', pagesRouter);
/* 맨 주소로 들어오는 공개 만세력 — 새도메인.kr/kimdosa
   ⚠️ 모든 주소를 다 잡을 수 있어 제일 마지막에 둔다.
      앞에 붙은 진짜 주소들이 먼저 이기고, 남는 것만 여기로 온다.
      그리고 승인된 교육생 아이디일 때만 응답한다. */
app.use('/', msiteRouter.tail);

// 에러 핸들러
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('서버 오류가 발생했습니다.');
});
initDb()
  .then(() => {
    // 개인정보 자동 마스킹 스케줄 시작 (발송 7일 후 개인정보 파기)
    try {
      require('./services/privacy').startMaskingSchedule();
    } catch (e) {
      console.error('[개인정보] 스케줄 시작 실패:', e.message);
    }
    // 예약한 스레드 글을 때가 되면 서버가 올린다 (1분 주기)
    // 브라우저가 아니라 서버에서 돌기 때문에 창을 닫아도 올라간다.
    try {
      require('./services/threads/scheduler').start();
    } catch (e) {
      console.error('[스레드] 예약 감시 시작 실패:', e.message);
    }
    app.listen(PORT, () => console.log(`서버 실행: http://localhost:${PORT}`));
  })
  .catch((e) => {
    console.error('[DB] 초기화 실패:', e);
    process.exit(1);
  });
