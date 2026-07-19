/* ============================================================
 * 랜딩 페이지 렌더러 (서버 사이드)
 * 빌더가 저장한 JSON → 공개용 HTML
 * ============================================================ */

const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));

const SKINS = {
  moon: {
    label: '월백 月白', accent: '#8a6a2f',
    v: { bg:'#faf8f3', card:'#ffffff', text:'#1d1c19', sub:'#8b867c', line:'#e8e2d6', rd:'12px', btx:'#ffffff',
         disp:"'Gowun Batang',serif", body:'Pretendard,sans-serif' },
  },
  hanji: {
    label: '한지 韓紙', accent: '#a9331f',
    v: { bg:'#f3eee2', card:'#fbf8f1', text:'#1c1a16', sub:'#7e7768', line:'#ddd4c1', rd:'2px', btx:'#fbf8f1',
         disp:"'Nanum Myeongjo',serif", body:"'Nanum Myeongjo',Pretendard,serif" },
  },
  plain: {
    label: '담백 淡白', accent: '#2f3a5c',
    v: { bg:'#ffffff', card:'#ffffff', text:'#14161c', sub:'#8b8f99', line:'#ecedf1', rd:'18px', btx:'#ffffff',
         disp:'Pretendard,sans-serif', body:'Pretendard,sans-serif' },
  },
  night: {
    label: '야행 夜行', accent: '#c8a45c',
    v: { bg:'#0d0f15', card:'#141821', text:'#e9e6dd', sub:'#8b8f9c', line:'#242a36', rd:'4px', btx:'#12141a',
         disp:"'Gowun Batang',serif", body:'Pretendard,sans-serif' },
  },
};

const SKIN_EXTRA = {
  moon: `
body{background:radial-gradient(140% 70% at 50% -10%,#fffdf8 0%,var(--bg) 60%)}
.card{box-shadow:0 1px 2px rgba(29,28,25,.04),0 12px 30px -22px rgba(29,28,25,.35)}
.lbar{background:rgba(250,248,243,.92);backdrop-filter:blur(8px)}
.hl{padding:40px 20px 28px}
.gg .seg{display:none}`,
  hanji: `
body{background-image:repeating-linear-gradient(90deg,rgba(0,0,0,.014) 0 1px,transparent 1px 3px)}
.card{box-shadow:0 1px 0 rgba(0,0,0,.03)}
.pr .bd{border:1px solid var(--ac);color:var(--ac);display:inline-block;padding:5px 9px;letter-spacing:.08em}
.gg .bar,.gg .moon{display:none}
.cd .u b{font-weight:800}
.sticky a,.go,.bt a,.fm .sub,.rv .bx{border-radius:0}`,
  plain: `
.lp{padding-bottom:104px}
.card,.rv .bx{border-color:transparent;box-shadow:0 2px 24px -14px rgba(20,22,28,.3),0 0 0 1px var(--ln)}
.hl{padding:44px 20px 30px}
.hl h1{font-weight:800;letter-spacing:-.035em;line-height:1.42}
.gg .seg{display:none}
.sticky{background:linear-gradient(transparent,rgba(0,0,0,.05));border-top:0}
.sticky a{border-radius:99px;box-shadow:0 10px 30px -8px rgba(0,0,0,.35)}
.go,.bt a,.fm .sub{border-radius:12px}`,
  night: `
body{background:radial-gradient(120% 60% at 50% 0%,#171c28 0%,var(--bg) 55%)}
.hl h1{text-shadow:0 0 40px rgba(200,164,92,.12)}
.card{box-shadow:inset 0 1px 0 rgba(255,255,255,.03)}
.gg .seg{display:none}`,
};

function pageCSS(theme) {
  const sk = SKINS[theme.skin] || SKINS.moon;
  const v = sk.v;
  return `
:root{--ac:${theme.accent || sk.accent};--bg:${v.bg};--cd:${v.card};--tx:${v.text};--sb:${v.sub};--ln:${v.line};--rd:${v.rd};--btx:${v.btx}}
*{box-sizing:border-box;margin:0;padding:0}
body{background:var(--bg);color:var(--tx);font-family:${v.body};-webkit-font-smoothing:antialiased;line-height:1.62}
img{max-width:100%;display:block}
.lp{max-width:480px;margin:0 auto;padding-bottom:100px;overflow:hidden}
.wrap{padding:0 20px}
.mt{margin:16px 0}
.card{background:var(--cd);border:1px solid var(--ln);border-radius:var(--rd);overflow:hidden}
.lbar{display:flex;align-items:center;justify-content:space-between;padding:15px 20px;border-bottom:1px solid var(--ln);position:sticky;top:0;z-index:20;background:var(--bg)}
.lbar .lg{display:flex;align-items:center;gap:9px}
.lbar .lg img{height:26px;width:auto}
.lbar b{font-family:${v.disp};font-size:16px;font-weight:700;letter-spacing:.04em;display:flex;align-items:baseline;gap:5px}
.lbar b i{font-style:normal;font-size:11px;letter-spacing:.16em;color:var(--sb);font-weight:400}
.lbar a{font-size:12px;font-weight:700;color:var(--ac);text-decoration:none;border-bottom:1px solid var(--ac);padding-bottom:2px}
.hl{padding:34px 20px 26px}
.hl .eb{font-size:11px;font-weight:700;letter-spacing:.18em;color:var(--ac);margin-bottom:14px}
.hl h1{font-family:${v.disp};font-weight:700;line-height:1.5;letter-spacing:-.01em;white-space:pre-line}
.hl h1 em{font-style:normal;color:var(--ac)}
.hl p{margin-top:14px;font-size:14px;color:var(--sb);white-space:pre-line}
.prbadge{font-size:11px;font-weight:700;letter-spacing:.12em;color:var(--ac);margin-bottom:10px;display:block}
.pr{padding:20px;margin-bottom:9px;position:relative}
.pr.best{border-color:var(--ac)}
.bestbadge{position:absolute;top:-1px;right:14px;background:var(--ac);color:var(--btx);font-size:10px;font-weight:700;padding:3px 9px;border-radius:0 0 6px 6px}
.pname{font-family:${v.disp};font-size:17px;font-weight:700;margin-bottom:4px}
.pdesc{font-size:12.5px;color:var(--sb);margin-bottom:12px}
.pr .bd{font-size:11px;font-weight:700;letter-spacing:.12em;color:var(--ac);display:block;margin-bottom:16px}
.pr .amt{display:flex;align-items:baseline;gap:10px}
.pr .was{font-size:14px;color:var(--sb);text-decoration:line-through}
.pr .off{font-family:${v.disp};font-size:16px;font-weight:700;color:var(--ac)}
.pr .now{font-family:${v.disp};font-size:34px;font-weight:700;letter-spacing:-.02em;margin-left:auto}
.pr .now small{font-size:15px;margin-left:2px}
.go{display:block;margin-top:14px;padding:16px;border-radius:var(--rd);background:var(--ac);color:var(--btx);font-size:15.5px;font-weight:800;text-align:center;text-decoration:none;letter-spacing:.02em}
.cd{padding:22px 20px;text-align:center}
.cd .t{font-size:11.5px;font-weight:700;letter-spacing:.14em;color:var(--ctxt,var(--sb));margin-bottom:16px}
.cd .digits{display:flex;justify-content:center;align-items:baseline;gap:10px;font-family:${v.disp}}
.cd .u b{font-size:36px;font-weight:700;font-variant-numeric:tabular-nums;letter-spacing:-.02em;color:var(--cnum,var(--tx))}
.cd .u span{font-size:10px;color:var(--sb);margin-left:2px;letter-spacing:.1em}
.cd .cl{color:var(--ln);font-size:22px}
.cd .note{margin-top:16px;padding-top:14px;border-top:1px solid var(--ln);font-size:12px;color:var(--ctxt,var(--sb))}
/* 타이머 디자인 — 박스형 */
.cd.box .digits,.cd.urgent .digits{gap:7px;align-items:center}
.cd.box .u,.cd.urgent .u{background:var(--cbox,#1c1a17);border-radius:10px;padding:11px 6px 8px;min-width:60px}
.cd.box .u b,.cd.urgent .u b{display:block;font-size:30px;color:var(--cnum,#fff)}
.cd.box .u span,.cd.urgent .u span{display:block;margin:2px 0 0;font-size:9.5px;color:var(--clab,rgba(255,255,255,.55))}
.cd.box .cl,.cd.urgent .cl{color:var(--cbox,#1c1a17);font-size:18px;font-weight:800;opacity:.45}
/* 긴박 — 박스 고동 + 초 깜빡임 */
.cd.urgent .t{color:var(--ctxt,var(--cbox,#c0392b));font-weight:800}
.cd.urgent .note{color:var(--ctxt,var(--cbox,#c0392b));font-weight:700;border-top-color:var(--ctxt,var(--cbox,#c0392b));opacity:.85}
.cd.urgent .u{animation:cdpulse 1.6s ease-in-out infinite}
.cd.urgent .u:last-of-type b{animation:cdblink 1s steps(2,start) infinite}
@keyframes cdpulse{0%,100%{transform:scale(1)}50%{transform:scale(1.045)}}
@keyframes cdblink{50%{opacity:.35}}
@media(prefers-reduced-motion:reduce){.cd.urgent .u,.cd.urgent .u:last-of-type b{animation:none}}
.gg{padding:20px;display:flex;align-items:center;gap:16px}
.gg .moon{flex:none;width:62px;height:62px}
.gg .body{flex:1;min-width:0}
.gg .top{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.gg .top span{font-size:11.5px;font-weight:700;letter-spacing:.14em;color:var(--sb)}
.gg .now{margin-left:auto;display:inline-flex;align-items:center;gap:5px;padding:4px 9px;border-radius:99px;font-size:10.5px;font-weight:700;background:rgba(127,127,127,.12);color:var(--sb);white-space:nowrap}
.gg .now i{width:5px;height:5px;border-radius:99px;background:currentColor;animation:gpulse 1.6s infinite}
@keyframes gpulse{0%,100%{opacity:1}50%{opacity:.25}}
.gg .big{margin-top:6px}
.gg em{font-family:${v.disp};font-style:normal;font-size:30px;font-weight:800;line-height:1.1;color:var(--ac);letter-spacing:-.02em}
.gg em i{font-style:normal;font-size:13px;font-weight:700;color:var(--sb);letter-spacing:0}
.gg em.zero{font-size:22px;color:var(--sb)}
.gg .note{margin-top:9px;font-size:12px;color:var(--sb);line-height:1.55}
.gg .note b{font-weight:700}
.gg .seg{display:flex;gap:3px;margin-top:11px}
.gg .seg i{flex:1;height:7px;background:var(--ln)}
.gg .seg i.on{background:var(--ac)}
.gg .bar{height:9px;border-radius:99px;background:rgba(127,127,127,.16);margin-top:11px;overflow:hidden}
.gg .bar i{display:block;height:100%;border-radius:99px;background:var(--ac);transition:width .5s ease}
/* 남은 자리가 실제로 적을 때만 색이 올라간다 */
.gg.warm{border-color:rgba(224,140,26,.4)}
.gg.warm em,.gg.warm .note b{color:#d18310}
.gg.warm .bar i,.gg.warm .seg i.on{background:#e59a22}
.gg.warm .now{background:rgba(224,140,26,.16);color:#b8730c}
.gg.hot{border-color:rgba(214,55,45,.42);background:rgba(214,55,45,.05)}
.gg.hot em,.gg.hot .note b{color:#d6372d}
.gg.hot .bar i,.gg.hot .seg i.on{background:#d6372d}
.gg.hot .now{background:rgba(214,55,45,.14);color:#c02f26}
.gg.done{opacity:.72}
.gg.done .bar i,.gg.done .seg i.on{background:var(--sb)}
.lv .h{display:flex;align-items:center;gap:8px;padding:14px 18px;border-bottom:1px solid var(--ln);font-size:11.5px;font-weight:700;letter-spacing:.14em;color:var(--sb)}
.lv .dot{width:6px;height:6px;border-radius:50%;background:var(--ac);animation:bl 1.4s infinite}
@keyframes bl{50%{opacity:.2}}
.lv .tag{margin-left:auto;font-size:10px;letter-spacing:.16em;color:var(--ac)}
.lv .vp{height:132px;overflow:hidden}
.lv ul{list-style:none}
.lv li{display:flex;align-items:center;gap:11px;padding:0 18px;height:44px}
.lv .av{width:24px;height:24px;border:1px solid var(--ln);color:var(--sb);display:grid;place-items:center;font-size:11px;font-weight:700;flex:none;font-family:${v.disp}}
.lv .nm{font-size:12.5px;font-weight:700}
.lv .ph{font-size:11px;color:var(--sb);margin-left:6px;font-weight:400}
.lv .st{margin-left:auto;font-size:10.5px;font-weight:700;color:var(--ac);flex:none}
.lv .st.w{color:var(--sb)}
.lv .tm{font-size:10.5px;color:var(--sb);width:52px;text-align:right;flex:none}
.lv .none{padding:22px 18px;text-align:center;color:var(--sb);font-size:12.5px}
.rv{padding:10px 0}
.rv h3{font-family:${v.disp};font-size:11.5px;font-weight:700;letter-spacing:.16em;color:var(--sb);padding:0 20px;margin-bottom:14px}
.rv .vp{overflow:hidden}
.rv .track{display:flex;transition:transform .38s cubic-bezier(.4,0,.2,1)}
.rv .it{min-width:100%;padding:0 20px;flex:none}
.rv .bx{padding:17px 18px 15px;border:1px solid var(--ln);border-radius:var(--rd);background:var(--cd);height:100%}
.rv .rtop{display:flex;align-items:center;gap:9px;margin-bottom:9px}
.rv .rav{width:32px;height:32px;border-radius:99px;flex:none;object-fit:cover;background:var(--ln)}
.rv .rav.ini{display:flex;align-items:center;justify-content:center;font-family:${v.disp};font-size:14px;font-weight:700;color:var(--ac);background:rgba(127,127,127,.13)}
.rv .rnm{font-size:13.5px;font-weight:700;color:var(--tx)}
.rv .rdt{margin-left:auto;font-size:11.5px;color:var(--sb)}
.rv .rst{display:flex;align-items:center;gap:6px;margin-bottom:10px}
.rv .st{font-size:14px;letter-spacing:1px;color:var(--ln)}
.rv .st b{color:#f5a623}
.rv .sn{font-size:12.5px;font-weight:700;color:var(--tx)}
.rv .qt{font-size:13.5px;line-height:1.78;letter-spacing:-.01em;color:var(--tx)}
.rv .qt.clamp{display:-webkit-box;-webkit-line-clamp:4;-webkit-box-orient:vertical;overflow:hidden}
.rv .rmore{margin-top:9px;padding:0;border:0;background:none;color:var(--ac);font-size:12px;font-weight:700;cursor:pointer;font-family:inherit;border-bottom:1px solid currentColor}
.rv .dots{display:flex;justify-content:center;gap:5px;margin-top:14px}
.rv .dots i{width:5px;height:5px;border-radius:99px;background:var(--ln);cursor:pointer;transition:.2s}
.rphoto{width:100%;border-radius:8px;margin-bottom:11px;display:block;border:1px solid var(--ln)}
/* 목록형 */
.rv-list .it{padding:0 20px;margin-bottom:11px}
.rv-list .bx{border:1px solid var(--ln);border-radius:var(--rd);padding:16px;background:var(--cd)}
/* 카드 2열 */
.rv-grid .gwrap{display:grid;grid-template-columns:1fr 1fr;gap:9px;padding:0 20px}
.rv-grid .bx{border:1px solid var(--ln);border-radius:var(--rd);padding:13px;background:var(--cd);height:100%}
.rv-grid .qt{font-size:12.5px;line-height:1.7}
.rv-grid .rav{width:26px;height:26px}
.rv-grid .rav.ini{font-size:12px}
.rv-grid .rnm{font-size:12.5px}
.rv-grid .rdt{font-size:10.5px}
.rv-grid .st{font-size:12px}
.rv-grid .sn{font-size:11.5px}
.rv .dots i.on{background:var(--ac);width:16px}
.bl{padding:24px 20px}
.bl h3,.fq h3{font-family:${v.disp};font-size:18px;font-weight:700;margin-bottom:16px;letter-spacing:-.01em}
.bl li{list-style:none;display:flex;gap:12px;padding:10px 0;font-size:14.5px;border-bottom:1px solid var(--ln)}
.bl li:before{content:"\\2014";color:var(--ac)}
.bl li:last-child{border-bottom:0}
.fq{padding:24px 20px}
.fq details{border-bottom:1px solid var(--ln);padding:13px 0}
.fq summary{font-size:14.5px;font-weight:700;cursor:pointer;list-style:none;display:flex;justify-content:space-between;gap:10px}
.fq summary::-webkit-details-marker{display:none}
.fq summary:after{content:"+";color:var(--ac);font-weight:400}
.fq details[open] summary:after{content:"\\2212"}
.fq p{margin-top:10px;font-size:13.5px;color:var(--sb);line-height:1.75}
.bt{padding:6px 20px}
.bt a{display:block;padding:16px;border-radius:var(--rd);background:var(--ac);color:var(--btx);font-weight:800;font-size:15px;text-align:center;text-decoration:none}
.fm{padding:26px 20px}
.fm h3{font-family:${v.disp};font-size:19px;font-weight:700;margin-bottom:20px;letter-spacing:-.01em}
.fm .g{margin-bottom:17px}
.fm .lb{font-size:11.5px;font-weight:700;letter-spacing:.1em;color:var(--sb);margin-bottom:8px;display:block}
.fm .lb i{color:var(--ac);font-style:normal;margin-left:3px}
.fm input,.fm select,.fm textarea{width:100%;padding:12px;border:1px solid var(--ln);border-radius:var(--rd);font-size:14px;background:transparent;outline:none;font-family:inherit;color:var(--tx)}
.fm select{appearance:none;background-image:linear-gradient(45deg,transparent 50%,var(--sb) 50%),linear-gradient(135deg,var(--sb) 50%,transparent 50%);background-position:calc(100% - 16px) 18px,calc(100% - 11px) 18px;background-size:5px 5px;background-repeat:no-repeat}
.fm input:focus,.fm select:focus,.fm textarea:focus{border-color:var(--ac)}
.fm textarea{min-height:76px;resize:vertical}
.fm .pt-wrap{border:1px dashed var(--ln);border-radius:var(--rd);padding:14px}
.fm .pt-open{display:flex;align-items:flex-start;gap:9px;font-size:13.5px;line-height:1.5;cursor:pointer;color:var(--tx)}
.fm .pt-open input{width:17px;height:17px;flex-shrink:0;margin-top:1px}
.fm .pt-fields{margin-top:12px;display:flex;flex-direction:column;gap:9px}
.fm .pt-fields[hidden]{display:none}
.fm .pt-row{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.fm .pt-sex{border:1px solid var(--ln);border-radius:var(--rd);padding:10px;text-align:center;font-size:13.5px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px}
.fm .pt-sex input{width:auto}
.fm .seg{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.fm .seg.c3{grid-template-columns:repeat(3,1fr)}
.fm .seg label{border:1px solid var(--ln);border-radius:var(--rd);padding:12px;text-align:center;font-size:13.5px;cursor:pointer}
.fm .seg input{display:none}
.fm .seg label:has(input:checked){border-color:var(--ac);color:var(--ac);font-weight:700}
.fm .g3{display:grid;grid-template-columns:1.2fr 1fr 1fr;gap:7px}
.fm .tip{font-size:11px;color:var(--sb);margin-top:7px;line-height:1.6}
.fm .tip b{color:var(--tx)}
.fm .tip.alt{margin-top:6px;padding:8px 10px;border-radius:var(--rd);background:rgba(254,229,0,.14);border:1px solid rgba(254,229,0,.4)}
.fm .tip.alt a{color:var(--ac);font-weight:700;text-decoration:underline}
.fm .ag{display:flex;gap:9px;align-items:flex-start;font-size:11.5px;color:var(--sb);line-height:1.6}
.fm .ag input{width:16px;height:16px;flex:none;margin-top:2px;accent-color:var(--ac)}
.fm .sub{width:100%;padding:17px;border:0;border-radius:var(--rd);background:var(--ac);color:var(--btx);font-size:16px;font-weight:800;cursor:pointer;font-family:inherit}
.fm .sub:disabled{opacity:.5}
.formerr{background:#fdecea;border:1px solid #e8b4ae;color:#b0392c;border-radius:var(--rd);padding:12px 14px;font-size:13px;margin-bottom:16px;line-height:1.6}
.errmsg{color:#c0392b;font-size:12px;margin-top:6px}
.errfield input,.errfield select,.errfield textarea{border-color:#e08b80!important}
.errfield .seg label{border-color:#e08b80}
.fm .ok{font-family:${v.disp};text-align:center;padding:40px 12px;font-size:15px;line-height:1.9}
/* 입금 계좌 안내 — 접수 완료 후 나타난다 */
.bk{padding:34px 4px 8px;text-align:center}
.bk .bk-done{font-family:${v.disp};font-size:15.5px;line-height:1.85;margin-bottom:24px}
.bk .bk-card{border:1px solid var(--ln);border-radius:var(--rd);overflow:hidden;text-align:left;background:var(--cd)}
.bk .bk-hd{padding:13px 16px;border-bottom:1px solid var(--ln);font-size:12px;font-weight:800;letter-spacing:.06em;color:var(--ac)}
.bk .bk-amt{padding:20px 16px;text-align:center;border-bottom:1px dashed var(--ln)}
.bk .bk-amt .lb{display:block;font-size:11.5px;color:var(--sb);margin-bottom:5px}
.bk .bk-amt .num{font-family:${v.disp};font-size:27px;font-weight:800;letter-spacing:-.01em}
.bk .bk-amt .pd{display:block;font-size:11.5px;color:var(--sb);margin-top:6px}
.bk .bk-row{display:flex;align-items:center;gap:10px;padding:12px 16px;font-size:13.5px}
.bk .bk-row+.bk-row{border-top:1px solid var(--ln)}
.bk .bk-row .k{flex:none;width:52px;font-size:12px;color:var(--sb)}
.bk .bk-row .v{flex:1;font-weight:700;word-break:break-all}
.bk .bk-row .v.acc{font-size:16px;letter-spacing:.02em;font-variant-numeric:tabular-nums}
.bk .bk-copy{flex:none;padding:8px 13px;border:1px solid var(--ac);border-radius:calc(var(--rd) - 2px);background:transparent;color:var(--ac);font-size:12px;font-weight:800;cursor:pointer;font-family:inherit;white-space:nowrap}
.bk .bk-copy.done{background:var(--ac);color:var(--btx)}
.bk .bk-note{padding:14px 16px;border-top:1px solid var(--ln);font-size:12px;color:var(--sb);line-height:1.75;white-space:pre-line}
.fs{padding:24px 20px;text-align:center}
.fs h3{font-family:${v.disp};font-size:19px;font-weight:700;margin-bottom:10px}
.fs p{font-size:13.5px;color:var(--sb);margin-bottom:18px;line-height:1.7}
.fs a{display:block;padding:15px;border:1px solid var(--ac);border-radius:var(--rd);color:var(--ac);font-weight:800;font-size:15px;text-decoration:none}
.sticky{position:fixed;left:0;right:0;bottom:0;z-index:50;background:var(--bg);border-top:1px solid var(--ln);padding:12px 20px calc(12px + env(safe-area-inset-bottom))}
.sticky a{display:block;max-width:440px;margin:0 auto;padding:16px;border-radius:var(--rd);background:var(--ac);color:var(--btx);font-size:15.5px;font-weight:800;text-align:center;text-decoration:none;letter-spacing:.02em}
.hide{display:none}
@media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
${SKIN_EXTRA[theme.skin] || ''}`;
}

function moonSVG(pct) {
  const cut = 52 * (1 - pct / 100);
  return `<svg class="moon" viewBox="0 0 60 60" aria-hidden="true">
    <defs><clipPath id="mc"><rect x="0" y="${4 + cut}" width="60" height="60"/></clipPath></defs>
    <circle cx="30" cy="30" r="26" fill="none" stroke="var(--ln)" stroke-width="1"/>
    <circle cx="30" cy="30" r="26" fill="var(--ac)" clip-path="url(#mc)" opacity=".92"/></svg>`;
}

const HOURS = ['모름 / 선택 안함','자시 子 23:30~01:29','축시 丑 01:30~03:29','인시 寅 03:30~05:29','묘시 卯 05:30~07:29','진시 辰 07:30~09:29','사시 巳 09:30~11:29','오시 午 11:30~13:29','미시 未 13:30~15:29','신시 申 15:30~17:29','유시 酉 17:30~19:29','술시 戌 19:30~21:29','해시 亥 21:30~23:29'];

const REGIONS = ['서울특별시','인천광역시','경기도','강원도','대전광역시','세종특별자치시','충청북도','충청남도','광주광역시','전라북도','전라남도','대구광역시','경상북도','부산광역시','울산광역시','경상남도','제주특별자치도'];

/**
 * @param b 블록
 * @param ctx { skin, slug, live: [...], stats: {...} }  live/stats는 DB 실제 데이터
 */
function renderBlock(b, ctx) {
  const sk = ctx.skin;
  switch (b.type) {
    case 'logobar':
      return `<div class="lbar"><span class="lg">${b.logo ? `<img src="${esc(b.logo)}" alt="${esc(b.text)}">` : ''}
        <b>${esc(b.text)}${b.sub ? `<i>${esc(b.sub)}</i>` : ''}</b></span>
        ${b.right ? `<a href="#lp-form">${esc(b.right)}</a>` : ''}</div>`;

    case 'image':
      if (!b.src) return '';
      return b.pad
        ? `<div class="wrap mt"><img class="card" src="${esc(b.src)}" alt="${esc(b.alt)}"></div>`
        : `<img src="${esc(b.src)}" alt="${esc(b.alt)}" style="width:100%">`;

    case 'headline': {
      let ttl = esc(b.title);
      if (b.hi) ttl = ttl.split(esc(b.hi)).join(`<em>${esc(b.hi)}</em>`);
      return `<div class="hl" style="text-align:${b.align === 'center' ? 'center' : 'left'}">
        ${b.eyebrow ? `<div class="eb">${esc(b.eyebrow)}</div>` : ''}
        <h1 style="font-size:${Number(b.size) || 26}px">${ttl}</h1>
        ${b.desc ? `<p>${esc(b.desc)}</p>` : ''}</div>`;
    }

    case 'price': {
      // 구버전 호환: items 없으면 단일 상품으로 변환
      const items = b.items && b.items.length ? b.items
        : [{ name: '상담', desc: '', off: b.off, was: b.was, now: b.now, best: false }];
      return `<div class="wrap mt">
        ${b.badge ? `<div class="prbadge">${esc(b.badge)}</div>` : ''}
        ${items.map((x) => `<div class="card pr ${x.best ? 'best' : ''}">
          ${x.best ? `<span class="bestbadge">추천</span>` : ''}
          <div class="pname">${esc(x.name)}</div>
          ${x.desc ? `<div class="pdesc">${esc(x.desc)}</div>` : ''}
          <div class="amt">${x.off ? `<span class="off">${esc(x.off)}</span>` : ''}${x.was ? `<span class="was">${esc(x.was)}</span>` : ''}<span class="now">${esc(x.now)}<small>원</small></span></div>
        </div>`).join('')}
        <a class="go" href="#lp-form">${esc(b.cta)}</a></div>`;
    }

    case 'countdown': {
      let cfg;
      if (b.mode === 'cycle') {
        cfg = `data-cycle="${Number(b.cycle) || 24}"` + (b.anchor ? ` data-anchor="${esc(b.anchor)}"` : '');
      } else if (b.mode === 'fixed' && b.target) {
        cfg = `data-target="${esc(b.target)}"`;
      } else {
        cfg = `data-hours="${Number(b.hours) || 6}"`;
      }
      // 디자인: plain / box / urgent + 색 커스텀
      const sty = b.cdStyle || 'plain';
      const vars = [
        b.numColor ? `--cnum:${esc(b.numColor)}` : '',
        b.boxColor ? `--cbox:${esc(b.boxColor)}` : '',
        b.labColor ? `--clab:${esc(b.labColor)}` : '',
        b.txtColor ? `--ctxt:${esc(b.txtColor)}` : '',
      ].filter(Boolean).join(';');
      return `<div class="wrap mt"><div class="card cd ${sty}" ${vars ? `style="${vars}"` : ''} data-cd ${cfg}>
        <div class="t">${esc(b.title)}</div>
        <div class="digits">
          <div class="u"><b data-d>00</b><span>일</span></div><div class="cl">:</div>
          <div class="u"><b data-h>00</b><span>시</span></div><div class="cl">:</div>
          <div class="u"><b data-m>00</b><span>분</span></div><div class="cl">:</div>
          <div class="u"><b data-s>00</b><span>초</span></div>
        </div>
        ${b.note ? `<div class="note">${esc(b.note)}</div>` : ''}</div></div>`;
    }

    case 'gauge': {
      // 실제 신청 건수 기반 (DB) — 가짜 숫자 아님
      const total = Math.max(1, Number(b.total) || 1);
      const used = ctx.stats ? Number(ctx.stats.leadCount || 0) : 0;
      const left = Math.max(0, total - used);
      // 막대는 '채워진 정도'를 보여준다 — 찰수록 길어져야 마감이 가까워 보인다
      const fill = Math.max(2, Math.min(100, Math.round((used / total) * 100)));
      const pct = Math.max(3, Math.min(100, Math.round((left / total) * 100)));
      const segs = Array.from({ length: 10 }, (_, i) => `<i class="${i < Math.round(fill / 10) ? 'on' : ''}"></i>`).join('');

      // 남은 자리가 실제로 적을 때만 붉게 — 넉넉한데 임박한 척하지 않는다
      const ratio = left / total;
      const hot = left === 0 ? 'done' : ratio <= 0.3 ? 'hot' : ratio <= 0.6 ? 'warm' : '';

      // 지금 보고 있는 사람 (최근 30분 실제 방문 기록) — 혼자일 땐 숨긴다
      const viewing = ctx.stats ? Number(ctx.stats.viewing || 0) : 0;
      const liveTag = viewing >= 2
        ? `<span class="now"><i></i>현재 ${viewing}명 보는 중${hot === 'hot' ? ' · 마감 임박' : ''}</span>` : '';

      const headline = left === 0
        ? `<em class="zero">마감</em>`
        : `<em>${left}<i> / ${total}명</i></em>`;

      return `<div class="wrap mt"><div class="card gg ${hot}">
        ${sk === 'hanji' ? '' : moonSVG(pct)}
        <div class="body">
          <div class="top"><span>${esc(b.title)}</span>${liveTag}</div>
          <div class="big">${headline}</div>
          ${sk === 'hanji' ? `<div class="seg">${segs}</div>` : `<div class="bar"><i style="width:${fill}%"></i></div>`}
          ${b.note ? `<div class="note">${hot ? '<b>⚠</b> ' : ''}${esc(b.note)}</div>` : ''}
        </div></div></div>`;
    }

    case 'live': {
      // 실제 신청 내역 (DB)
      const items = ctx.live || [];
      if (!items.length) {
        return `<div class="wrap mt"><div class="card lv">
          <div class="h"><span class="dot"></span>${esc(b.title)}<span class="tag">LIVE</span></div>
          <div class="none">아직 접수 내역이 없습니다.</div></div></div>`;
      }
      const rows = items.concat(items).map((x) => `<li>
        <span class="av">${esc((x.name || '　')[0])}</span>
        <span class="nm">${esc(x.name)}<span class="ph">${esc(x.phone)}</span></span>
        <span class="st ${x.status === '풀이중' ? 'w' : ''}">${esc(x.status)}</span>
        <span class="tm">${esc(x.ago)}</span></li>`).join('');
      return `<div class="wrap mt"><div class="card lv">
        <div class="h"><span class="dot"></span>${esc(b.title)}<span class="tag">LIVE</span></div>
        <div class="vp" data-live><ul>${rows}</ul></div></div></div>`;
    }

    case 'reviews': {
      const items = b.items || [];
      if (!items.length) return '';

      // 별점 — 채운 별과 빈 별을 따로 그린다 (색을 다르게 주기 위해)
      const stars = (r) => {
        const n = Math.max(0, Math.min(5, Math.round(Number(r) || 5)));
        return `<span class="st"><b>${'★'.repeat(n)}</b>${'★'.repeat(5 - n)}</span>`
             + `<span class="sn">${n.toFixed(1)}</span>`;
      };

      // 이름 첫 글자를 딴 동그란 프로필 (사진이 있으면 사진으로)
      const card = (x) => {
        const nm = String(x.n || '손님').trim();
        const ini = nm.slice(0, 1);
        return `<div class="bx">
        <div class="rtop">
          ${x.photo ? `<img class="rav" src="${esc(x.photo)}" alt="">`
                    : `<span class="rav ini">${esc(ini)}</span>`}
          <span class="rnm">${esc(nm)}</span>
          ${x.d ? `<span class="rdt">${esc(x.d)}</span>` : ''}
        </div>
        <div class="rst">${stars(x.r)}</div>
        <div class="qt" data-more>${esc(x.t)}</div>
        <button type="button" class="rmore" data-more-btn hidden>전체 보기 →</button>
      </div>`;
      };

      const view = b.view || 'slide';   // slide | list | grid
      const head = b.title ? `<h3>${esc(b.title)}</h3>` : '';

      // 목록 — 위아래로 쭉 (넘기지 않아도 다 보임)
      if (view === 'list') {
        return `<div class="rv rv-list mt">${head}
          ${items.map((x) => `<div class="it">${card(x)}</div>`).join('')}</div>`;
      }

      // 카드 2열 — 한눈에
      if (view === 'grid') {
        return `<div class="rv rv-grid mt">${head}
          <div class="gwrap">${items.map((x) => `<div class="it">${card(x)}</div>`).join('')}</div></div>`;
      }

      // 슬라이드 (기본)
      const it = items.map((x) => `<div class="it">${card(x)}</div>`).join('');
      const dots = items.map((_, i) => `<i class="${i === 0 ? 'on' : ''}"></i>`).join('');
      return `<div class="rv mt" data-rv>${head}
        <div class="vp"><div class="track">${it}</div></div><div class="dots">${dots}</div></div>`;
    }

    case 'bullets':
      return `<div class="wrap mt"><div class="card bl"><h3>${esc(b.title)}</h3>
        <ul>${(b.items || []).map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div></div>`;

    case 'faq':
      return `<div class="wrap mt"><div class="card fq"><h3>${esc(b.title)}</h3>
        ${(b.items || []).map((x) => `<details><summary>${esc(x.q)}</summary><p>${esc(x.a)}</p></details>`).join('')}</div></div>`;

    case 'button': {
      const href = b.action === 'link' && b.href ? esc(b.href) : '#lp-form';
      return `<div class="bt mt"><a href="${href}"${b.action === 'link' ? ' target="_blank" rel="noopener"' : ''}>${esc(b.text)}</a></div>`;
    }

    case 'freesaju':
      // 무료사주 맛보기 → 기존 AI 풀이 페이지로 연결
      return `<div class="wrap mt"><div class="card fs">
        <h3>${esc(b.title || '무료 사주 먼저 보기')}</h3>
        <p>${esc(b.desc || '간단한 정보를 입력하면 나의 기본 사주와 올해 흐름을 무료로 확인할 수 있습니다.')}</p>
        <a href="/s/${esc(ctx.slug)}/free">${esc(b.cta || '무료로 사주 보기')}</a></div></div>`;

    case 'divider':
      return `<div class="wrap"><div style="height:${Number(b.h) || 24}px;${b.line ? 'border-bottom:1px solid var(--ln);' : ''}"></div></div>`;

    case 'form': {
      const u = b.use || {};
      const years = (() => { let o = ''; for (let y = new Date().getFullYear(); y >= 1930; y--) o += `<option>${y}</option>`; return o; })();
      const months = Array.from({ length: 12 }, (_, i) => `<option>${i + 1}</option>`).join('');
      const days = Array.from({ length: 31 }, (_, i) => `<option>${i + 1}</option>`).join('');
      let f = '';
      if (u.name) f += `<div class="g"><span class="lb">이름<i>*</i></span><input name="name" placeholder="홍길동" required></div>`;
      if (u.gender) f += `<div class="g"><span class="lb">성별<i>*</i></span><div class="seg">
        <label><input type="radio" name="gender" value="남" required><span>남성</span></label>
        <label><input type="radio" name="gender" value="여"><span>여성</span></label></div></div>`;
      if (u.birth) f += `<div class="g"><span class="lb">생년월일<i>*</i></span><div class="g3">
        <select name="year" required><option value="">년</option>${years}</select>
        <select name="month" required><option value="">월</option>${months}</select>
        <select name="day" required><option value="">일</option>${days}</select></div></div>`;
      if (u.cal) f += `<div class="g"><span class="lb">달력<i>*</i></span><div class="seg c3">
        <label><input type="radio" name="cal" value="양력" checked><span>양력</span></label>
        <label><input type="radio" name="cal" value="음력"><span>음력</span></label>
        <label><input type="radio" name="cal" value="윤달"><span>윤달</span></label></div></div>`;
      if (u.hour) f += `<div class="g"><span class="lb">태어난 시각</span>
        <input type="time" name="hour" data-hour step="60">
        <label class="ag" style="margin-top:9px"><input type="checkbox" data-hour-unknown> 태어난 시간을 몰라요</label>
        <div class="tip">가족관계증명서·아기수첩의 <b>출생 시각 그대로</b> 넣어주세요.<br>
        밤 11시 30분 이후 출생은 사주에서 <b>다음 날</b>로 넘어갑니다. 분 단위까지 정확해야 풀이가 맞습니다.</div></div>`;
      if (u.region) f += `<div class="g"><span class="lb">태어난 지역</span><select name="region">${REGIONS.map((r) => `<option${r === '서울특별시' ? ' selected' : ''}>${r}</option>`).join('')}</select></div>`;
      if (u.phone) f += `<div class="g"><span class="lb">연락처<i>*</i></span>
        <input name="phone" type="tel" inputmode="numeric" placeholder="010-0000-0000"
               pattern="01[016789][-.]?[0-9]{3,4}[-.]?[0-9]{4}" required>
        <div class="tip"><b>복채 안내를 문자로 보내드립니다.</b> 연락처가 없으면 안내가 어렵습니다.</div>
        ${b.kakaoAlt ? `<div class="tip alt">번호를 남기기 어려우시면
          <a href="${esc(b.kakaoAlt)}" target="_blank" rel="noopener">카카오톡으로 문의</a>해주세요.
          카톡으로도 안내받으실 수 있습니다.</div>` : ''}
        </div>`;
      if (u.email) f += `<div class="g"><span class="lb">이메일<i>*</i></span>
        <input name="email" type="email" placeholder="example@naver.com" required>
        <div class="tip">완성된 <b>PDF 사주 리포트</b>를 이 메일로 보내드립니다.</div></div>`;
      if (u.product) f += `<div class="g"><span class="lb">상품<i>*</i></span><select name="product" required><option value="">선택해주세요</option>${(b.products || []).map((p) => `<option>${esc(p)}</option>`).join('')}</select></div>`;
      if (u.memo) f += `<div class="g"><span class="lb">묻고 싶은 것</span><textarea name="memo" placeholder="가장 궁금한 한 가지를 적어주세요"></textarea></div>`;
      // 연인궁합·재회운은 상대방 사주가 있어야 제대로 볼 수 있다 → 접었다 펴는 입력칸
      f += `<div class="g pt-wrap">
        <label class="pt-open"><input type="checkbox" data-partner-toggle>
          <span>💑 <b>연인궁합 · 재회운</b>인가요? 상대방 정보도 입력해주세요</span></label>
        <div class="pt-fields" data-partner-fields hidden>
          <input name="partner_name" placeholder="상대방 이름 (선택)">
          <div class="pt-row">
            <label class="pt-sex"><input type="radio" name="partner_gender" value="남"> 남</label>
            <label class="pt-sex"><input type="radio" name="partner_gender" value="여"> 여</label>
          </div>
          <input name="partner_birth" placeholder="상대방 생년월일 (예: 1992-05-05)" inputmode="numeric">
          <select name="partner_calendar">
            <option value="양력">양력</option><option value="음력">음력</option><option value="윤달">윤달</option>
          </select>
          <input name="partner_hour" placeholder="상대방 태어난 시각 (모르면 비워두세요)">
          <div class="tip">상대방 정보가 있으면 두 사람의 궁합을 훨씬 정확하게 볼 수 있습니다.</div>
        </div></div>`;
      f += `<div class="g"><label class="ag"><input type="checkbox" required><span><b>개인정보 수집 및 이용 동의</b><br>${esc(b.agree)}</span></label></div>`;
      return `<div id="lp-form" class="wrap mt"><div class="card fm">
        <h3>${esc(b.title)}</h3>
        <form data-form action="/s/${esc(ctx.slug)}/apply" data-done="${esc(b.done)}">
          ${f}<button class="sub" type="submit">${esc(b.submit)}</button>
        </form></div></div>`;
    }
  }
  return '';
}

const RUNTIME = `(function(){
  // 후기 본문 — 길면 4줄로 접고 '전체 보기'를 붙인다
  document.querySelectorAll('[data-more]').forEach(function(q){
    q.classList.add('clamp');
    var btn = q.parentNode.querySelector('[data-more-btn]');
    if(!btn) return;
    if(q.scrollHeight - q.clientHeight < 4){ btn.remove(); return; }
    btn.hidden = false;
    btn.addEventListener('click', function(){
      var open = q.classList.toggle('clamp');
      btn.textContent = open ? '전체 보기 →' : '접기';
    });
  });

  // 연인궁합·재회운 상대방 정보 — 체크하면 입력칸이 펼쳐진다
  document.querySelectorAll('[data-partner-toggle]').forEach(function(cb){
    var box = cb.closest('.pt-wrap').querySelector('[data-partner-fields]');
    box.hidden = !cb.checked;
    cb.addEventListener('change', function(){
      box.hidden = !cb.checked;
      if(!cb.checked){
        box.querySelectorAll('input, select').forEach(function(el){
          if(el.type === 'radio') el.checked = false; else if(el.tagName !== 'SELECT') el.value = '';
        });
      }
    });
  });

  // 태어난 시각 — '모름' 체크하면 시각 입력을 끄고 '모름'으로 보낸다
  document.querySelectorAll('[data-hour-unknown]').forEach(function(cb){
    var wrap = cb.closest('.g');
    var t = wrap.querySelector('[data-hour]');
    var hidden = null;
    cb.addEventListener('change', function(){
      if (cb.checked) {
        t.value = ''; t.disabled = true;
        hidden = document.createElement('input');
        hidden.type = 'hidden'; hidden.name = 'hour'; hidden.value = '모름';
        wrap.appendChild(hidden);
      } else {
        t.disabled = false;
        if (hidden) { hidden.remove(); hidden = null; }
      }
    });
  });
  document.querySelectorAll('[data-cd]').forEach(function(el){
    var cyc = parseFloat(el.dataset.cycle) || 0;                 // 주기(시간) — 반복 모드
    var anc = el.dataset.anchor ? new Date(el.dataset.anchor).getTime() : null;

    function nextEnd(){
      if (cyc > 0) {
        var P = cyc * 3600 * 1000;
        // 기준 시각이 없으면 오늘 자정부터 센다
        var a = (anc !== null && !isNaN(anc)) ? anc : new Date().setHours(0,0,0,0);
        var k = Math.floor((Date.now() - a) / P);
        return a + (k + 1) * P;      // 이번 주기의 끝
      }
      if (el.dataset.target) return new Date(el.dataset.target).getTime();
      return Date.now() + (parseFloat(el.dataset.hours)||6)*3600*1000;
    }

    var end = nextEnd();
    var d=el.querySelector('[data-d]'),h=el.querySelector('[data-h]'),m=el.querySelector('[data-m]'),s=el.querySelector('[data-s]');
    var pad=function(n){return String(n).padStart(2,'0')};
    (function tick(){
      var left = end - Date.now();
      if (left <= 0 && cyc > 0) { end = nextEnd(); left = end - Date.now(); }  // 끝나면 다음 주기로
      left = Math.max(0, left) / 1000 | 0;
      d.textContent=pad(left/86400|0); h.textContent=pad((left%86400)/3600|0);
      m.textContent=pad((left%3600)/60|0); s.textContent=pad(left%60);
      setTimeout(tick,1000);
    })();
  });
  document.querySelectorAll('[data-live]').forEach(function(vp){
    var ul=vp.querySelector('ul'); if(!ul) return;
    var n=ul.children.length/2, i=0; if(n<2) return;
    setInterval(function(){
      i++; ul.style.transition='transform .6s cubic-bezier(.4,0,.2,1)';
      ul.style.transform='translateY(-'+(i*44)+'px)';
      if(i>=n){ setTimeout(function(){ ul.style.transition='none'; ul.style.transform='translateY(0)'; i=0; },620); }
    },2400);
  });
  document.querySelectorAll('[data-rv]').forEach(function(rv){
    var tr=rv.querySelector('.track'), dots=rv.querySelectorAll('.dots i'), n=tr.children.length, i=0;
    if(n<2) return;
    var go=function(k){ i=(k+n)%n; tr.style.transform='translateX(-'+(i*100)+'%)';
      dots.forEach(function(d,j){ d.classList.toggle('on', j===i); }); };
    var timer=setInterval(function(){ go(i+1); },4200);
    var x0=null;
    tr.addEventListener('touchstart',function(e){ x0=e.touches[0].clientX; clearInterval(timer); },{passive:true});
    tr.addEventListener('touchend',function(e){ if(x0===null)return; var dx=e.changedTouches[0].clientX-x0;
      if(Math.abs(dx)>40) go(i+(dx<0?1:-1)); x0=null; });
    dots.forEach(function(d,j){ d.addEventListener('click',function(){ clearInterval(timer); go(j); }); });
  });
  // 필수 항목 안내
  var LABELS = {name:'이름',gender:'성별',year:'생년',month:'생월',day:'생일',cal:'달력',
                hour:'태어난 시각',region:'태어난 지역',phone:'연락처',email:'이메일',product:'상품',memo:'묻고 싶은 것'};
  function fieldBox(el){ return el.closest('.g') || el.parentNode; }
  function clearErr(f){
    f.querySelectorAll('.errmsg').forEach(function(e){ e.remove(); });
    f.querySelectorAll('.errfield').forEach(function(e){ e.classList.remove('errfield'); });
  }
  function showErr(el, msg){
    var box = fieldBox(el);
    if(box.querySelector('.errmsg')) return;
    box.classList.add('errfield');
    var d = document.createElement('div');
    d.className = 'errmsg';
    d.textContent = msg;
    box.appendChild(d);
  }

  document.querySelectorAll('[data-form]').forEach(function(f){
    f.addEventListener('submit',function(e){
      e.preventDefault();
      clearErr(f);

      // 1) 필수 항목 검사
      var missing = [];
      var first = null;
      f.querySelectorAll('[required]').forEach(function(el){
        var ok;
        if(el.type === 'radio'){
          ok = f.querySelector('input[name="'+el.name+'"]:checked');
        } else if(el.type === 'checkbox'){
          ok = el.checked;
        } else {
          ok = el.value && el.value.trim();
        }
        if(!ok){
          var label = el.type==='checkbox' && !el.name ? '개인정보 수집 동의' : (LABELS[el.name] || '필수 항목');
          if(missing.indexOf(label) < 0) missing.push(label);
          showErr(el, el.type==='checkbox' && !el.name ? '동의가 필요합니다.' : label + '을(를) 입력해주세요.');
          if(!first) first = el;
        }
      });

      if(missing.length){
        var bar = f.querySelector('.formerr');
        if(!bar){
          bar = document.createElement('div');
          bar.className = 'formerr';
          f.insertBefore(bar, f.firstChild);
        }
        bar.textContent = missing.join(', ') + ' 항목을 확인해주세요.';
        var box = first ? fieldBox(first) : bar;
        box.scrollIntoView({behavior:'smooth', block:'center'});
        return;
      }
      var bar0 = f.querySelector('.formerr'); if(bar0) bar0.remove();

      var btn=f.querySelector('.sub'); btn.disabled=true; btn.textContent='보내는 중...';
      var data={}; new FormData(f).forEach(function(v,k){ data[k]=v; });
      fetch(f.getAttribute('action'),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)})
        .then(function(r){ if(!r.ok) throw 0; return r.json(); })
        .then(function(res){
          var done = f.dataset.done || '접수되었습니다.';
          var bk = res && res.bank;
          if(!bk){ f.parentNode.innerHTML = '<div class="ok">' + done + '</div>'; return; }

          function esc(s){
            return String(s == null ? '' : s)
              .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
              .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
          }
          var amt = bk.amount
            ? '<div class="bk-amt"><span class="lb">입금하실 금액</span>'
              + '<span class="num">' + bk.amount.toLocaleString('ko-KR') + '원</span>'
              + (bk.product ? '<span class="pd">' + esc(bk.product) + '</span>' : '')
              + '</div>'
            : '';
          var html = '<div class="bk">'
            + '<div class="bk-done">' + esc(done) + '</div>'
            + '<div class="bk-card">'
            +   '<div class="bk-hd">입금 계좌 안내</div>'
            +   amt
            +   (bk.bankName ? '<div class="bk-row"><span class="k">은행</span><span class="v">' + esc(bk.bankName) + '</span></div>' : '')
            +   '<div class="bk-row"><span class="k">계좌번호</span>'
            +     '<span class="v acc" data-acc>' + esc(bk.account) + '</span>'
            +     '<button type="button" class="bk-copy" data-copy>복사</button></div>'
            +   (bk.holder ? '<div class="bk-row"><span class="k">예금주</span><span class="v">' + esc(bk.holder) + '</span></div>' : '')
            +   (bk.notice ? '<div class="bk-note">' + esc(bk.notice) + '</div>' : '')
            + '</div></div>';
          var box = f.parentNode;
          box.innerHTML = html;

          // 계좌번호 복사 — 숫자만 남겨서 붙여넣기 바로 되게
          var btn2 = box.querySelector('[data-copy]');
          if(btn2) btn2.addEventListener('click', function(){
            var txt = (box.querySelector('[data-acc]').textContent || '').replace(/[^0-9]/g,'');
            function ok(){ btn2.textContent = '복사됨'; btn2.classList.add('done');
                           setTimeout(function(){ btn2.textContent='복사'; btn2.classList.remove('done'); }, 1600); }
            if(navigator.clipboard && navigator.clipboard.writeText){
              navigator.clipboard.writeText(txt).then(ok, function(){ fallback(txt, ok); });
            } else { fallback(txt, ok); }
          });
          function fallback(txt, ok){
            var t = document.createElement('textarea');
            t.value = txt; t.setAttribute('readonly',''); t.style.position='fixed'; t.style.opacity='0';
            document.body.appendChild(t); t.select();
            try { document.execCommand('copy'); ok(); } catch(e){ alert(txt); }
            document.body.removeChild(t);
          }
          box.scrollIntoView({behavior:'smooth', block:'center'});
        })
        .catch(function(){ btn.disabled=false; btn.textContent='다시 시도하기'; alert('전송에 실패했습니다. 잠시 후 다시 시도해주세요.'); });
    });

    // 입력하면 에러 지우기
    f.addEventListener('input', function(e){
      var box = fieldBox(e.target);
      var m = box.querySelector('.errmsg');
      if(m){ m.remove(); box.classList.remove('errfield'); }
    }, true);
    f.addEventListener('change', function(e){
      var box = fieldBox(e.target);
      var m = box.querySelector('.errmsg');
      if(m){ m.remove(); box.classList.remove('errfield'); }
    }, true);
  });
})();`;

/**
 * 랜딩 JSON → 공개 HTML
 * @param {object} S  { meta, theme, sticky, blocks }
 * @param {object} ctx { slug, live, stats }
 */
function renderLanding(S, ctx) {
  const theme = S.theme || { skin: 'moon', accent: SKINS.moon.accent };
  const c = Object.assign({ skin: theme.skin, slug: ctx.slug }, ctx);
  const body = (S.blocks || []).map((b) => renderBlock(b, c)).join('\n');
  const st = S.sticky || {};
  const href = st.action === 'link' && st.href ? esc(st.href) : '#lp-form';
  const sticky = st.on
    ? `<div class="sticky"><a href="${href}"${st.action === 'link' ? ' target="_blank" rel="noopener"' : ''}>${esc(st.text)}</a></div>`
    : '';
  const meta = S.meta || {};
  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(meta.title || '사주 상담')}</title>
<meta name="description" content="${esc(meta.desc || '')}">
<meta property="og:title" content="${esc(meta.title || '')}">
<meta property="og:description" content="${esc(meta.desc || '')}">
${meta.og ? `<meta property="og:image" content="${esc(meta.og)}">` : ''}
<meta property="og:type" content="website">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Gowun+Batang:wght@400;700&family=Nanum+Myeongjo:wght@400;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css">
<style>${pageCSS(theme)}</style>
</head>
<body>
<div class="lp">
${body}
</div>
${sticky}
<script>${RUNTIME}<\/script>
</body>
</html>`;
}

// 기본 랜딩 (교육생이 아직 안 꾸몄을 때)
function defaultLanding(name) {
  const uid = () => Math.random().toString(36).slice(2, 9);
  return {
    meta: { title: (name || '사주 상담') + ' — 사주 풀이', desc: '직접 풀어 적어 보내드립니다', og: '' },
    theme: { skin: 'moon', accent: '#8a6a2f' },
    sticky: { on: true, text: '상담 신청하기', action: 'form', href: '' },
    blocks: [
      { id: uid(), type: 'logobar', text: name || '사주 상담', sub: '', logo: '', right: '상담 신청' },
      { id: uid(), type: 'headline', eyebrow: '사주 상담 · 직접 풀이', title: '당신의 흐름을\n읽어 드립니다', desc: '요약본이 아니라, 직접 풀어 적어 보내드립니다.', align: 'left', size: 26, hi: '' },
      { id: uid(), type: 'freesaju', title: '무료 사주 먼저 보기', desc: '간단한 정보를 입력하면 나의 기본 사주와 올해 흐름을 무료로 확인할 수 있습니다.', cta: '무료로 사주 보기' },
      { id: uid(), type: 'price', badge: '이번 회차 · 선착순', cta: '상담 신청하기', items: [
        { name: '정밀 풀이', desc: '대운·세운까지 상세 분석', off: '40%', was: '50,000원', now: '29,800', best: true },
        { name: '기본 풀이', desc: '타고난 성향과 올해 흐름', off: '', was: '', now: '9,900', best: false },
      ] },
      { id: uid(), type: 'faq', title: '묻고 답하기', items: [
        { q: '결과는 언제 받나요?', a: '접수 후 영업일 기준 1~2일 안에 보내드립니다.' },
        { q: '태어난 시간을 모릅니다.', a: "'모름'에 체크하시면 시주 없이 풀이합니다. 다만 시각을 아시면 훨씬 정확합니다." },
        { q: '재회운·연애운·결혼운도 한 사람 사주만으로 볼 수 있나요?', a: '한 분의 사주만으로도 본인의 연애 성향과 관계 흐름은 확인할 수 있습니다. 다만 상대방과의 관계가 중요하여 고민이 되는 부분이 있다면, 두 사람의 흐름을 함께 볼 때 더 깊이 있는 풀이가 가능합니다. 두 분의 성향과 흐름을 함께 파악하고 싶으시다면 두 사람의 사주를 같이 보시는 것을 추천드립니다.' },
      ] },
      { id: uid(), type: 'form', title: '상담 신청',
        products: ['정밀 풀이 (29,800원)', '기본 풀이 (9,900원)'],
        use: { gender: true, name: true, birth: true, cal: true, hour: true, region: true, phone: true, email: true, product: true, memo: true },
        agree: '수집항목: 이름, 생년월일, 연락처 · 수집목적: 상담 제공 · 보유기간: 상담 완료 후 1년',
        submit: '접수하기', done: '접수되었습니다. 풀이가 끝나는 대로 연락드리겠습니다.' },
    ],
  };
}

module.exports = { renderLanding, defaultLanding, SKINS };
