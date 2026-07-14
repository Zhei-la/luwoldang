/* ============================================================
 * 메일 발송 — Resend HTTP API (도메인 인증 방식)
 *
 * 왜 Resend인가:
 *   Railway가 SMTP 포트(25/465/587)를 차단하므로 Gmail 직접 발송 불가.
 *   Resend는 HTTPS(443)로 보내므로 차단 영향 없음.
 *
 * 발신 구조 (도메인 하나로 교육생 전원 커버):
 *   운명삼문 <unmyeongsammun@luwolsaju.com>   ← 교육생 A
 *   별빛당   <byeolbitdang@luwolsaju.com>     ← 교육생 B
 *   → 도메인은 공통(.env MAIL_DOMAIN), @앞과 표시이름은 교육생별
 *   → 내담자가 "답장"하면 교육생 개인 메일(reply_to)로 감
 *
 * 설정:
 *   .env  RESEND_KEY   : Resend API 키 (관리자 발급, 공통)
 *   .env  MAIL_DOMAIN  : 인증한 도메인 (예: luwolsaju.com)
 *   users.mail_local   : 메일 아이디 (@앞). 없으면 'noreply'
 *   users.mail_name    : 발신인 표시 이름
 *   users.mail_reply   : 답장 받을 주소 (교육생 개인 메일)
 * ============================================================ */

const RESEND_URL = 'https://api.resend.com/emails';

function apiKey(teacher) {
  return (teacher && teacher.mail_key) || process.env.RESEND_KEY || null;
}

function mailDomain() {
  return process.env.MAIL_DOMAIN || null;
}

// 메일 아이디(@앞) — 영문/숫자/.-_ 만 허용
function mailLocal(teacher) {
  const raw = (teacher && teacher.mail_local) || '';
  const clean = String(raw).toLowerCase().replace(/[^a-z0-9._-]/g, '');
  return clean || 'noreply';
}

function fromName(teacher) {
  return (teacher && (teacher.mail_name || teacher.site_name || teacher.name)) || '사주 풀이';
}

function fromEmail(teacher) {
  const d = mailDomain();
  if (!d) return null;
  return `${mailLocal(teacher)}@${d}`;
}

function fromAddr(teacher) {
  const e = fromEmail(teacher);
  return e ? `${fromName(teacher)} <${e}>` : '(도메인 미설정)';
}

// 답장 받을 주소 (교육생 개인 메일)
function replyTo(teacher) {
  const r = (teacher && (teacher.mail_reply || teacher.account_email)) || null;
  return r && /\S+@\S+\.\S+/.test(r) ? r : null;
}

function mailReady(teacher) {
  return !!(apiKey(teacher) && mailDomain());
}

/**
 * 메일 발송
 * @param teacher 교육생
 * @param opts { to, subject, html }
 */
async function sendMail(teacher, opts) {
  const key = apiKey(teacher);
  const domain = mailDomain();

  if (!key) throw new Error('메일 API 키가 설정되지 않았습니다. 관리자에게 문의해주세요.');
  if (!domain) throw new Error('메일 도메인이 설정되지 않았습니다. 관리자에게 문의해주세요.');

  const body = {
    from: fromAddr(teacher),
    to: [opts.to],
    subject: opts.subject,
    html: opts.html,
  };
  const rt = replyTo(teacher);
  if (rt) body.reply_to = rt;

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 20000);

  let res, data;
  try {
    res = await fetch(RESEND_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
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
    let msg = (data && (data.message || data.error)) || `발송 실패 (HTTP ${res.status})`;
    if (res.status === 401) msg = 'API 키가 올바르지 않습니다.';
    if (/domain is not verified|not verified/i.test(String(msg))) {
      msg = `도메인(${domain})이 아직 인증되지 않았습니다. Resend에서 인증 완료 후 다시 시도해주세요.`;
    }
    throw new Error(msg);
  }

  return { id: data && data.id, from: fromAddr(teacher) };
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

module.exports = { sendFreeSaju, buildFreeSajuHtml, mailReady, sendMail, fromAddr, fromEmail, mailDomain, mailLocal, replyTo };


/* ============================================================
 * 유료 PDF 리포트 이메일 발송
 * ============================================================ */
/* 사주 원국 표 — 여러 메일 템플릿이 같이 쓴다 */
function sajuTable(input, saju) {
  if (!saju || !saju.pillars) return '';
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
  const smallCell = (t) => `<td style="padding:6px 4px;text-align:center;border:1px solid #eee6d8;background:#fff;font-size:11.5px;color:#5a5648">${esc(t || '—')}</td>`;
  const jjCell = (list) => {
    if (!list || !list.length) return smallCell('—');
    const inner = list.map((g) => `<span style="color:${EL_COLOR[g.el] || '#5a5648'};font-weight:600">${esc(g.ko)}</span>`).join('');
    return `<td style="padding:6px 4px;text-align:center;border:1px solid #eee6d8;background:#fff;font-size:12px">${inner}</td>`;
  };

  const dw = saju && saju.daewoon && saju.daewoon.list.length ? `
    <tr><td style="padding:0 24px 22px">
      <p style="margin:0 0 8px;font-size:13px;color:#182234;font-weight:700">대운 <span style="font-size:11px;color:#B59A62;font-weight:400">(${saju.daewoon.forward ? '순행' : '역행'})</span></p>
      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #E9E0CF;border-radius:8px;overflow:hidden">
        <tr style="background:#fbf7ee">
          ${saju.daewoon.list.slice(0, 8).map((x) => `<th style="padding:6px 3px;font-size:10.5px;color:#8a8574;border:1px solid #eee6d8;font-weight:500">${x.age}세</th>`).join('')}
        </tr>
        <tr>
          ${saju.daewoon.list.slice(0, 8).map((x) => `<td style="padding:8px 3px;text-align:center;border:1px solid #eee6d8;background:#fff">
            <div style="font-size:14px;font-weight:700;color:#182234">${esc(x.ko)}</div>
            <div style="font-size:10px;color:#b3ad9c">${esc(x.ganzi)}</div></td>`).join('')}
        </tr>
      </table>
    </td></tr>` : '';

  const chart = saju ? `
    <tr><td style="padding:0 24px 22px">
      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #E9E0CF;border-radius:8px;overflow:hidden">
        <tr style="background:#fbf7ee">
          <th style="width:52px;padding:9px 4px;border:1px solid #eee6d8"></th>
          ${cols.map((c) => `<th style="padding:9px 4px;font-size:12px;color:#8a8574;border:1px solid #eee6d8">${labels[c]}</th>`).join('')}
        </tr>
        <tr><th style="padding:8px 4px;font-size:11px;color:#8a8574;background:#fbf7ee;border:1px solid #eee6d8">천간</th>
          ${cols.map((c) => cell(saju.detail[c].stem)).join('')}</tr>
        <tr><th style="padding:8px 4px;font-size:11px;color:#8a8574;background:#fbf7ee;border:1px solid #eee6d8">지지</th>
          ${cols.map((c) => cell(saju.detail[c].branch)).join('')}</tr>
        <tr><th style="padding:6px 4px;font-size:10.5px;color:#b3ad9c;background:#fbf7ee;border:1px solid #eee6d8">지장간</th>
          ${cols.map((c) => jjCell(saju.detail[c].jijanggan)).join('')}</tr>
        <tr><th style="padding:6px 4px;font-size:10.5px;color:#b3ad9c;background:#fbf7ee;border:1px solid #eee6d8">12운성</th>
          ${cols.map((c) => smallCell(saju.detail[c].unseong)).join('')}</tr>
      </table>
      <p style="margin:10px 0 0;text-align:center;font-size:12px;color:#8a8574">
        오행 · 목 ${saju.elements.목} 화 ${saju.elements.화} 토 ${saju.elements.토} 금 ${saju.elements.금} 수 ${saju.elements.수}
        &nbsp;|&nbsp; 강한 기운 <b style="color:#182234">${esc(saju.strong.join(', '))}</b>
        &nbsp;|&nbsp; 부족한 기운 <b style="color:#182234">${esc(saju.weak.join(', '))}</b></p>
    </td></tr>
    ${dw}` : '';


  return chart;
}
function buildPdfHtml({ teacher, type, sections, saju, input, baseUrl, shareUrl }) {
  const P = (t) => String(t || '').split(/\n{2,}|\n/).filter(Boolean)
    .map((x) => `<p style="margin:0 0 11px;line-height:1.85;font-size:14.5px;color:#3f3b33">${esc(x)}</p>`).join('');

  const EL_COLOR = { 목: '#2e8b57', 화: '#cf4038', 토: '#b8860b', 금: '#6b7684', 수: '#2f6bb0' };
  const cols = ['hour', 'day', 'month', 'year'];
  const chart = sajuTable(input, saju);
  /* ── 오행 분포 막대 (메일 클라이언트는 SVG를 자주 지우므로 표+배경색으로 그린다) ── */
  const EL_LABEL = { 목: '목 (木)', 화: '화 (火)', 토: '토 (土)', 금: '금 (金)', 수: '수 (水)' };
  const elBars = (saju && saju.elements) ? (() => {
    const e = saju.elements;
    const total = Object.values(e).reduce((a, b) => a + b, 0) || 1;
    const rows = Object.keys(EL_LABEL).map((k) => {
      const n = e[k] || 0;
      const pct = Math.round((n / total) * 100);
      const c = EL_COLOR[k];
      return `
      <tr>
        <td style="padding:5px 8px 5px 0;font-size:12.5px;color:${c};font-weight:700;white-space:nowrap;width:62px">${EL_LABEL[k]}</td>
        <td style="padding:5px 0">
          <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">
            <tr>
              <td width="${Math.max(pct, 1)}%" style="height:14px;background:${c};border-radius:7px 0 0 7px;font-size:0;line-height:0">&nbsp;</td>
              <td style="height:14px;background:#EFE9DC;border-radius:0 7px 7px 0;font-size:0;line-height:0">&nbsp;</td>
            </tr>
          </table>
        </td>
        <td style="padding:5px 0 5px 9px;font-size:12px;color:#8a8574;width:56px;text-align:right;white-space:nowrap">${n}개 · ${pct}%</td>
      </tr>`;
    }).join('');

    const zero = Object.keys(EL_LABEL).filter((k) => !e[k]);
    const note = zero.length
      ? `<p style="margin:10px 0 0;font-size:12px;color:#8a8574;line-height:1.6">
           ${zero.map((k) => `<b style="color:${EL_COLOR[k]}">${k}</b>`).join(' · ')} 기운이 원국에 없습니다.
           비어 있는 기운은 리포트에서 자세히 다룹니다.</p>`
      : '';

    return `
    <tr><td style="padding:0 24px 22px">
      <p style="margin:0 0 10px;font-size:13px;color:#182234;font-weight:700">오행 분포</p>
      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #E9E0CF;border-radius:8px;background:#fff;padding:6px">
        <tr><td style="padding:10px 12px">
          <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">${rows}</table>
          ${note}
        </td></tr>
      </table>
    </td></tr>`;
  })() : '';

  /* ── 요약: 첫 챕터의 앞부분만 (전문은 링크에서) ── */
  const firstBody = (() => {
    const ch = (sections || [])[0];
    if (!ch) return '';
    if (Array.isArray(ch.blocks)) {
      return (ch.blocks[0] && ch.blocks[0].body) || '';
    }
    return ch.body || '';
  })();
  const lead2 = String(firstBody).split(/\n{2,}|\n/).filter(Boolean).slice(0, 2).join('\n\n');

  const summary = lead2 ? `
    <tr><td style="padding:0 24px 24px">
      <p style="margin:0 0 10px;font-size:13px;color:#182234;font-weight:700">리포트 미리보기</p>
      <div style="border:1px solid #E9E0CF;border-radius:8px;background:#fff;padding:16px 16px 8px">
        ${P(lead2)}
        <p style="margin:6px 0 0;font-size:12.5px;color:#8a8574">
          이어지는 내용은 아래 버튼에서 전부 확인하실 수 있습니다.
        </p>
      </div>
    </td></tr>` : '';

  /* ── 리포트 전체 보기 (로그인 없이 열리는 링크 · PDF 저장 가능) ── */
  const reportBtn = shareUrl ? `
    <tr><td style="padding:0 24px 26px" align="center">
      <a href="${esc(shareUrl)}/report.pdf" style="display:block;padding:17px;background:#B59A62;color:#fff;
         font-weight:800;font-size:16px;text-decoration:none;border-radius:10px;text-align:center">
        PDF 다운받기
      </a>
      <a href="${esc(shareUrl)}" style="display:block;margin-top:9px;padding:14px;background:#182234;color:#fff;
         font-weight:700;font-size:14px;text-decoration:none;border-radius:10px;text-align:center">
        웹에서 바로 읽기
      </a>
    </td></tr>` : '';

  const body = elBars + summary + reportBtn;

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
  </td></tr>
</table></td></tr></table></body></html>`;
}

async function sendPdfReport({ to, teacher, type, sections, saju, input, baseUrl, shareUrl }) {
  const html = buildPdfHtml({ teacher, type, sections, saju, input, baseUrl, shareUrl });
  return sendMail(teacher, {
    to,
    subject: `${input.name}님의 ${type} 사주 리포트가 도착했습니다.`,
    html,
  });
}

module.exports.sendPdfReport = sendPdfReport;
module.exports.buildPdfHtml = buildPdfHtml;


/* ============================================================
 * 묶어서 보내기 — 리포트 여러 개를 메일 한 통에
 * ============================================================ */

/**
 * @param {object} o { teacher, saju, input, items:[{type, shareUrl}], baseUrl }
 */
function buildBundleHtml({ teacher, saju, input, items, baseUrl }) {
  const P = (t) => String(t || '').split(/\n{2,}|\n/).filter(Boolean)
    .map((x) => `<p style="margin:0 0 11px;font-size:14.5px;line-height:1.85;color:#3d3a33">${esc(x)}</p>`).join('');

  const brand = esc(teacher.site_name || teacher.name || '사주 풀이');

  const cards = items.map((it) => `
    <tr><td style="padding:0 24px 12px">
      <table width="100%" cellpadding="0" cellspacing="0"
        style="border-collapse:separate;border:1px solid #E9E0CF;border-radius:10px;background:#fff">
        <tr>
          <td style="padding:16px 18px">
            <div style="font-size:16px;font-weight:800;color:#182234;margin-bottom:3px">${esc(it.type)}</div>
            <div style="font-size:12px;color:#8a8574">PDF 파일로 받거나 웹에서 바로 읽을 수 있습니다.</div>
          </td>
        </tr>
        <tr>
          <td style="padding:0 18px 16px">
            <a href="${esc(it.shareUrl)}/report.pdf"
               style="display:inline-block;padding:11px 18px;background:#B59A62;color:#fff;
                      font-weight:800;font-size:13.5px;text-decoration:none;border-radius:8px;margin-right:6px">
              PDF 다운받기
            </a>
            <a href="${esc(it.shareUrl)}"
               style="display:inline-block;padding:11px 18px;background:#182234;color:#fff;
                      font-weight:700;font-size:13.5px;text-decoration:none;border-radius:8px">
              웹에서 읽기
            </a>
          </td>
        </tr>
      </table>
    </td></tr>`).join('');

  const consultBtn = teacher.kakao_consult_link
    ? `<a href="${esc(teacher.kakao_consult_link)}" style="display:inline-block;padding:14px 26px;background:#FEE500;color:#191600;font-weight:700;font-size:15px;text-decoration:none;border-radius:8px">${esc(teacher.button_text || '카카오톡으로 문의하기')}</a>`
    : '';

  return `<!DOCTYPE html>
<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F3EEE3;font-family:'Apple SD Gothic Neo','Malgun Gothic',sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F3EEE3;padding:26px 0">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#FBF8F1;border-radius:14px;overflow:hidden">

  <tr><td style="padding:30px 24px 8px;text-align:center">
    <div style="font-size:12px;letter-spacing:.2em;color:#B59A62;margin-bottom:9px">${brand}</div>
    <h1 style="margin:0 0 6px;font-size:22px;color:#252522">${esc(input.name)}님의 사주 리포트</h1>
    <p style="margin:0;font-size:13.5px;color:#8a8574">
      리포트 ${items.length}편이 준비되었습니다.
    </p>
  </td></tr>

  ${sajuTable(input, saju)}

  <tr><td style="padding:6px 24px 12px">
    <p style="margin:0;font-size:13px;color:#182234;font-weight:700">받으신 리포트</p>
  </td></tr>
  ${cards}

  ${consultBtn ? `
  <tr><td style="padding:14px 24px 30px;text-align:center;border-top:1px solid #EFE7D8">
    <p style="margin:0 0 12px;font-size:13.5px;color:#6b6656">더 궁금한 점이 있으시면 편하게 문의해주세요.</p>
    ${consultBtn}
  </td></tr>` : '<tr><td style="height:24px"></td></tr>'}

</table>
</td></tr></table>
</body></html>`;
}

async function sendBundle({ to, teacher, saju, input, items, baseUrl }) {
  const html = buildBundleHtml({ teacher, saju, input, items, baseUrl });
  const names = items.map((x) => x.type).join(' · ');
  return sendMail(teacher, {
    to,
    subject: `${input.name}님의 사주 리포트가 도착했습니다. (${names})`,
    html,
  });
}

module.exports.sendBundle = sendBundle;
module.exports.buildBundleHtml = buildBundleHtml;
