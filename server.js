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
const { router: devLoginRouter, devEnabled } = require('./routes/devLogin');
const pagesRouter = require('./routes/pages');
const adminRouter = require('./routes/admin');
const freeRouter = require('./routes/free');
const builderRouter = require('./routes/builder');
const leadsRouter = require('./routes/leads');
const { requireAuth } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
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

// 랜딩 (비로그인)
app.get('/', (req, res) => {
  if (req.session.userId) return res.redirect('/home');
  res.render('landing', { devLogin: devEnabled() });
});

// 카카오 로그인
app.use('/auth', authRoutes);
// 개발용 임시 로그인 (DEV_LOGIN=on 일 때만)
app.use('/dev', devLoginRouter);

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
app.use('/', freeRouter);

// 관리자 (승인 관리 등) — 대시보드 라우터보다 먼저
app.use('/admin', adminRouter);

// 랜딩 빌더
app.use('/', builderRouter);

// 사주 신청자 + PDF 제작/발송
app.use('/', leadsRouter);

// 홈 + 대시보드 전체 (사이드바 메뉴 페이지들)
app.use('/', pagesRouter);

// 에러 핸들러
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('서버 오류가 발생했습니다.');
});

initDb()
  .then(() => {
    app.listen(PORT, () => console.log(`서버 실행: http://localhost:${PORT}`));
  })
  .catch((e) => {
    console.error('[DB] 초기화 실패:', e);
    process.exit(1);
  });
