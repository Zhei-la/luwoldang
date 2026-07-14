/* 루월당 랜딩 빌더 — 저장은 서버 DB로, 미리보기는 로컬 렌더 */
const uid = () => Math.random().toString(36).slice(2, 9);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
const $ = (s) => document.querySelector(s);

/* ---------------- 블록 정의 ---------------- */
const DEFS = {
  logobar:  { name:'상단 바 · 로고', ico:'▤', make:()=>({ text:'루월당', sub:'', logo:'', right:'상담 신청' }) },
  image:    { name:'이미지',        ico:'▣', make:()=>({ src:'', alt:'상세 이미지', pad:false }) },
  headline: { name:'헤드라인',      ico:'T', make:()=>({ eyebrow:'사주 상담 · 직접 풀이', title:'당신의 흐름을\n읽어 드립니다', desc:'요약본이 아니라, 직접 풀어 적어 보내드립니다.', align:'left', size:26, hi:'' }) },
  freesaju: { name:'무료사주 맛보기', ico:'☾', make:()=>({ title:'무료 사주 먼저 보기', desc:'간단한 정보를 입력하면 나의 기본 사주와 올해 흐름을 무료로 확인할 수 있습니다.', cta:'무료로 사주 보기' }) },
  price:    { name:'가격',          ico:'₩', make:()=>({ badge:'이번 회차 · 선착순', cta:'상담 신청하기', items:[
                { name:'정밀 풀이', desc:'대운·세운까지 상세 분석', off:'40%', was:'50,000원', now:'29,800', best:true },
                { name:'기본 풀이', desc:'타고난 성향과 올해 흐름', off:'', was:'', now:'9,900', best:false },
              ] }) },
  countdown:{ name:'카운트다운',     ico:'⏱', make:()=>({ title:'이번 회차 접수 마감까지', note:'마감 후에는 다음 회차로 접수됩니다', mode:'cycle', cycle:24, anchor:'', hours:6, target:'',
                cdStyle:'urgent', numColor:'', boxColor:'', labColor:'', txtColor:'' }) },
  gauge:    { name:'남은 자리',      ico:'◐', make:()=>({ title:'남은 자리', total:30, note:'회차당 인원을 넘기면 풀이가 얕아집니다' }) },
  live:     { name:'접수 현황',      ico:'◉', make:()=>({ title:'접수 현황' }) },
  reviews:  { name:'받아본 이야기',   ico:'❝', make:()=>({ title:'받아본 이야기', view:'slide', items:[] }) },
  bullets:  { name:'이런 분들께',     ico:'✓', make:()=>({ title:'이런 분들이 찾아옵니다', items:['이직·창업 시기를 재고 있는 분','재회와 궁합의 결이 궁금한 분','올해 재물의 흐름을 보고 싶은 분'] }) },
  faq:      { name:'묻고 답하기',     ico:'?', make:()=>({ title:'묻고 답하기', items:[{q:'결과는 언제 받나요?',a:'접수 후 영업일 기준 1~2일 안에 보내드립니다.'}] }) },
  button:   { name:'버튼',           ico:'▭', make:()=>({ text:'상담 신청하기', action:'form', href:'' }) },
  form:     { name:'신청 폼',        ico:'▤', make:()=>({
                title:'상담 신청',
                kakaoAlt:'',
                products:['정밀 풀이 (29,800원)','기본 풀이 (9,900원)'],
                use:{gender:true,name:true,birth:true,cal:true,hour:true,region:true,phone:true,email:true,product:true,memo:true},
                agree:'수집항목: 이름, 생년월일, 연락처 · 수집목적: 상담 제공 · 보유기간: 상담 완료 후 1년',
                submit:'접수하기', done:'접수되었습니다. 풀이가 끝나는 대로 연락드리겠습니다.' }) },
  divider:  { name:'여백 · 선',       ico:'—', make:()=>({ h:28, line:true }) },
};
const ORDER = ['image','headline','freesaju','price','countdown','gauge','live','reviews','bullets','faq','button','form','divider','logobar'];
const B = (t) => Object.assign({ id: uid(), type: t }, DEFS[t].make());

/* ---------------- 스킨 ---------------- */
const SKINS = {
  moon:  { label:'월백 月白', sw:'linear-gradient(135deg,#fffdf9,#ece4d4)', accent:'#8a6a2f',
           v:{ bg:'#faf8f3', card:'#fff', text:'#1d1c19', sub:'#8b867c', line:'#e8e2d6', rd:'12px', btx:'#fff', disp:"'Gowun Batang',serif", body:'Pretendard,sans-serif' } },
  hanji: { label:'한지 韓紙', sw:'linear-gradient(135deg,#f4efe4,#ddd0b6)', accent:'#a9331f',
           v:{ bg:'#f3eee2', card:'#fbf8f1', text:'#1c1a16', sub:'#7e7768', line:'#ddd4c1', rd:'2px', btx:'#fbf8f1', disp:"'Nanum Myeongjo',serif", body:"'Nanum Myeongjo',Pretendard,serif" } },
  plain: { label:'담백 淡白', sw:'linear-gradient(135deg,#fff,#e3e7f0)', accent:'#2f3a5c',
           v:{ bg:'#fff', card:'#fff', text:'#14161c', sub:'#8b8f99', line:'#ecedf1', rd:'18px', btx:'#fff', disp:'Pretendard,sans-serif', body:'Pretendard,sans-serif' } },
  night: { label:'야행 夜行', sw:'linear-gradient(135deg,#0c0e14,#2a3145)', accent:'#c8a45c',
           v:{ bg:'#0d0f15', card:'#141821', text:'#e9e6dd', sub:'#8b8f9c', line:'#242a36', rd:'4px', btx:'#12141a', disp:"'Gowun Batang',serif", body:'Pretendard,sans-serif' } },
};

function pageCSS(t){
  const sk = SKINS[t.skin] || SKINS.moon, v = sk.v;
  const extra = {
    moon:`body{background:radial-gradient(140% 70% at 50% -10%,#fffdf8 0%,var(--bg) 60%)}.card{box-shadow:0 1px 2px rgba(29,28,25,.04),0 12px 30px -22px rgba(29,28,25,.35)}.hl{padding:40px 20px 28px}.gg .seg{display:none}`,
    hanji:`body{background-image:repeating-linear-gradient(90deg,rgba(0,0,0,.014) 0 1px,transparent 1px 3px)}.pr .bd{border:1px solid var(--ac);color:var(--ac);display:inline-block;padding:5px 9px}.gg .bar,.gg .moon{display:none}.sticky a,.go,.bt a,.fm .sub,.rv .bx{border-radius:0}`,
    plain:`.card,.rv .bx{border-color:transparent;box-shadow:0 2px 24px -14px rgba(20,22,28,.3),0 0 0 1px var(--ln)}.hl{padding:44px 20px 30px}.hl h1{font-weight:800;letter-spacing:-.035em;line-height:1.42}.gg .seg{display:none}.sticky{border-top:0}.sticky a{border-radius:99px}.go,.bt a,.fm .sub{border-radius:12px}`,
    night:`body{background:radial-gradient(120% 60% at 50% 0%,#171c28 0%,var(--bg) 55%)}.hl h1{text-shadow:0 0 40px rgba(200,164,92,.12)}.gg .seg{display:none}`,
  }[t.skin] || '';
  return `:root{--ac:${t.accent};--bg:${v.bg};--cd:${v.card};--tx:${v.text};--sb:${v.sub};--ln:${v.line};--rd:${v.rd};--btx:${v.btx}}
*{box-sizing:border-box;margin:0;padding:0}
body{background:var(--bg);color:var(--tx);font-family:${v.body};line-height:1.62}
img{max-width:100%;display:block}
.lp{max-width:480px;margin:0 auto;padding-bottom:100px;overflow:hidden}
.wrap{padding:0 20px}.mt{margin:16px 0}
.card{background:var(--cd);border:1px solid var(--ln);border-radius:var(--rd);overflow:hidden}
.lbar{display:flex;align-items:center;justify-content:space-between;padding:15px 20px;border-bottom:1px solid var(--ln);background:var(--bg)}
.lbar .lg{display:flex;align-items:center;gap:9px}.lbar .lg img{height:26px}
.lbar b{font-family:${v.disp};font-size:16px;font-weight:700;display:flex;align-items:baseline;gap:5px}
.lbar b i{font-style:normal;font-size:11px;letter-spacing:.16em;color:var(--sb);font-weight:400}
.lbar a{font-size:12px;font-weight:700;color:var(--ac);text-decoration:none;border-bottom:1px solid var(--ac);padding-bottom:2px}
.hl{padding:34px 20px 26px}
.hl .eb{font-size:11px;font-weight:700;letter-spacing:.18em;color:var(--ac);margin-bottom:14px}
.hl h1{font-family:${v.disp};font-weight:700;line-height:1.5;white-space:pre-line}
.hl h1 em{font-style:normal;color:var(--ac)}
.hl p{margin-top:14px;font-size:14px;color:var(--sb);white-space:pre-line}
.pr{padding:22px 20px}
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
.pr .now{font-family:${v.disp};font-size:34px;font-weight:700;margin-left:auto}
.pr .now small{font-size:15px}
.go{display:block;margin-top:14px;padding:16px;border-radius:var(--rd);background:var(--ac);color:var(--btx);font-size:15.5px;font-weight:800;text-align:center;text-decoration:none;letter-spacing:.02em}
.cd{padding:22px 20px;text-align:center}
.cd .t{font-size:11.5px;font-weight:700;letter-spacing:.14em;color:var(--ctxt,var(--sb));margin-bottom:16px}
.cd .digits{display:flex;justify-content:center;align-items:baseline;gap:10px;font-family:${v.disp}}
.cd .u b{font-size:36px;font-weight:700;font-variant-numeric:tabular-nums;color:var(--cnum,var(--tx))}.cd .u span{font-size:10px;color:var(--sb)}
.cd .cl{color:var(--ln);font-size:22px}
.cd .note{margin-top:16px;padding-top:14px;border-top:1px solid var(--ln);font-size:12px;color:var(--ctxt,var(--sb))}
.cd.box .digits,.cd.urgent .digits{gap:7px;align-items:center}
.cd.box .u,.cd.urgent .u{background:var(--cbox,#1c1a17);border-radius:10px;padding:11px 6px 8px;min-width:60px}
.cd.box .u b,.cd.urgent .u b{display:block;font-size:30px;color:var(--cnum,#fff)}
.cd.box .u span,.cd.urgent .u span{display:block;margin:2px 0 0;font-size:9.5px;color:var(--clab,rgba(255,255,255,.55))}
.cd.box .cl,.cd.urgent .cl{color:var(--cbox,#1c1a17);font-size:18px;font-weight:800;opacity:.45}
.cd.urgent .t{color:var(--ctxt,var(--cbox,#c0392b));font-weight:800}
.cd.urgent .note{color:var(--ctxt,var(--cbox,#c0392b));font-weight:700;border-top-color:var(--ctxt,var(--cbox,#c0392b));opacity:.85}
.cd.urgent .u{animation:cdpulse 1.6s ease-in-out infinite}
.cd.urgent .u:last-of-type b{animation:cdblink 1s steps(2,start) infinite}
@keyframes cdpulse{0%,100%{transform:scale(1)}50%{transform:scale(1.045)}}
@keyframes cdblink{50%{opacity:.35}}
.gg{padding:22px 20px;display:flex;align-items:center;gap:18px}
.gg .moon{flex:none;width:62px;height:62px}.gg .body{flex:1}
.gg .top{display:flex;align-items:baseline;justify-content:space-between}
.gg .top span{font-size:11.5px;font-weight:700;letter-spacing:.14em;color:var(--sb)}
.gg .top em{font-family:${v.disp};font-style:normal;font-size:24px;font-weight:700;color:var(--ac)}
.gg .top em i{font-style:normal;font-size:13px;color:var(--sb)}
.gg .note{margin-top:8px;font-size:12px;color:var(--sb)}
.gg .seg{display:flex;gap:3px;margin-top:10px}.gg .seg i{flex:1;height:6px;background:var(--ln)}.gg .seg i.on{background:var(--ac)}
.gg .bar{height:3px;background:var(--ln);margin-top:12px}.gg .bar i{display:block;height:100%;background:var(--ac)}
.lv .h{display:flex;align-items:center;gap:8px;padding:14px 18px;border-bottom:1px solid var(--ln);font-size:11.5px;font-weight:700;letter-spacing:.14em;color:var(--sb)}
.lv .dot{width:6px;height:6px;border-radius:50%;background:var(--ac)}
.lv .tag{margin-left:auto;font-size:10px;color:var(--ac)}
.lv .none{padding:22px 18px;text-align:center;color:var(--sb);font-size:12.5px}
.rv{padding:10px 0}
.rv h3{font-family:${v.disp};font-size:11.5px;font-weight:700;letter-spacing:.16em;color:var(--sb);padding:0 20px;margin-bottom:14px}
.rv .it{padding:0 20px;margin-bottom:10px}
.rv .bx{padding:20px;border:1px solid var(--ln);border-radius:var(--rd);background:var(--cd)}
.rv .qt{font-family:${v.disp};font-size:15px;line-height:1.85}
.rv .hd{display:flex;gap:8px;margin-top:14px;padding-top:12px;border-top:1px solid var(--ln);font-size:11.5px;color:var(--sb)}
.rv .hd b{color:var(--tx)}.rv .star{margin-left:auto;color:var(--ac);font-size:9px}
.bl{padding:24px 20px}
.bl h3,.fq h3{font-family:${v.disp};font-size:18px;font-weight:700;margin-bottom:16px}
.bl li{list-style:none;display:flex;gap:12px;padding:10px 0;font-size:14.5px;border-bottom:1px solid var(--ln)}
.bl li:before{content:"—";color:var(--ac)}.bl li:last-child{border-bottom:0}
.fq{padding:24px 20px}
.fq details{border-bottom:1px solid var(--ln);padding:13px 0}
.fq summary{font-size:14.5px;font-weight:700;cursor:pointer;display:flex;justify-content:space-between}
.fq summary::-webkit-details-marker{display:none}
.fq summary:after{content:"+";color:var(--ac)}
.fq p{margin-top:10px;font-size:13.5px;color:var(--sb)}
.bt{padding:6px 20px}
.bt a{display:block;padding:16px;border-radius:var(--rd);background:var(--ac);color:var(--btx);font-weight:800;font-size:15px;text-align:center;text-decoration:none}
.fs{padding:24px 20px;text-align:center}
.fs h3{font-family:${v.disp};font-size:19px;font-weight:700;margin-bottom:10px}
.fs p{font-size:13.5px;color:var(--sb);margin-bottom:18px}
.fs a{display:block;padding:15px;border:1px solid var(--ac);border-radius:var(--rd);color:var(--ac);font-weight:800;font-size:15px;text-decoration:none}
.fm{padding:26px 20px}
.fm h3{font-family:${v.disp};font-size:19px;font-weight:700;margin-bottom:20px}
.fm .g{margin-bottom:17px}
.fm .lb{font-size:11.5px;font-weight:700;color:var(--sb);margin-bottom:8px;display:block}
.fm .lb i{color:var(--ac);font-style:normal;margin-left:3px}
.fm input,.fm select,.fm textarea{width:100%;padding:12px;border:1px solid var(--ln);border-radius:var(--rd);font-size:14px;background:transparent;color:var(--tx);font-family:inherit}
.fm .seg{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.fm .seg.c3{grid-template-columns:repeat(3,1fr)}
.fm .seg label{border:1px solid var(--ln);border-radius:var(--rd);padding:12px;text-align:center;font-size:13.5px}
.fm .seg input{display:none}
.fm .g3{display:grid;grid-template-columns:1.2fr 1fr 1fr;gap:7px}
.fm .tip{font-size:11px;color:var(--sb);margin-top:7px}
.fm .ag{display:flex;gap:9px;font-size:11.5px;color:var(--sb)}
.fm .ag input{width:16px;height:16px;flex:none;margin-top:2px}
.fm .sub{width:100%;padding:17px;border:0;border-radius:var(--rd);background:var(--ac);color:var(--btx);font-size:16px;font-weight:800;font-family:inherit}
.sticky{position:fixed;left:0;right:0;bottom:0;background:var(--bg);border-top:1px solid var(--ln);padding:12px 20px}
.sticky a{display:block;max-width:440px;margin:0 auto;padding:16px;border-radius:var(--rd);background:var(--ac);color:var(--btx);font-size:15.5px;font-weight:800;text-align:center;text-decoration:none}
${extra}`;
}

const SAMPLE_LIVE = [
  { name:'김*희', phone:'010-****-3421', status:'접수완료', ago:'방금' },
  { name:'이*준', phone:'010-****-8892', status:'풀이중', ago:'1분 전' },
  { name:'박*영', phone:'010-****-2341', status:'접수완료', ago:'4분 전' },
];

function moonSVG(pct){
  const cut = 52*(1-pct/100);
  return `<svg class="moon" viewBox="0 0 60 60"><defs><clipPath id="mc"><rect x="0" y="${4+cut}" width="60" height="60"/></clipPath></defs>
  <circle cx="30" cy="30" r="26" fill="none" stroke="var(--ln)"/><circle cx="30" cy="30" r="26" fill="var(--ac)" clip-path="url(#mc)" opacity=".92"/></svg>`;
}

function renderBlock(b, S){
  const sk = S.theme.skin;
  switch(b.type){
    case 'logobar':
      return `<div class="lbar"><span class="lg">${b.logo?`<img src="${b.logo}">`:''}<b>${esc(b.text)}${b.sub?`<i>${esc(b.sub)}</i>`:''}</b></span>${b.right?`<a href="#">${esc(b.right)}</a>`:''}</div>`;
    case 'image':
      if(!b.src) return `<div class="wrap mt"><div class="card" style="padding:46px;text-align:center;color:var(--sb);font-size:12.5px">이미지를 올려주세요</div></div>`;
      return b.pad ? `<div class="wrap mt"><img class="card" src="${b.src}"></div>` : `<img src="${b.src}" style="width:100%">`;
    case 'headline':{
      let t = esc(b.title);
      if(b.hi) t = t.split(esc(b.hi)).join(`<em>${esc(b.hi)}</em>`);
      return `<div class="hl" style="text-align:${b.align}">${b.eyebrow?`<div class="eb">${esc(b.eyebrow)}</div>`:''}<h1 style="font-size:${b.size||26}px">${t}</h1>${b.desc?`<p>${esc(b.desc)}</p>`:''}</div>`;
    }
    case 'freesaju':
      return `<div class="wrap mt"><div class="card fs"><h3>${esc(b.title)}</h3><p>${esc(b.desc)}</p><a href="#">${esc(b.cta)}</a></div></div>`;
    case 'price': {
      // 구버전(단일 가격) 호환
      const items = b.items && b.items.length ? b.items
        : [{ name:'상담', desc:'', off:b.off, was:b.was, now:b.now, best:false }];
      return `<div class="wrap mt">
        ${b.badge?`<div class="prbadge">${esc(b.badge)}</div>`:''}
        ${items.map(x=>`<div class="card pr ${x.best?'best':''}">
          ${x.best?`<span class="bestbadge">추천</span>`:''}
          <div class="pname">${esc(x.name)}</div>
          ${x.desc?`<div class="pdesc">${esc(x.desc)}</div>`:''}
          <div class="amt">${x.off?`<span class="off">${esc(x.off)}</span>`:''}${x.was?`<span class="was">${esc(x.was)}</span>`:''}<span class="now">${esc(x.now)}<small>원</small></span></div>
        </div>`).join('')}
        <a class="go" href="#">${esc(b.cta)}</a></div>`;
    }
    case 'countdown':{
      // 실제 페이지와 같은 계산으로 미리보기
      let end;
      if(b.mode==='cycle'){
        const P=(Number(b.cycle)||24)*3600*1000;
        const a=b.anchor?new Date(b.anchor).getTime():new Date().setHours(0,0,0,0);
        end=a+(Math.floor((Date.now()-a)/P)+1)*P;
      } else if(b.mode==='fixed'&&b.target){ end=new Date(b.target).getTime(); }
      else { end=Date.now()+(Number(b.hours)||6)*3600*1000; }
      const L=Math.max(0,end-Date.now())/1000|0;
      const p=n=>String(n).padStart(2,'0');
      const sty=b.cdStyle||'plain';
      const vars=[b.numColor?`--cnum:${esc(b.numColor)}`:'',b.boxColor?`--cbox:${esc(b.boxColor)}`:'',b.labColor?`--clab:${esc(b.labColor)}`:'',b.txtColor?`--ctxt:${esc(b.txtColor)}`:''].filter(Boolean).join(';');
      return `<div class="wrap mt"><div class="card cd ${sty}" ${vars?`style="${vars}"`:''}><div class="t">${esc(b.title)}</div>
        <div class="digits"><div class="u"><b>${p(L/86400|0)}</b><span>일</span></div><div class="cl">·</div><div class="u"><b>${p((L%86400)/3600|0)}</b><span>시</span></div><div class="cl">·</div><div class="u"><b>${p((L%3600)/60|0)}</b><span>분</span></div><div class="cl">·</div><div class="u"><b>${p(L%60)}</b><span>초</span></div></div>
        ${b.note?`<div class="note">${esc(b.note)}</div>`:''}</div></div>`;
    }
    case 'gauge':{
      const total = Math.max(1, Number(b.total)||30);
      const left = total; // 미리보기: 아직 신청 0건 기준
      const pct = 100;
      const segs = Array.from({length:10},(_,i)=>`<i class="${i<10?'on':''}"></i>`).join('');
      return `<div class="wrap mt"><div class="card gg">${sk==='hanji'?'':moonSVG(pct)}
        <div class="body"><div class="top"><span>${esc(b.title)}</span><em>${left}<i> / ${total}명</i></em></div>
        ${sk==='hanji'?`<div class="seg">${segs}</div>`:`<div class="bar"><i style="width:${pct}%"></i></div>`}
        <div class="note">${esc(b.note)}</div></div></div></div>`;
    }
    case 'live':{
      const rows = SAMPLE_LIVE.map(x=>`<li style="display:flex;align-items:center;gap:11px;padding:0 18px;height:44px;list-style:none">
        <span style="width:24px;height:24px;border:1px solid var(--ln);color:var(--sb);display:grid;place-items:center;font-size:11px;font-weight:700;flex:none">${x.name[0]}</span>
        <span style="font-size:12.5px;font-weight:700">${x.name}<span style="font-size:11px;color:var(--sb);margin-left:6px;font-weight:400">${x.phone}</span></span>
        <span style="margin-left:auto;font-size:10.5px;font-weight:700;color:var(--ac)">${x.status}</span>
        <span style="font-size:10.5px;color:var(--sb);width:52px;text-align:right">${x.ago}</span></li>`).join('');
      return `<div class="wrap mt"><div class="card lv"><div class="h"><span class="dot"></span>${esc(b.title)}<span class="tag">LIVE</span></div>
        <ul style="padding:0;margin:0">${rows}</ul>
        <div style="padding:9px 18px;border-top:1px solid var(--ln);font-size:11px;color:var(--sb);text-align:center">※ 실제 신청이 들어오면 이 자리에 표시됩니다 (미리보기는 예시)</div></div></div>`;
    }
    case 'reviews':{
      const items = b.items||[];
      if(!items.length) return `<div class="wrap mt"><div class="card" style="padding:24px;text-align:center;color:var(--sb);font-size:12.5px">후기를 추가하면 여기에 표시됩니다</div></div>`;
      const stars = r => '●'.repeat(Math.round(r||5)) + '○'.repeat(5-Math.round(r||5));
      const VIEW = b.view || 'slide';
      return `<div class="rv mt">${b.title?`<h3>${esc(b.title)}</h3>`:''}
        ${items.map(x=>`<div class="it"><div class="bx"><div class="qt">“${esc(x.t)}”</div>
        <div class="hd"><b>${esc(x.n)}</b><span class="star">${stars(x.r)}</span></div></div></div>`).join('')}</div>`;
    }
    case 'bullets':
      return `<div class="wrap mt"><div class="card bl"><h3>${esc(b.title)}</h3><ul style="padding:0">${(b.items||[]).map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div></div>`;
    case 'faq':
      return `<div class="wrap mt"><div class="card fq"><h3>${esc(b.title)}</h3>${(b.items||[]).map(x=>`<details><summary>${esc(x.q)}</summary><p>${esc(x.a)}</p></details>`).join('')}</div></div>`;
    case 'button':
      return `<div class="bt mt"><a href="#">${esc(b.text)}</a></div>`;
    case 'divider':
      return `<div class="wrap"><div style="height:${b.h||24}px;${b.line?'border-bottom:1px solid var(--ln);':''}"></div></div>`;
    case 'form':{
      const u = b.use||{};
      let f='';
      if(u.name) f+=`<div class="g"><span class="lb">이름<i>*</i></span><input placeholder="홍길동"></div>`;
      if(u.gender) f+=`<div class="g"><span class="lb">성별<i>*</i></span><div class="seg"><label>남성</label><label>여성</label></div></div>`;
      if(u.birth) f+=`<div class="g"><span class="lb">생년월일<i>*</i></span><div class="g3"><select><option>년</option></select><select><option>월</option></select><select><option>일</option></select></div></div>`;
      if(u.cal) f+=`<div class="g"><span class="lb">달력<i>*</i></span><div class="seg c3"><label>양력</label><label>음력</label><label>윤달</label></div></div>`;
      if(u.hour) f+=`<div class="g"><span class="lb">태어난 시각</span><select><option>모름 / 선택 안함</option></select></div>`;
      if(u.region) f+=`<div class="g"><span class="lb">태어난 지역</span><select><option>서울특별시</option></select></div>`;
      if(u.phone) f+=`<div class="g"><span class="lb">연락처<i>*</i></span><input placeholder="010-0000-0000"></div>`;
      if(u.email) f+=`<div class="g"><span class="lb">이메일</span><input placeholder="example@naver.com"></div>`;
      if(u.product) f+=`<div class="g"><span class="lb">상품<i>*</i></span><select>${(b.products||[]).map(p=>`<option>${esc(p)}</option>`).join('')}</select></div>`;
      if(u.memo) f+=`<div class="g"><span class="lb">묻고 싶은 것</span><textarea placeholder="가장 궁금한 한 가지를 적어주세요"></textarea></div>`;
      f+=`<div class="g"><label class="ag"><input type="checkbox"><span><b>개인정보 수집 및 이용 동의</b><br>${esc(b.agree)}</span></label></div>`;
      return `<div class="wrap mt"><div class="card fm"><h3>${esc(b.title)}</h3>${f}<button class="sub">${esc(b.submit)}</button></div></div>`;
    }
  }
  return '';
}

function buildPreview(S){
  const body = S.blocks.map(b=>renderBlock(b,S)).join('\n');
  const st = S.sticky||{};
  const sticky = st.on ? `<div class="sticky"><a href="#">${esc(st.text)}</a></div>` : '';
  return `<!DOCTYPE html><html lang="ko"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<link href="https://fonts.googleapis.com/css2?family=Gowun+Batang:wght@400;700&family=Nanum+Myeongjo:wght@400;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css">
<style>${pageCSS(S.theme)}</style></head><body><div class="lp">${body}</div>${sticky}</body></html>`;
}

/* ---------------- 상태 ---------------- */
let S = null;
let sel = null;
const pv = $('#pv'), blocklist = $('#blocklist'), inspector = $('#inspector');
const refresh = () => { pv.srcdoc = buildPreview(S); };
const paint = () => { refresh(); paintList(); paintInspector(); };

/* ---------------- 목록 ---------------- */
function paintList(){
  blocklist.innerHTML = S.blocks.map(b=>`
    <div class="bitem ${b.id===sel?'sel':''}" draggable="true" data-id="${b.id}">
      <span class="ico">${DEFS[b.type]?DEFS[b.type].ico:'?'}</span>
      <span class="nm">${DEFS[b.type]?DEFS[b.type].name:b.type}</span>
      <button class="x" data-del="${b.id}">×</button></div>`).join('') + `
    <div class="bitem ${sel==='__page'?'sel':''}" data-id="__page" style="margin-top:10px;border-top:1px solid var(--line);border-radius:0;padding-top:12px">
      <span class="ico">⚙</span><span class="nm">스킨 · 페이지 설정</span></div>`;

  blocklist.querySelectorAll('.bitem').forEach(el=>{
    el.onclick = e=>{ if(e.target.dataset.del) return; sel = el.dataset.id; paintList(); paintInspector(); };
    el.ondragstart = e=>{ e.dataTransfer.setData('text/plain', el.dataset.id); el.classList.add('drag'); };
    el.ondragend = ()=> blocklist.querySelectorAll('.bitem').forEach(x=>x.classList.remove('drag','over'));
    el.ondragover = e=>{ e.preventDefault(); el.classList.add('over'); };
    el.ondragleave = ()=> el.classList.remove('over');
    el.ondrop = e=>{
      e.preventDefault(); el.classList.remove('over');
      const from=e.dataTransfer.getData('text/plain'), to=el.dataset.id;
      if(from===to||to==='__page') return;
      const a=S.blocks.findIndex(b=>b.id===from), c=S.blocks.findIndex(b=>b.id===to);
      if(a<0||c<0) return;
      const [m]=S.blocks.splice(a,1); S.blocks.splice(c,0,m); paint();
    };
  });
  blocklist.querySelectorAll('[data-del]').forEach(btn=> btn.onclick = e=>{
    e.stopPropagation();
    S.blocks = S.blocks.filter(b=>b.id!==btn.dataset.del);
    if(sel===btn.dataset.del) sel = S.blocks[0]?.id || '__page';
    paint();
  });
}

$('#addgrid').innerHTML = ORDER.map(t=>`<button data-add="${t}"><span>${DEFS[t].ico}</span>${DEFS[t].name}</button>`).join('');
$('#addgrid').onclick = e=>{
  const t = e.target.closest('[data-add]')?.dataset.add; if(!t) return;
  const nb = B(t), i = S.blocks.findIndex(b=>b.id===sel);
  S.blocks.splice(i<0?S.blocks.length:i+1, 0, nb);
  sel = nb.id; paint(); toast(DEFS[t].name+' 추가됨');
};

/* ---------------- 인스펙터 ---------------- */
function paintInspector(){
  if(sel==='__page') return pageInspector();
  const b = S.blocks.find(x=>x.id===sel);
  if(!b){ inspector.innerHTML = `<div class="empty">왼쪽에서 블록을 골라주세요</div>`; return; }
  const D = DEFS[b.type] || { name:b.type, ico:'?' };
  let h = `<div class="sec" style="border-top:0;margin-top:0">${D.ico} ${D.name}</div>`;
  const T=(k,l,ph='')=>`<div class="fld"><label>${l}</label><input type="text" data-k="${k}" value="${esc(b[k])}" placeholder="${ph}"></div>`;
  const A=(k,l)=>`<div class="fld"><label>${l}</label><textarea data-k="${k}">${esc(b[k])}</textarea></div>`;
  const N=(k,l)=>`<div class="fld"><label>${l}</label><input type="number" data-k="${k}" value="${esc(b[k])}"></div>`;
  const SL=(k,l,o)=>`<div class="fld"><label>${l}</label><select data-k="${k}">${o.map(([v,n])=>`<option value="${v}" ${b[k]===v?'selected':''}>${n}</option>`).join('')}</select></div>`;
  const CK=(k,l)=>`<label class="sw"><input type="checkbox" data-k="${k}" ${b[k]?'checked':''}>${l}</label>`;
  // 색상 (비우면 테마색 사용)
  const C=(k,l)=>`<div class="fld"><label>${l}</label>
    <div class="colorrow">
      <input type="color" data-k="${k}" value="${esc(b[k]||'#c0392b')}">
      <input type="text" data-k="${k}" value="${esc(b[k])}" placeholder="비우면 기본색" style="flex:1">
      <button class="btn sm" data-clear="${k}">지우기</button>
    </div></div>`;

  switch(b.type){
    case 'logobar':
      h += T('text','로고 텍스트') + T('sub','한자 · 부제 (선택)')
        + `<div class="fld"><label>로고 이미지 (선택)</label>${b.logo?`<img class="thumb" src="${b.logo}">`:''}
           <div class="drop" data-img="logo">${b.logo?'이미지 교체':'클릭해서 로고 올리기'}</div>
           ${b.logo?`<button class="btn sm danger" data-clear="logo" style="margin-top:6px;width:100%">로고 제거</button>`:''}</div>`
        + T('right','오른쪽 링크 문구 (비우면 숨김)');
      break;
    case 'image':
      h += `<div class="fld">${b.src?`<img class="thumb" src="${b.src}">`:''}
        <div class="drop" data-img>${b.src?'이미지 교체':'클릭해서 이미지 올리기'}</div>
        <div class="hint">상세 이미지를 순서대로 쌓으면 됩니다. 3MB 이하 권장.</div></div>`
        + T('alt','대체 텍스트') + CK('pad','좌우 여백 + 테두리');
      break;
    case 'headline':
      h += T('eyebrow','윗줄 (비우면 숨김)') + A('title','제목 · 줄바꿈 가능')
        + T('hi','강조할 단어','제목 안의 단어를 적으면 색이 들어갑니다')
        + A('desc','설명') + N('size','글자 크기 (px)')
        + SL('align','정렬',[['left','왼쪽'],['center','가운데']]);
      break;
    case 'freesaju':
      h += T('title','제목') + A('desc','설명') + T('cta','버튼 문구')
        + `<div class="fld"><div class="hint">이 버튼을 누르면 <b>무료사주 페이지</b>로 이동합니다. AI가 사주팔자를 계산해서 풀이해줍니다.</div></div>`;
      break;
    case 'price':
      // 구버전(단일 가격)이면 items 로 옮겨준다
      if(!b.items || !b.items.length){
        b.items = [{ name:'상담', desc:'', off:b.off||'', was:b.was||'', now:b.now||'', best:false }];
      }
      h += A('badge','배지 문구 (상품 목록 위)')
        + `<div class="sec">상품 (여러 개 추가 가능)</div>`
        + listEditor(b, [
            ['name','상품명', 'text', NAME_SG],
            ['desc','한 줄 설명', 'text', DESC_SG],
            ['off','할인율 (예: 40%) — 없으면 비움'],
            ['was','정가 (예: 50,000원) — 없으면 비움'],
            ['now','판매가 — 할인율·정가 넣으면 자동 계산'],
            ['best','⭐ 추천 뱃지 달기','check'],
          ], { name:'', desc:'', off:'', was:'', now:'', best:false })
        + T('cta','버튼 문구');
      break;
    case 'countdown':
      h += T('title','제목') + T('note','하단 문구')
        + SL('mode','방식',[
            ['cycle','반복 — 주기마다 자동 재시작'],
            ['fixed','고정 마감일시 (1회)'],
            ['rolling','접속할 때마다 재시작'],
          ])
        + (b.mode==='cycle'
            ? N('cycle','반복 주기 (시간)')
              + `<div class="fld"><label>기준 시각 (비우면 매일 자정 기준)</label><input type="datetime-local" data-k="anchor" value="${esc(b.anchor)}"></div>`
              + `<div class="fld"><div class="hint">예) 주기 <b>24</b> → 자정마다 24시간 카운트다운이 새로 시작됩니다. 매번 설정할 필요 없습니다.<br>예) 주기 <b>168</b> → 일주일 단위로 반복됩니다.<br>모든 방문자가 <b>같은 남은 시간</b>을 봅니다.</div></div>`
            : b.mode==='fixed'
              ? `<div class="fld"><label>마감 일시</label><input type="datetime-local" data-k="target" value="${esc(b.target)}"></div>`
              : N('hours','남은 시간 (시간)'))
        + `<div class="fld"><div class="hint">⚠️ <b>접속할 때마다 재시작</b>은 사람마다 다른 시간이 보이고 새로고침하면 리셋됩니다. 실제 마감이 없는 타이머는 표시광고법 이슈가 될 수 있으니 <b>반복</b>이나 <b>고정 일시</b>를 쓰세요.</div></div>`
        + `<div class="sec">디자인</div>`
        + SL('cdStyle','스타일',[
            ['urgent','긴박 — 박스 + 고동 + 초 깜빡임'],
            ['box','박스형 — 숫자를 색 박스에'],
            ['plain','기본 — 숫자만'],
          ])
        + `<div class="sec" style="border-top:0;padding-top:4px">숫자 · 박스 색</div>`
        + (b.cdStyle==='plain'
            ? C('numColor','숫자 색')
            : C('boxColor','박스 색') + C('numColor','숫자 색') + C('labColor','단위(일/시/분/초) 색'))
        + `<div class="sec">제목 · 하단 문구 색</div>`
        + C('txtColor','제목과 하단 문구 색 (위 박스 색과 별개)')
        + `<div class="fld"><div class="hint">색을 비워두면 테마 색을 따라갑니다. 교육생마다 다른 색을 쓰면 페이지가 서로 달라 보입니다.</div></div>`;
      break;
    case 'gauge':
      h += T('title','제목') + N('total','모집 인원 (전체)') + T('note','설명')
        + `<div class="fld"><div class="hint">남은 자리는 <b>실제 신청 건수</b>로 자동 계산됩니다. 예: 30명 모집 · 4명 신청 → 남은 자리 26명. 가짜 숫자가 아닙니다.</div></div>`;
      break;
    case 'live':
      h += T('title','제목')
        + `<div class="fld"><div class="hint"><b>실제 신청 내역</b>이 자동으로 표시됩니다. 이름·전화번호는 자동 마스킹(김*희 / 010-****-3421). 신청이 없으면 "접수 내역이 없습니다"로 표시됩니다.</div></div>`;
      break;
    case 'reviews':
      h += T('title','섹션 제목')
        + SL('view','보여주는 방식',[
            ['slide','슬라이드 — 옆으로 넘기기'],
            ['list','목록 — 위아래로 쭉 (다 보임)'],
            ['grid','카드 2열 — 한눈에'],
          ])
        + `<div class="fld">
             <button class="btn sm" data-pull-rv style="width:100%">받은 후기 불러오기</button>
             <div class="hint"><a href="/reviews" target="_blank" style="color:var(--moon)">후기 메뉴</a>에서
               <b>홈페이지에 넣기</b>를 켠 것만 들어옵니다. 끄면 여기서도 빠집니다.</div>
           </div>`
        + listEditor(b,[['n','작성자'],['r','별점 1~5'],['t','내용','area']],{n:'',r:5,t:''});
      break;
    case 'bullets': h += T('title','제목') + strListEditor(b,'items','항목'); break;
    case 'faq':     h += T('title','제목') + listEditor(b,[['q','질문'],['a','답변','area']],{q:'',a:''}); break;
    case 'button':
      h += T('text','버튼 문구') + SL('action','동작',[['form','신청 폼으로 이동'],['link','외부 링크']])
        + (b.action==='link' ? T('href','링크 URL','https://pf.kakao.com/...') : '');
      break;
    case 'divider': h += N('h','높이 (px)') + CK('line','선 표시'); break;
    case 'form':
      h += T('title','폼 제목')
        + `<div class="sec">입력 항목</div>`
        + Object.entries({name:'이름',gender:'성별',birth:'생년월일',cal:'양력/음력/윤달',hour:'태어난 시각',region:'태어난 지역',phone:'연락처',email:'이메일',product:'상품 선택',memo:'묻고 싶은 것'})
            .map(([k,l])=>`<label class="sw"><input type="checkbox" data-use="${k}" ${b.use[k]?'checked':''}>${l}</label>`).join('')
        + `<div class="sec">상품</div>` + strListEditor(b,'products','상품명 (가격 포함)')
        + `<div class="sec">문구</div>` + T('submit','버튼 문구') + A('agree','개인정보 동의문') + A('done','완료 문구')
        + `<div class="fld"><label>번호 남기기 싫은 분을 위한 카톡 링크</label>
             <input type="text" data-k="kakaoAlt" value="${esc(b.kakaoAlt)}" placeholder="https://open.kakao.com/o/...">
             <div class="hint">연락처 칸 아래에 <b>"번호를 남기기 어려우시면 카카오톡으로 문의해주세요"</b> 안내가 뜹니다.
             비워두면 안 나옵니다.</div></div>`
        + `<div class="fld"><div class="hint">신청이 들어오면 <b>신청 내역</b> 메뉴에서 바로 확인할 수 있습니다.<br>
             연락처와 이메일은 <b>둘 다 필수</b>입니다. 복채 안내는 문자로, 리포트는 메일로 갑니다.</div></div>`;
      break;
  }
  inspector.innerHTML = h;
  bindFields(b);
}

function pageInspector(){
  const t = S.theme, m = S.meta, st = S.sticky;
  const ELEMS = [['#3f9d6b','목 木'],['#c0392b','화 火'],['#c8a45c','토 土'],['#9aa5b1','금 金'],['#3b4fa0','수 水']];
  inspector.innerHTML = `
  <div class="sec" style="border-top:0;margin-top:0">스킨</div>
  <div class="fld"><div class="skins">
    ${Object.entries(SKINS).map(([k,s])=>`<button data-skin="${k}" class="${t.skin===k?'on':''}"><i style="background:${s.sw}"></i>${s.label}</button>`).join('')}
  </div><div class="hint">스킨마다 레이아웃·서체가 전부 다릅니다.</div></div>
  <div class="sec">색</div>
  <div class="fld"><label>메인 색 · 오행에서 고르기</label>
    <div class="colorrow"><input type="color" data-t="accent" value="${t.accent}"><input type="text" data-t="accent" value="${t.accent}"></div>
    <div class="elem">${ELEMS.map(([c,n])=>`<button title="${n}" data-elem="${c}" class="${t.accent.toLowerCase()===c?'on':''}" style="background:${c}"></button>`).join('')}</div></div>
  <div class="sec">페이지 정보</div>
  <div class="fld"><label>제목 (브라우저 탭 · 공유)</label><input type="text" data-m="title" value="${esc(m.title)}"></div>
  <div class="fld"><label>공유 문구</label><input type="text" data-m="desc" value="${esc(m.desc)}"></div>
  <div class="sec">하단 고정 버튼</div>
  <label class="sw"><input type="checkbox" data-s="on" ${st.on?'checked':''}>스티키 CTA 사용</label>
  <div class="fld"><label>문구</label><input type="text" data-s="text" value="${esc(st.text)}"></div>
  <div class="fld"><label>동작</label><select data-s="action">
    <option value="form" ${st.action==='form'?'selected':''}>신청 폼으로 이동</option>
    <option value="link" ${st.action==='link'?'selected':''}>외부 링크 (카톡 채널 등)</option></select></div>
  ${st.action==='link'?`<div class="fld"><label>링크 URL</label><input type="text" data-s="href" value="${esc(st.href||'')}" placeholder="https://pf.kakao.com/..."></div>`:''}`;

  inspector.querySelectorAll('[data-skin]').forEach(el=> el.onclick = ()=>{
    S.theme.skin = el.dataset.skin;
    S.theme.accent = SKINS[el.dataset.skin].accent;
    paint(); toast(SKINS[el.dataset.skin].label+' 적용');
  });
  inspector.querySelectorAll('[data-m]').forEach(el=> el.oninput = ()=>{ S.meta[el.dataset.m]=el.value; refresh(); });
  inspector.querySelectorAll('[data-t]').forEach(el=> el.oninput = ()=>{ S.theme[el.dataset.t]=el.value; refresh(); });
  inspector.querySelectorAll('[data-elem]').forEach(el=> el.onclick = ()=>{ S.theme.accent = el.dataset.elem; paint(); });
  inspector.querySelectorAll('[data-s]').forEach(el=> el.oninput = ()=>{
    S.sticky[el.dataset.s] = el.type==='checkbox' ? el.checked : el.value;
    refresh();
    if(['action','on'].includes(el.dataset.s)) paintInspector();
  });
}

/* --- 리스트 에디터 --- */
/* 상품명 · 설명 추천 문구 */
const NAME_SG = ['종합 사주','정밀 풀이','기본 풀이','신년 운세','연인 궁합','재물운','취업·이직운','재회 상담'];
const DESC_SG = [
  '대운·세운까지 상세 분석',
  '타고난 성향과 올해 흐름',
  '연애·궁합과 인연의 시기',
  '재물의 흐름과 직업 방향',
  '올해 한 해 운의 전체 흐름',
  '결과 PDF + 추가 질문 무제한',
  '태어난 시각까지 짚는 정밀 풀이',
  '고민 한 가지 집중 상담',
];

/* 숫자만 뽑기: "50,000원" → 50000, "40%" → 40 */
const numOf = (v) => {
  const d = String(v || '').replace(/[^0-9.]/g, '');
  return d ? parseFloat(d) : NaN;
};
/* 할인율 + 정가 → 판매가 (100원 단위 반올림) */
function calcNow(item){
  const was = numOf(item.was), off = numOf(item.off);
  if (!isFinite(was) || !isFinite(off) || off <= 0 || off >= 100) return null;
  const v = Math.round(was * (1 - off / 100) / 100) * 100;
  return v.toLocaleString('ko-KR');
}
/* 할인율 + 판매가 → 정가 (역산) */
function calcWas(item){
  const now = numOf(item.now), off = numOf(item.off);
  if (!isFinite(now) || !isFinite(off) || off <= 0 || off >= 100 || now <= 0) return null;
  const v = Math.round(now / (1 - off / 100) / 100) * 100;
  return v.toLocaleString('ko-KR') + '원';
}

function listEditor(b, fields, blank){
  const items = b.items||[];
  return `<div class="fld"><label>항목 ${items.length}개</label><div class="listbox">
    ${items.map((it,i)=>`<div class="litem">
      <div class="lhead"><b>#${i+1}</b><button class="btn sm danger" data-li-del="${i}">삭제</button></div>
      ${fields.map(([k,l,ty,sg])=> ty==='area'
        ? `<textarea data-li="${i}" data-lk="${k}" placeholder="${l}">${esc(it[k])}</textarea>`
        : ty==='check'
          ? `<label class="sw" style="padding:4px 0"><input type="checkbox" data-li="${i}" data-lk="${k}" ${it[k]?'checked':''}>${l}</label>`
          : `<input type="text" data-li="${i}" data-lk="${k}" value="${esc(it[k])}" placeholder="${l}">`
            + (sg && sg.length ? `<div class="chips">${sg.map(x=>`<button type="button" class="chip" data-sg="${i}" data-sk="${k}" data-sv="${esc(x)}">${esc(x)}</button>`).join('')}</div>` : '')
        ).join('')}
    </div>`).join('')}
    <button class="btn sm" data-li-add style="width:100%">＋ 항목 추가</button>
  </div><div class="hint" data-blank='${JSON.stringify(blank)}' style="display:none"></div></div>`;
}
function strListEditor(b, key, ph){
  const items = b[key]||[];
  return `<div class="fld"><label>${ph} ${items.length}개</label><div class="listbox">
    ${items.map((it,i)=>`<div style="display:flex;gap:5px;margin-bottom:5px">
      <input type="text" data-si="${i}" value="${esc(it)}" placeholder="${ph}" style="flex:1">
      <button class="btn sm danger" data-si-del="${i}">×</button></div>`).join('')}
    <button class="btn sm" data-si-add style="width:100%">＋ 추가</button></div></div>`;
}
function bindFields(b){
  inspector.querySelectorAll('[data-k]').forEach(el=>{
    el.addEventListener(el.type==='checkbox'?'change':'input', ()=>{
      b[el.dataset.k] = el.type==='checkbox' ? el.checked : el.value;
      refresh();
      if(['mode','action'].includes(el.dataset.k)) paintInspector();
    });
  });
  inspector.querySelectorAll('[data-use]').forEach(el=> el.onchange = ()=>{ b.use[el.dataset.use]=el.checked; refresh(); });
  inspector.querySelectorAll('[data-img]').forEach(el=>{
    const key = el.dataset.img || 'src';
    el.onclick = ()=> pickImage(src=>{ b[key]=src; paint(); });
  });
  inspector.querySelectorAll('[data-clear]').forEach(el=> el.onclick = ()=>{ b[el.dataset.clear]=''; paint(); });

  // 실제로 받은 후기 불러오기 (조작 없이 진짜 후기만)
  const pull = inspector.querySelector('[data-pull-rv]');
  if(pull) pull.onclick = async ()=>{
    pull.disabled = true; pull.textContent = '불러오는 중...';
    try {
      const r = await fetch('/api/reviews/published');
      const d = await r.json();
      if(!d.ok) throw new Error(d.error || '실패');
      if(!d.reviews.length){
        alert('홈페이지에 넣을 후기가 없습니다.\n\n후기 메뉴에서 "홈페이지에 넣기"를 켜주세요.');
      } else {
        b.items = d.reviews.map(x=>({ n:x.name, r:x.rating, t:x.body, photo:x.photo || '' }));
        paint();
        toast(d.reviews.length + '개 불러왔어요');
      }
    } catch(e){ alert('불러오기 실패: ' + e.message); }
    pull.disabled = false; pull.textContent = '받은 후기 불러오기';
  };
  const blankEl = inspector.querySelector('[data-blank]');
  inspector.querySelectorAll('[data-li]').forEach(el=>{
    const ev = el.type==='checkbox' ? 'change' : 'input';
    el.addEventListener(ev, ()=>{
      const i = +el.dataset.li, k = el.dataset.lk;
      if(el.type==='checkbox'){
        // '추천' 뱃지는 한 상품에만
        if(k==='best' && el.checked) b.items.forEach(x=>{ x.best = false; });
        b.items[i][k] = el.checked;
        paint();
        return;
      }
      b.items[i][k] = el.value;

      // 가격 자동 계산 (정가 ↔ 판매가 · 할인율 기준)
      if(b.type==='price'){
        const it = b.items[i];
        const put = (key, val)=>{
          it[key] = val;
          const el2 = inspector.querySelector(`[data-li="${i}"][data-lk="${key}"]`);
          if(el2) el2.value = val;
        };
        const hasWas = String(it.was||'').trim() !== '';
        const hasNow = String(it.now||'').trim() !== '';

        if(k === 'was'){                       // 정가를 고치면 → 판매가
          const v = calcNow(it); if(v !== null) put('now', v);
        } else if(k === 'now'){                // 판매가를 고치면 → 정가
          const v = calcWas(it); if(v !== null) put('was', v);
        } else if(k === 'off'){                // 할인율을 고치면
          if(hasWas){                          //  정가가 있으면 판매가를 다시
            const v = calcNow(it); if(v !== null) put('now', v);
          } else if(hasNow){                   //  판매가만 있으면 정가를 역산
            const v = calcWas(it); if(v !== null) put('was', v);
          }
        }
      }
      refresh();
    });
  });

  // 추천 문구 칩
  inspector.querySelectorAll('[data-sg]').forEach(el=> el.onclick = ()=>{
    const i = +el.dataset.sg, k = el.dataset.sk;
    b.items[i][k] = el.dataset.sv;
    paint();
  });
  inspector.querySelectorAll('[data-li-del]').forEach(el=> el.onclick = ()=>{ b.items.splice(+el.dataset.liDel,1); paint(); });
  const add = inspector.querySelector('[data-li-add]');
  if(add) add.onclick = ()=>{ b.items.push(JSON.parse(blankEl.dataset.blank)); paint(); };
  const skey = b.type==='form' ? 'products' : 'items';
  inspector.querySelectorAll('[data-si]').forEach(el=> el.oninput = ()=>{ b[skey][+el.dataset.si]=el.value; refresh(); });
  inspector.querySelectorAll('[data-si-del]').forEach(el=> el.onclick = ()=>{ b[skey].splice(+el.dataset.siDel,1); paint(); });
  const sadd = inspector.querySelector('[data-si-add]');
  if(sadd) sadd.onclick = ()=>{ b[skey].push(''); paint(); };
}
function pickImage(cb){
  const fp = $('#filePick'); fp.value='';
  fp.onchange = ()=>{
    const f = fp.files[0]; if(!f) return;
    if(f.size > 3*1024*1024){ toast('3MB 이하로 압축해주세요'); return; }
    const r = new FileReader(); r.onload = ()=> cb(r.result); r.readAsDataURL(f);
  };
  fp.click();
}

/* ---------------- 저장 / 로드 ---------------- */
$('#btnSave').onclick = async ()=>{
  const btn = $('#btnSave');
  btn.disabled = true; btn.textContent = '저장 중...';
  try {
    const r = await fetch('/api/landing', {
      method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(S)
    });
    if(!r.ok) throw 0;
    toast('저장됐습니다 — 내 링크에 바로 반영됩니다');
  } catch(e) {
    toast('저장에 실패했습니다');
  }
  btn.disabled = false; btn.textContent = '저장하기';
};

$('#btnCopy').onclick = ()=>{
  const url = (window.__BASE__ || location.origin) + '/s/' + window.__SLUG__;
  navigator.clipboard.writeText(url).then(()=>toast('링크가 복사됐습니다'), ()=>toast(url));
};

document.querySelectorAll('.devicebar .chip').forEach(c=> c.onclick = ()=>{
  document.querySelectorAll('.devicebar .chip').forEach(x=>x.classList.remove('on'));
  c.classList.add('on');
  $('#phone').classList.toggle('wide', c.dataset.w==='wide');
});

let tt;
function toast(msg){
  const t=$('#toast'); t.textContent=msg; t.classList.add('on');
  clearTimeout(tt); tt=setTimeout(()=>t.classList.remove('on'),2400);
}

/* ---------------- 시작 ---------------- */
(async function init(){
  try {
    const r = await fetch('/api/landing');
    S = await r.json();
  } catch(e) {
    toast('불러오기 실패');
    return;
  }
  if(!S.blocks) S.blocks = [];
  if(!S.theme) S.theme = { skin:'moon', accent:'#8a6a2f' };
  if(!S.meta) S.meta = { title:'', desc:'', og:'' };
  if(!S.sticky) S.sticky = { on:true, text:'상담 신청하기', action:'form', href:'' };
  sel = S.blocks[0]?.id || '__page';
  paint();
})();
