/* ============================================================
 * 메일 발송 — Resend HTTP API 사용
 *
 * 왜 SMTP가 아니라 HTTP인가:
 *   Railway는 SMTP 아웃바운드(25/465/587)를 차단함 → 연결 timeout.
 *   Resend는 https(443)로 보내므로 차단되지 않음.
 *
 * 설정 (교육생별 / 관리자 폴백):
 *   users.mail_key   : Resend API 키 (re_...)
 *   users.mail_user  : 보내는 주소 (도메인 인증 전엔 onboarding@resend.dev 사용)
 *   users.mail_name  : 발신인 표시 이름
 *   .env RESEND_KEY / MAIL_FROM_EMAIL / MAIL_FROM_NAME : 관리자 폴백
 * ============================================================ */

const RESEND_URL = 'https://api.resend.com/emails';

// 도메인 인증 전에 누구나 쓸 수 있는 Resend 기본 발신 주소
const DEFAULT_FROM = 'onboarding@resend.dev';

function mailKey(teacher) {
  return (teacher && teacher.mail_key) || process.env.RESEND_KEY || null;
}

function mailReady(teacher) {
  return !!mailKey(teacher);
}

// 발신인: "이름 <주소>"
function fromAddr(teacher) {
  const name =
    (teacher && (teacher.mail_name || teacher.site_name || teacher.name)) ||
    process.env.MAIL_FROM_NAME ||
    '사주 풀이';
  const addr =
    (teacher && teacher.mail_user) ||
    process.env.MAIL_FROM_EMAIL ||
    DEFAULT_FROM;
  return `${name} <${addr}>`;
}

/**
 * 메일 발송 (Resend)
 * @param teacher 교육생 (mail_key / mail_user / mail_name)
 * @param opts { to, subject, html, replyTo }
 */
async function sendMail(teacher, opts) {
  const key = mailKey(teacher);
  if (!key) {
    throw new Error('메일 설정이 없습니다. [무료사주 · API 설정]에서 Resend API 키를 등록해주세요.');
  }

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 20000);

  let res, data;
  try {
    res = await fetch(RESEND_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromAddr(teacher),
        to: [opts.to],
        subject: opts.subject,
        html: opts.html,
        ...(opts.replyTo ? { reply_to: opts.replyTo } : {}),
      }),
      signal: ctrl.signal,
    });
    data = await res.json().catch(() => ({}));
  } catch (e) {
    clearTimeout(timer);
    if (e.name === 'AbortError') throw new Error('메일 서버 응답이 없습니다. 잠시 후 다시 시도해주세요.');
    throw new Error('메일 발송 중 네트워크 오류: ' + e.message);
  }
  clearTimeout(timer);

  if (!res.ok) {
    const msg = (data && (data.message || data.error)) || `발송 실패 (HTTP ${res.status})`;
    const err = new Error(msg);
    err.status = res.status;
    throw err;
  }
  return { id: data && data.id };
}

const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));

function buildFreeSajuHtml({ teacher, saju, result, input, upsell, baseUrl }) {
  const P = (t) => String(t || '').split(/\n{2,}|\n/).filter(Boolean)
    .map((x) => `<p style="margin:0 0 10px;line-height:1.8;font-size:14.5px;color:#3f3b33">${esc(x)}</p>`).join('');

  const sec = (num, title, body, outro) => `
    <tr><td style="padding:0 24px 22px">
      <h3 style="margin:0 0 8px;font-size:16px;color:#252522;border-left:3px solid #B59A62;padding-left:10px">
        <span style="color:#B59A62;font-size:12px;margin-right:6px">${num}</span>${esc(title)}</h3>
      ${P(body)}
      ${outro ? `<div style="margin-top:10px;padding:11px 14px;background:#fbf7ee;border-left:3px solid #B59A62;font-size:12.5px;color:#7a7365;line-height:1.7">${esc(outro)}</div>` : ''}
    </td></tr>`;

  const cols = ['hour', 'day', 'month', 'year'];
  const labels = { hour: '생시', day: '생일', month: '생월', year: '생년' };
  const EL_COLOR = { 목: '#2e8b57', 화: '#cf4038', 토: '#b8860b', 금: '#6b7684', 수: '#2f6bb0' };

  const cell = (x) => {
    if (!x) return `<td style="padding:8px 4px;text-align:center;border:1px solid #eee6d8;color:#c9c3b5">미상</td>`;
    const c = EL_COLOR[x.el] || '#252522';
    return `<td style="padding:8px 4px;text-align:center;border:1px solid #eee6d8;background:#fff">
      <div style="font-size:22px;font-weight:700;color:${c}">${esc(x.ko)}<span style="font-size:12px;opacity:.6">${esc(x.char)}</span></div>
      <div style="font-size:11px;color:${c};margin-top:2px">${x.yin ? '-' : '+'}${esc(x.el)}</div>
      <div style="font-size:11px;color:${c};opacity:.85;margin-top:2px">${esc(x.god || '')}</div></td>`;
  };

  const chart = saju ? `
    <tr><td style="padding:0 24px 20px">
      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #E9E0CF;border-radius:8px;overflow:hidden">
        <tr style="background:#fbf7ee">
          <th style="width:44px;padding:9px 4px;font-size:11px;color:#8a8574;border:1px solid #eee6d8"></th>
          ${cols.map((c) => `<th style="padding:9px 4px;font-size:12px;color:#8a8574;border:1px solid #eee6d8">${labels[c]}</th>`).join('')}
        </tr>
        <tr><th style="padding:8px 4px;font-size:11px;color:#8a8574;background:#fbf7ee;border:1px solid #eee6d8">천간</th>
          ${cols.map((c) => cell(saju.detail[c].stem)).join('')}</tr>
        <tr><th style="padding:8px 4px;font-size:11px;color:#8a8574;background:#fbf7ee;border:1px solid #eee6d8">지지</th>
          ${cols.map((c) => cell(saju.detail[c].branch)).join('')}</tr>
      </table>
      <p style="margin:10px 0 0;text-align:center;font-size:12px;color:#8a8574">
        오행 · 목 ${saju.elements.목} 화 ${saju.elements.화} 토 ${saju.elements.토} 금 ${saju.elements.금} 수 ${saju.elements.수}
        &nbsp;|&nbsp; 강한 기운 <b style="color:#182234">${esc(saju.strong.join(', '))}</b>
        &nbsp;|&nbsp; 부족한 기운 <b style="color:#182234">${esc(saju.weak.join(', '))}</b></p>
    </td></tr>` : '';

  const kw = (result.keywords || []).slice(0, 3)
    .map((k) => `<span style="display:inline-block;background:#fbf7ee;border:1px solid #B59A62;color:#182234;border-radius:99px;padding:5px 14px;font-size:13px;font-weight:600;margin:0 4px 6px 0">${esc(k)}</span>`).join('');

  const consultBtn = teacher.kakao_consult_link
    ? `<a href="${esc(teacher.kakao_consult_link)}" style="display:inline-block;padding:14px 26px;background:#FEE500;color:#191600;font-weight:700;font-size:15px;text-decoration:none;border-radius:8px">${esc(teacher.button_text || '카카오톡으로 상담받기')}</a>`
    : `<a href="${esc(baseUrl)}/s/${esc(teacher.slug)}#lp-form" style="display:inline-block;padding:14px 26px;background:#182234;color:#fff;font-weight:700;font-size:15px;text-decoration:none;border-radius:8px">상담 신청하기</a>`;

  return `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#F7F3EA">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F7F3EA;padding:24px 12px">
<tr><td align="center">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fffdf8;border:1px solid #E9E0CF;border-radius:14px;overflow:hidden;font-family:-apple-system,'Malgun Gothic',sans-serif">

  <tr><td style="padding:32px 24px 8px;text-align:center">
    <h1 style="margin:0 0 6px;font-size:22px;color:#252522">${esc(teacher.site_name || '무료 사주')}</h1>
    <div style="width:42px;height:2px;background:#B59A62;margin:0 auto 14px"></div>
    <p style="margin:0;font-size:14px;color:#6b6656"><b>${esc(input.name)}</b>님의 무료 사주 풀이입니다.</p>
    ${kw ? `<div style="margin-top:16px">${kw}</div>` : ''}
  </td></tr>

  ${chart}
  ${sec('01', '만세력 기본 정보', result.manse)}
  ${sec('02', '타고난 성향', result.personality)}
  ${sec('03', '올해 운세', result.year, result.yearOutro)}
  ${sec('04', '연애운', result.love, result.loveOutro)}
  ${sec('05', '재물운', result.wealth, result.wealthOutro)}
  ${sec('06', '건강운', result.health)}
  <tr><td style="padding:0 24px 8px"><p style="margin:0;font-size:11px;color:#b3ad9c">※ 명리학적 관점의 생활 경향 해석이며 의학적 진단이나 치료를 대신하지 않습니다.</p></td></tr>
  ${sec('07', '종합 조언', result.advice)}

  <tr><td style="padding:8px 24px 24px">
    <div style="background:#fbf7ee;border:1px solid #E9E0CF;border-radius:12px;padding:22px">
      <h3 style="margin:0 0 10px;font-size:16px;color:#182234;text-align:center">더 자세한 사주 풀이</h3>
      <p style="margin:0 0 14px;font-size:13px;color:#6b6656;text-align:center;line-height:1.7">${esc(upsell.intro).replace(/\n/g, '<br>')}</p>
      <ul style="margin:0 0 14px;padding:0 0 0 18px">
        ${upsell.items.map((i) => `<li style="font-size:13px;color:#3f3b33;line-height:1.9">${esc(i)}</li>`).join('')}
      </ul>
      <p style="margin:0;padding-top:12px;border-top:1px solid #E9E0CF;font-size:13px;color:#5a5648;text-align:center;line-height:1.7">${esc(upsell.closing).replace(/\n/g, '<br>')}</p>
    </div>
  </td></tr>

  <tr><td style="padding:0 24px 30px;text-align:center">
    <p style="margin:0 0 14px;font-size:13.5px;color:#5a5648;line-height:1.7">${esc(teacher.consult_message || '내 사주를 더 자세히 알고 싶다면 전문 상담을 받아보세요.')}</p>
    ${consultBtn}
  </td></tr>

  <tr><td style="padding:16px;background:#fbf7ee;text-align:center;border-top:1px solid #E9E0CF">
    <p style="margin:0;font-size:11px;color:#b3ad9c">본 사주 풀이는 참고용 콘텐츠입니다.</p>
  </td></tr>
</table></td></tr></table></body></html>`;
}

async function sendFreeSaju({ to, teacher, saju, result, input, upsell, baseUrl }) {
  const html = buildFreeSajuHtml({ teacher, saju, result, input, upsell, baseUrl });
  return sendMail(teacher, {
    to,
    subject: `${input.name}님의 무료 사주 풀이가 도착했습니다.`,
    html,
  });
}

module.exports = { sendFreeSaju, buildFreeSajuHtml, mailReady, sendMail, fromAddr, DEFAULT_FROM };


/* ============================================================
 * 유료 PDF 리포트 이메일 발송
 * ============================================================ */
function buildPdfHtml({ teacher, type, sections, saju, input, baseUrl }) {
  const P = (t) => String(t || '').split(/\n{2,}|\n/).filter(Boolean)
    .map((x) => `<p style="margin:0 0 11px;line-height:1.85;font-size:14.5px;color:#3f3b33">${esc(x)}</p>`).join('');

  const EL_COLOR = { 목: '#2e8b57', 화: '#cf4038', 토: '#b8860b', 금: '#6b7684', 수: '#2f6bb0' };
  const cols = ['hour', 'day', 'month', 'year'];
  const labels = { hour: '생시', day: '생일', month: '생월', year: '생년' };
  const cell = (x) => {
    if (!x) return `<td style="padding:8px 4px;text-align:center;border:1px solid #eee6d8;color:#c9c3b5">미상</td>`;
    const c = EL_COLOR[x.el] || '#252522';
    return `<td style="padding:8px 4px;text-align:center;border:1px solid #eee6d8;background:#fff">
      <div style="font-size:22px;font-weight:700;color:${c}">${esc(x.ko)}<span style="font-size:12px;opacity:.6">${esc(x.char)}</span></div>
      <div style="font-size:11px;color:${c};margin-top:2px">${x.yin ? '-' : '+'}${esc(x.el)}</div>
      <div style="font-size:11px;color:${c};opacity:.85;margin-top:2px">${esc(x.god || '')}</div></td>`;
  };

  const chart = saju ? `
    <tr><td style="padding:0 24px 22px">
      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #E9E0CF;border-radius:8px;overflow:hidden">
        <tr style="background:#fbf7ee">
          <th style="width:44px;padding:9px 4px;border:1px solid #eee6d8"></th>
          ${cols.map((c) => `<th style="padding:9px 4px;font-size:12px;color:#8a8574;border:1px solid #eee6d8">${labels[c]}</th>`).join('')}
        </tr>
        <tr><th style="padding:8px 4px;font-size:11px;color:#8a8574;background:#fbf7ee;border:1px solid #eee6d8">천간</th>
          ${cols.map((c) => cell(saju.detail[c].stem)).join('')}</tr>
        <tr><th style="padding:8px 4px;font-size:11px;color:#8a8574;background:#fbf7ee;border:1px solid #eee6d8">지지</th>
          ${cols.map((c) => cell(saju.detail[c].branch)).join('')}</tr>
      </table>
      <p style="margin:10px 0 0;text-align:center;font-size:12px;color:#8a8574">
        오행 · 목 ${saju.elements.목} 화 ${saju.elements.화} 토 ${saju.elements.토} 금 ${saju.elements.금} 수 ${saju.elements.수}
        &nbsp;|&nbsp; 강한 기운 <b style="color:#182234">${esc(saju.strong.join(', '))}</b>
        &nbsp;|&nbsp; 부족한 기운 <b style="color:#182234">${esc(saju.weak.join(', '))}</b></p>
    </td></tr>` : '';

  const body = (sections || []).map((s, i) => `
    <tr><td style="padding:0 24px 26px">
      <h3 style="margin:0 0 10px;font-size:17px;color:#252522;border-left:3px solid #B59A62;padding-left:11px">
        <span style="color:#B59A62;font-size:12px;margin-right:6px">${String(i + 1).padStart(2, '0')}</span>${esc(s.title)}</h3>
      ${P(s.body)}
    </td></tr>`).join('');

  const consultBtn = teacher.kakao_consult_link
    ? `<a href="${esc(teacher.kakao_consult_link)}" style="display:inline-block;padding:14px 26px;background:#FEE500;color:#191600;font-weight:700;font-size:15px;text-decoration:none;border-radius:8px">${esc(teacher.button_text || '카카오톡으로 문의하기')}</a>`
    : `<a href="${esc(baseUrl)}/s/${esc(teacher.slug)}" style="display:inline-block;padding:14px 26px;background:#182234;color:#fff;font-weight:700;font-size:15px;text-decoration:none;border-radius:8px">문의하기</a>`;

  return `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#F7F3EA">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F7F3EA;padding:24px 12px"><tr><td align="center">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;background:#fffdf8;border:1px solid #E9E0CF;border-radius:14px;overflow:hidden;font-family:-apple-system,'Malgun Gothic',sans-serif">
  <tr><td style="padding:34px 24px 10px;text-align:center">
    <p style="margin:0 0 6px;font-size:12px;letter-spacing:.14em;color:#B59A62;font-weight:700">${esc(type)}</p>
    <h1 style="margin:0 0 6px;font-size:23px;color:#252522">${esc(input.name)}님의 사주 리포트</h1>
    <div style="width:42px;height:2px;background:#B59A62;margin:12px auto 0"></div>
  </td></tr>
  ${chart}
  ${body}
  <tr><td style="padding:8px 24px 30px;text-align:center;border-top:1px solid #E9E0CF">
    <p style="margin:16px 0 14px;font-size:13.5px;color:#5a5648;line-height:1.7">${esc(teacher.consult_message || '더 궁금한 점이 있으시면 편하게 문의해주세요.')}</p>
    ${consultBtn}
  </td></tr>
  <tr><td style="padding:16px;background:#fbf7ee;text-align:center;border-top:1px solid #E9E0CF">
    <p style="margin:0;font-size:11px;color:#b3ad9c">본 사주 풀이는 참고용 콘텐츠이며, 의학적·법률적 조언을 대신하지 않습니다.</p>
  </td></tr>
</table></td></tr></table></body></html>`;
}

async function sendPdfReport({ to, teacher, type, sections, saju, input, baseUrl }) {
  const html = buildPdfHtml({ teacher, type, sections, saju, input, baseUrl });
  return sendMail(teacher, {
    to,
    subject: `${input.name}님의 ${type} 사주 리포트가 도착했습니다.`,
    html,
  });
}

module.exports.sendPdfReport = sendPdfReport;
module.exports.buildPdfHtml = buildPdfHtml;
