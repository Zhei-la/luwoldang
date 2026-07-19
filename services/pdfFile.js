/**
 * pdfFile.js — 리포트 HTML → 진짜 PDF 파일
 *
 * 브라우저 인쇄에 의존하면 카톡·메일 앱 안에서는 저장이 안 된다.
 * 서버에서 헤드리스 크롬으로 직접 PDF를 만들어 파일로 내려준다.
 *
 * Railway 에서는 nixpacks.toml 이 chromium 을 깔아준다.
 * (PUPPETEER_EXECUTABLE_PATH 로 경로를 잡는다)
 */
const fs = require('fs');
const { execSync } = require('child_process');

let browserPromise = null;

/** 크롬 실행 파일 찾기 */
function findChrome() {
  const tried = [];

  const ok = (p) => {
    tried.push(p);
    try { return p && fs.existsSync(p) ? p : null; } catch (e) { return null; }
  };

  // 1) 환경변수
  let p = process.env.PUPPETEER_EXECUTABLE_PATH && ok(process.env.PUPPETEER_EXECUTABLE_PATH);
  if (p) return p;

  // 2) 흔한 경로
  for (const c of [
    '/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable', '/root/.nix-profile/bin/chromium',
    '/nix/var/nix/profiles/default/bin/chromium',
  ]) {
    if (ok(c)) return c;
  }

  // 3) PATH 에서 찾기
  for (const cmd of ['chromium', 'chromium-browser', 'google-chrome']) {
    try {
      const found = execSync(`command -v ${cmd} 2>/dev/null`).toString().trim();
      if (found && ok(found)) return found;
    } catch (e) { /* noop */ }
  }

  // 4) nix 는 경로가 매번 바뀐다. /nix/store 를 직접 뒤진다.
  try {
    const dirs = fs.readdirSync('/nix/store')
      .filter((d) => d.includes('chromium') && !d.endsWith('.drv'));
    for (const d of dirs) {
      const cand = `/nix/store/${d}/bin/chromium`;
      if (ok(cand)) return cand;
    }
  } catch (e) { /* /nix/store 가 없는 환경 */ }

  console.error('[PDF] 크롬 탐색 실패. 확인한 경로:', tried.join(' | '));
  console.error('[PDF] PATH =', process.env.PATH);
  throw new Error(
    '크롬을 찾을 수 없습니다. 레포 루트에 nixpacks.toml 이 있고 nixPkgs 에 "chromium" 이 들어 있는지 확인하세요.'
  );
}

async function getBrowser() {
  if (browserPromise) return browserPromise;

  browserPromise = (async () => {
    const puppeteer = require('puppeteer-core');   // core = 크롬을 내려받지 않는다 (빌드 안전)
    const exe = findChrome();

    return puppeteer.launch({
      headless: 'new',
      executablePath: exe,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',   // Railway 컨테이너는 /dev/shm 이 작다
        '--disable-gpu',
        '--font-render-hinting=none',
      ],
    });
  })().catch((e) => {
    browserPromise = null;
    throw e;
  });

  return browserPromise;
}

/**
 * HTML → PDF 버퍼
 * @param {string} html  buildReportHtml / buildFreePdfHtml 결과
 */
async function htmlToPdf(html) {
  const browser = await getBrowser();
  const page = await browser.newPage();

  try {
    await page.setViewport({ width: 900, height: 1200 });
    await page.setContent(html, { waitUntil: 'networkidle0', timeout: 60000 });

    // 웹폰트 로딩 + 리플로우(페이지 재배치)가 끝날 때까지 기다린다
    await page.evaluate(() => document.fonts && document.fonts.ready);
    await page
      .waitForFunction('window.__REFLOW_DONE__ === true', { timeout: 15000 })
      .catch(() => { /* 리플로우가 없는 문서도 있으니 그냥 진행 */ });
    await new Promise((r) => setTimeout(r, 300));

    const out = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      preferCSSPageSize: true,
    });

    // ⚠️ puppeteer 23 부터 page.pdf() 는 Buffer 가 아니라 Uint8Array 를 준다.
    //    Uint8Array 에 .toString() 을 쓰면 "37,80,68,70" 같은 숫자 나열이 나온다.
    //    반드시 Buffer 로 감싼 다음에 검사해야 한다.
    const buf = Buffer.from(out);

    if (buf.length < 1000 || buf.subarray(0, 4).toString('latin1') !== '%PDF') {
      throw new Error(`PDF 생성 결과가 올바르지 않습니다. (${buf.length} bytes)`);
    }
    return buf;
  } finally {
    await page.close().catch(() => {});
  }
}

/** 파일명 (한글 그대로 쓰면 헤더에서 깨진다) */
function pdfFilename(name, type) {
  const safe = `${name || '사주'}_${type || '리포트'}.pdf`;
  return {
    ascii: 'saju-report.pdf',
    utf8: encodeURIComponent(safe),
    korean: safe,
  };
}

/**
 * PDF 파일로 내려보낸다.
 * ⚠️ 카톡·삼성인터넷 같은 인앱 브라우저는 Content-Disposition 을 무시하고
 *    URL 끝을 보고 파일명을 정한다. 그래서 라우트 주소가 .pdf 로 끝나야 한다.
 *
 * @param {boolean} inline  true 면 브라우저에서 바로 열어 보여준다 (다운로드 X)
 *                          내담자가 메일에서 누를 때는 이쪽이 자연스럽다.
 */
function sendPdf(res, buf, name, type, inline = false) {
  const fn = pdfFilename(name, type);
  const how = inline ? 'inline' : 'attachment';
  res.set({
    'Content-Type': 'application/pdf',
    'Content-Length': String(buf.length),
    'Content-Transfer-Encoding': 'binary',
    'Content-Disposition': `${how}; filename="${fn.ascii}"; filename*=UTF-8''${fn.utf8}`,
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
  });
  res.end(buf);   // send() 는 변형이 끼어들 수 있어 end() 로 그대로 흘린다
}

module.exports = { htmlToPdf, pdfFilename, sendPdf };
