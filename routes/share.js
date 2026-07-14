/**
 * share.js — 내담자 공개 열람 링크
 *
 *   GET /r/:token
 *
 * 로그인 없이 리포트를 열어보고, 브라우저 인쇄로 PDF 저장까지 할 수 있다.
 * 토큰은 pdfs.share_token 에 저장된 32자 랜덤값 — 추측 불가능.
 */
const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const { pool } = require('../db');
const { calcSaju } = require('../services/manseryeok');
const { normalizeBirth, parseHour } = require('../services/birth');
const { buildReportHtml } = require('../services/pdfDoc');
const { buildFreePdfHtml } = require('../services/freePdf');

const FREE = '무료사주';

/** 링크가 없으면 만들어준다 (메일 보낼 때 호출) */
async function ensureToken(pdfId) {
  const { rows } = await pool.query('SELECT share_token FROM pdfs WHERE id = $1', [pdfId]);
  if (rows[0] && rows[0].share_token) return rows[0].share_token;

  const token = crypto.randomBytes(16).toString('hex');
  await pool.query('UPDATE pdfs SET share_token = $1 WHERE id = $2', [token, pdfId]);
  return token;
}

router.get('/r/:token', async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT p.id, p.type, p.sections, p.extra,
              l.name, l.birth, l.hour, l.calendar, l.region, l.gender,
              u.site_name, u.name AS teacher_name, u.kakao_consult_link, u.button_text,
              u.pdf_cta_text, u.pdf_cta_desc, u.free_promo
       FROM pdfs p
       JOIN leads l ON l.id = p.lead_id
       JOIN users u ON u.id = p.teacher_id
       WHERE p.share_token = $1`,
      [req.params.token]
    );
    const pdf = rows[0];
    if (!pdf) return res.status(404).send('링크가 만료되었거나 잘못된 주소입니다.');

    const client = {
      name: pdf.name,
      birthDate: normalizeBirth(pdf.birth),
      birthTime: parseHour(pdf.hour),
      calendar: pdf.calendar,
      region: pdf.region,
      gender: pdf.gender,
    };

    let saju = null;
    try {
      saju = calcSaju({
        birthDate: client.birthDate,
        birthTime: client.birthTime,
        calendar: pdf.calendar === '윤달' ? '음력' : (pdf.calendar || '양력'),
        isLeapMonth: pdf.calendar === '윤달',
        region: pdf.region || '서울특별시',
        gender: pdf.gender,
      });
    } catch (e) { /* 만세력 실패해도 본문은 보여준다 */ }

    const teacher = {
      site_name: pdf.site_name,
      name: pdf.teacher_name,
      kakao_consult_link: pdf.kakao_consult_link,
      button_text: pdf.button_text,
      pdf_cta_text: pdf.pdf_cta_text,
      pdf_cta_desc: pdf.pdf_cta_desc,
      free_promo: pdf.free_promo,
    };
    const baseUrl = process.env.BASE_URL || '';

    const html = pdf.type === FREE
      ? buildFreePdfHtml({ teacher, client, saju, result: pdf.sections || {}, baseUrl })
      : buildReportHtml({
          type: pdf.type, client, saju,
          chapters: Array.isArray(pdf.sections) ? pdf.sections : [],
          teacher, extra: pdf.extra || null, baseUrl,
        });

    // 상단 저장 바 (인쇄 시에는 안 보임)
    const bar = `
<div class="no-print" style="position:fixed;top:0;left:0;right:0;z-index:999;
     display:flex;gap:10px;align-items:center;justify-content:center;flex-wrap:wrap;
     padding:11px 14px;background:#232220;color:#fff;
     font-family:Pretendard,-apple-system,'Malgun Gothic',sans-serif;font-size:13px">
  <span>${escapeHtml(pdf.name)}님의 사주 리포트</span>
  <button onclick="window.print()" style="padding:8px 18px;border:0;border-radius:6px;
    background:#c8a45c;color:#241a06;font-weight:800;font-size:13.5px;cursor:pointer">
    PDF로 저장
  </button>
</div>
<div class="no-print" style="height:46px"></div>
<div class="no-print" style="max-width:480px;margin:0 auto 10px;padding:0 16px;
     font-size:12px;color:#8a8577;text-align:center;line-height:1.6;
     font-family:Pretendard,-apple-system,'Malgun Gothic',sans-serif">
  휴대폰에서는 <b>PDF로 저장</b> → 대상을 <b>PDF로 저장</b>으로 선택하세요.<br>
  여백 <b>없음</b>, 배경 그래픽 <b>켜기</b>로 두면 테두리까지 그대로 나옵니다.
</div>`;

    res
      .set('Content-Type', 'text/html; charset=utf-8')
      .set('X-Robots-Tag', 'noindex, nofollow')   // 검색엔진에 안 잡히게
      .send(html.replace('<body>', '<body>' + bar));
  } catch (e) {
    next(e);
  }
});

function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, (m) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]
  ));
}

module.exports = { router, ensureToken };

