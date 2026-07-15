/* ============================================================
 * 리포트 미리보기 + 수정하기
 *
 * ⚠️ 이 파일은 server.js 에서 leadsRouter 보다 "먼저" 마운트된다.
 *    그래야 leads.js 안의 옛날 /pdfs/:id/preview 를 덮어쓴다.
 *    (leads.js 는 손대지 않는다)
 *
 * ⚠️ 규칙: 브라우저에서 돌 JS 를 여기(서버 템플릿 리터럴) 안에 넣지 말 것.
 *    옛날 버그가 딱 그것 때문이었다.
 *      var IN_APP = /...|Line\//i.test(UA)
 *      → 백틱 안에서 \/ 가 / 로 풀려서 정규식이 깨지고
 *      → "i is not defined" 로 스크립트 전체가 죽고
 *      → 수정하기 버튼이 안 눌렸다.
 *    브라우저 JS 는 전부 public/js/preview-editor.js 에 있다.
 *    여기서는 window 값만 넘긴다.
 * ============================================================ */

const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const { requireAuth, requireApproved } = require('../middleware/auth');
const { calcSaju } = require('../services/manseryeok');
const { buildReportHtml, esc } = require('../services/pdfDoc');
const { buildFreePdfHtml } = require('../services/freePdf');
const { normalizeBirth, parseHour } = require('../services/birth');
const { resolveCover } = require('../services/coverStore');

const FREE = '무료사주';

/* 최초 생성 원문 보관 컬럼 (되돌리기용) — 첫 요청 때 한 번만 확인 */
let columnReady = false;
async function ensureOrigColumn() {
  if (columnReady) return;
  await pool.query('ALTER TABLE pdfs ADD COLUMN IF NOT EXISTS sections_orig JSONB;');
  columnReady = true;
  console.log('[DB] pdfs.sections_orig 준비 완료');
}

router.use(requireAuth, requireApproved);

/* ============================================================
 * 챕터 제목 지키기
 *
 * 화면에서 글을 긁어모을 때(collect) 제목은 챕터 첫 페이지의 .ch-title 에서만
 * 읽어온다. 리플로우로 페이지가 재배치되면서 그 페이지를 못 찾으면
 * 제목이 빈 문자열로 저장돼 목차에서 제목이 사라졌다.
 *
 * → 저장할 때 빈 제목이 오면 무시하고, 원래 제목을 그대로 지킨다.
 * ============================================================ */
function keepTitles(next, prev, orig) {
  if (!Array.isArray(next)) return next;

  return next.map((ch, i) => {
    const title = String((ch && ch.title) || '').trim();
    if (title) return ch;

    // 빈 제목 → 이전 저장본 → 최초 원문 순으로 되찾는다
    const fallback =
      (Array.isArray(prev) && prev[i] && prev[i].title) ||
      (Array.isArray(orig) && orig[i] && orig[i].title) ||
      '';

    if (fallback) console.log(`[PDF] 빈 제목 복구: ${i + 1}번 챕터 → "${fallback}"`);
    return Object.assign({}, ch, { title: fallback });
  });
}

/* 신청자 정보로 사주를 계산한다 (실패해도 미리보기는 떠야 한다) */
function sajuOf(pdf) {
  try {
    return calcSaju({
      birthDate: normalizeBirth(pdf.birth),
      birthTime: parseHour(pdf.hour),
      calendar: pdf.calendar === '윤달' ? '음력' : (pdf.calendar || '양력'),
      isLeapMonth: pdf.calendar === '윤달',
      region: pdf.region || '서울특별시',
      gender: pdf.gender,
    });
  } catch (e) {
    return null;
  }
}

/* ===== 미리보기 ===== */
router.get('/pdfs/:id/preview', async (req, res, next) => {
  try {
    await ensureOrigColumn();

    const { rows } = await pool.query(
      `SELECT p.*, l.name, l.email, l.gender, l.birth, l.calendar, l.hour, l.region, l.memo
       FROM pdfs p JOIN leads l ON l.id = p.lead_id
       WHERE p.id = $1 AND p.teacher_id = $2`,
      [req.params.id, req.user.id]
    );
    const pdf = rows[0];
    if (!pdf) return res.status(404).send('리포트를 찾을 수 없습니다.');

    /* 원문이 아직 없으면 지금 내용을 원문으로 한 번 백업해둔다.
       (예전에 만든 리포트도 이 시점부터 되돌리기가 된다) */
    if (pdf.sections_orig == null && pdf.sections != null) {
      await pool.query('UPDATE pdfs SET sections_orig = sections WHERE id = $1', [pdf.id]);
    }

    const client = {
      name: pdf.name,
      gender: pdf.gender,
      birthDate: normalizeBirth(pdf.birth),
      birthTime: parseHour(pdf.hour),
      calendar: pdf.calendar,
      region: pdf.region,
      question: pdf.memo,
    };
    const saju = sajuOf(pdf);
    const baseUrl = process.env.BASE_URL || '';

    /* --- 무료사주: 공개 링크 PDF 와 똑같이 --- */
    if (pdf.type === FREE) {
      const html = buildFreePdfHtml({
        teacher: req.user,
        client,
        saju,
        result: pdf.sections || {},
        baseUrl,
      });
      const bar =
        '<link rel="stylesheet" href="/css/preview-editor.css">' +
        '<div class="fv-bar no-print">' +
        '<a href="/leads/' + pdf.lead_id + '">← 돌아가기</a>' +
        '<span>' + esc(pdf.name) + '님 · 무료사주</span>' +
        '<span class="tip">여백 <b>없음</b> · 배경 그래픽 <b>체크</b></span>' +
        '<button type="button" onclick="window.print()">PDF로 저장</button>' +
        '</div>';
      return res
        .set('Content-Type', 'text/html; charset=utf-8')
        .send(html.replace('<body>', '<body>' + bar));
    }

    /* --- 유료 리포트 --- */
    let chapters = Array.isArray(pdf.sections) ? pdf.sections : [];

    /* 이미 제목이 날아간 리포트는 여기서 되살린다.
       (미리보기를 한 번 열기만 하면 DB까지 고쳐진다) */
    const lost = chapters.some((c) => !String((c && c.title) || '').trim());
    if (lost) {
      const fixed = keepTitles(chapters, null, pdf.sections_orig);
      const stillLost = fixed.some((c) => !String((c && c.title) || '').trim());

      if (!stillLost) {
        await pool.query('UPDATE pdfs SET sections = $1 WHERE id = $2', [
          JSON.stringify(fixed), pdf.id,
        ]);
        chapters = fixed;
        console.log(`[PDF] ${pdf.id}번 리포트의 빈 제목을 되살렸습니다.`);
      } else {
        chapters = fixed;   // 되살릴 수 있는 만큼만
      }
    }

    const cover = await resolveCover(req.user.id, pdf.type);
    const { ensureToken } = require('./share');
    const token = await ensureToken(pdf.id);
    const reviewUrl = (process.env.BASE_URL || '') + '/r/' + token + '#rvwWrap';
    const inner = buildReportHtml({
      type: pdf.type,
      client,
      teacher: req.user,
      saju,
      chapters,
      extra: pdf.extra || null,
      baseUrl,
      cover,
      reviewUrl,
    });

    const toolbar =
      '<link rel="stylesheet" href="/css/preview-editor.css">' +
      '<div class="pv-bar no-print">' +
        '<a class="pv-back" href="/leads/' + pdf.lead_id + '">← 돌아가기</a>' +
        '<span class="pv-title">' + esc(pdf.name) + '님 · ' + esc(pdf.type) +
          ' <em id="pvMode">' + chapters.length + '개 챕터</em></span>' +
        '<div class="pv-actions">' +
          '<button type="button" id="btnEdit">수정하기</button>' +
          '<button type="button" id="btnDone" style="display:none">수정 완료</button>' +
          '<a id="btnDl" class="dlbtn" href="/pdfs/' + pdf.id + '/report.pdf">PDF 다운받기</a>' +
          '<button type="button" id="btnSend" class="send">이메일 보내기</button>' +
        '</div>' +
        '<div class="pv-warn" id="pvWarn">' +
          '<b>앱 안의 브라우저</b>라서 PDF 저장이 막힐 수 있습니다. ' +
          '오른쪽 위 <b>⋮</b> → <b>다른 브라우저로 열기</b>를 눌러주세요.' +
        '</div>' +
      '</div>' +
      '<div class="edit-hint no-print">글을 눌러 바로 고칠 수 있습니다. ' +
        '페이지 오른쪽 위 <b>되돌리기</b>를 누르면 처음 만들어진 글로 돌아갑니다.</div>' +
      '<div class="toast" id="toast"></div>';

    const boot =
      '<script>' +
      'window.PDF_ID=' + Number(pdf.id) + ';' +
      'window.LEAD_ID=' + Number(pdf.lead_id) + ';' +
      'window.LEAD_EMAIL=' + JSON.stringify(pdf.email || '') + ';' +
      // 챕터 원제목 — 화면에서 제목을 못 찾을 때 쓴다 (제목 유실 방지)
      'window.CH_TITLES=' + JSON.stringify(chapters.map((c) => (c && c.title) || '')) + ';' +
      '</script>' +
      '<script src="/js/preview-editor.js" defer></script>';

    let html = inner.replace('<body>', '<body>' + toolbar);
    html = html.includes('</body>')
      ? html.replace('</body>', boot + '</body>')
      : html + boot;

    res.set('Content-Type', 'text/html; charset=utf-8').send(html);
  } catch (e) {
    next(e);
  }
});

/* ===== 리포트 내용 저장 =====
   leads.js 에도 같은 주소가 있지만, 이 라우터가 먼저 마운트돼서 여기가 이긴다.
   빈 제목이 들어오면 원래 제목을 지켜준다. */
router.post('/pdfs/:id/edit', async (req, res) => {
  try {
    await ensureOrigColumn();

    const chapters = req.body && req.body.chapters;
    if (!Array.isArray(chapters)) {
      return res.status(400).json({ ok: false, error: '형식이 올바르지 않습니다.' });
    }

    const { rows } = await pool.query(
      'SELECT sections, sections_orig FROM pdfs WHERE id = $1 AND teacher_id = $2',
      [req.params.id, req.user.id]
    );
    const pdf = rows[0];
    if (!pdf) return res.status(404).json({ ok: false, error: '리포트를 찾을 수 없습니다.' });

    const safe = keepTitles(chapters, pdf.sections, pdf.sections_orig);

    await pool.query(
      'UPDATE pdfs SET sections = $1 WHERE id = $2 AND teacher_id = $3',
      [JSON.stringify(safe), req.params.id, req.user.id]
    );

    res.json({ ok: true });
  } catch (e) {
    console.error('[PDF] 수정 실패:', e.message);
    res.status(500).json({ ok: false, error: e.message });
  }
});

/* ===== 되돌리기 =====
   { ch: 0 }      → 그 챕터만 처음 글로
   { ch: 'all' }  → 리포트 전체를 처음 글로
   chapters 를 같이 보내면 나머지 챕터의 수정분은 먼저 저장하고 되돌린다. */
router.post('/pdfs/:id/revert', async (req, res) => {
  try {
    await ensureOrigColumn();

    const { rows } = await pool.query(
      'SELECT sections, sections_orig FROM pdfs WHERE id = $1 AND teacher_id = $2',
      [req.params.id, req.user.id]
    );
    const pdf = rows[0];
    if (!pdf) return res.status(404).json({ ok: false, error: '리포트를 찾을 수 없습니다.' });

    const orig = Array.isArray(pdf.sections_orig) ? pdf.sections_orig : null;
    if (!orig) {
      return res.status(400).json({ ok: false, error: '처음 글이 보관돼 있지 않습니다.' });
    }

    const ch = req.body && req.body.ch;

    /* 전체 되돌리기 */
    if (ch === 'all') {
      await pool.query(
        'UPDATE pdfs SET sections = $1 WHERE id = $2 AND teacher_id = $3',
        [JSON.stringify(orig), req.params.id, req.user.id]
      );
      return res.json({ ok: true, scope: 'all' });
    }

    const idx = Number(ch);
    if (!Number.isInteger(idx) || idx < 0 || idx >= orig.length) {
      return res.status(400).json({ ok: false, error: '되돌릴 페이지를 찾을 수 없습니다.' });
    }

    /* 화면에 떠 있는 현재 내용을 바탕으로 하되, 해당 챕터만 원문으로 갈아끼운다 */
    const sent = req.body && req.body.chapters;
    const base = Array.isArray(sent) && sent.length
      ? sent
      : (Array.isArray(pdf.sections) ? pdf.sections : []);

    const next = base.slice();
    next[idx] = orig[idx];

    await pool.query(
      'UPDATE pdfs SET sections = $1 WHERE id = $2 AND teacher_id = $3',
      [JSON.stringify(next), req.params.id, req.user.id]
    );

    res.json({ ok: true, scope: idx });
  } catch (e) {
    console.error('[PDF] 되돌리기 실패:', e.message);
    res.status(500).json({ ok: false, error: e.message });
  }
});

/* ===== PDF 다운로드 (표지 적용) =====
   leads.js 에도 같은 주소가 있지만 이 라우터가 먼저 마운트돼서 여기가 이긴다. */
async function downloadWithCover(req, res) {
  try {
    const { htmlToPdf, sendPdf } = require('../services/pdfFile');

    const { rows } = await pool.query(
      `SELECT p.id, p.type, p.sections, p.extra,
              l.name, l.birth, l.hour, l.calendar, l.region, l.gender
       FROM pdfs p JOIN leads l ON l.id = p.lead_id
       WHERE p.id = $1 AND p.teacher_id = $2`,
      [req.params.id, req.user.id]
    );
    const pdf = rows[0];
    if (!pdf) return res.status(404).send('리포트를 찾을 수 없습니다.');

    const client = {
      name: pdf.name,
      birthDate: normalizeBirth(pdf.birth),
      birthTime: parseHour(pdf.hour),
      calendar: pdf.calendar,
      region: pdf.region,
      gender: pdf.gender,
    };
    const saju = sajuOf(pdf);
    const baseUrl = process.env.BASE_URL || '';

    let html;
    if (pdf.type === FREE) {
      html = buildFreePdfHtml({ teacher: req.user, client, saju, result: pdf.sections || {}, baseUrl });
    } else {
      const cover = await resolveCover(req.user.id, pdf.type);
      const { ensureToken } = require('./share');
      const token = await ensureToken(pdf.id);
      const reviewUrl = (process.env.BASE_URL || '') + '/r/' + token + '#rvwWrap';
      html = buildReportHtml({
        type: pdf.type, client, saju,
        chapters: Array.isArray(pdf.sections) ? pdf.sections : [],
        teacher: req.user, extra: pdf.extra || null, baseUrl, cover, reviewUrl,
      });
    }

    const buf = await htmlToPdf(html);
    sendPdf(res, buf, pdf.name, pdf.type);
  } catch (e) {
    console.error('[PDF] 표지 다운로드 실패:', e.message);
    res.status(500).send('PDF를 만들지 못했습니다. 잠시 후 다시 시도해주세요.');
  }
}

router.get('/pdfs/:id/report.pdf', downloadWithCover);
router.get('/pdfs/:id/download', downloadWithCover);

module.exports = router;
