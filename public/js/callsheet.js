/* 전화상담 상담지 — 화면 동작
 *
 * 통화 중에 쓰는 화면이라 다음 세 가지가 제일 중요하다.
 *  · 손가락 한 번에 칸이 바뀔 것 (스크롤로 찾게 하지 않는다)
 *  · 용어를 한 글자만 쳐도 나올 것
 *  · 메모가 사라지지 않을 것
 */
(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) {
    return Array.prototype.slice.call((r || document).querySelectorAll(s));
  };
  var NL = String.fromCharCode(10);

  /* ── 고정 머리말 높이 ──
     용어 검색칸은 머리말 바로 밑에 붙어 있어야 한다. CSS 만으로는 못 한다 —
     머리말 높이가 이름 길이와 질문 줄 유무에 따라 달라지기 때문이다.
     재서 --toph 에 넣어주면 .sbox 가 그 값을 top 으로 쓴다. */
  var topBar = $('.top');
  function measureTop() {
    if (!topBar) return;
    var h = Math.round(topBar.getBoundingClientRect().height);
    document.documentElement.style.setProperty('--toph', h + 'px');
  }
  measureTop();
  window.addEventListener('resize', measureTop);
  window.addEventListener('orientationchange', measureTop);
  /* 글꼴이 늦게 오면 머리말 높이가 한 번 더 바뀐다 */
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(measureTop).catch(function () {});
  }

  /* ── 큰 탭 ── */
  var tabs = $$('.tabs button'), pans = $$('.panel');
  function go(i) {
    tabs.forEach(function (b, j) { b.setAttribute('aria-selected', j === i ? 'true' : 'false'); });
    pans.forEach(function (p, j) { p.classList.toggle('on', j === i); });
    window.scrollTo(0, 0);
    if (tabs[i] && tabs[i].scrollIntoView) {
      tabs[i].scrollIntoView({ block: 'nearest', inline: 'center' });
    }
  }
  tabs.forEach(function (b, i) { b.addEventListener('click', function () { go(i); }); });
  $$('.next').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var cur = -1;
      pans.forEach(function (p, j) { if (p.classList.contains('on')) cur = j; });
      if (cur > -1 && cur < pans.length - 1) go(cur + 1);
    });
  });

  /* ── 안쪽 고르기 (성격 칸, 운세 주제, 연애 상태) ── */
  $$('.picker').forEach(function (pk) {
    var btns = $$('button', pk), subs = $$(pk.getAttribute('data-for'));
    btns.forEach(function (b, i) {
      b.addEventListener('click', function () {
        btns.forEach(function (x, j) { x.setAttribute('aria-pressed', j === i ? 'true' : 'false'); });
        subs.forEach(function (s, j) { s.classList.toggle('on', j === i); });
      });
    });
    pk._go = function (i) { if (btns[i]) btns[i].click(); };
  });

  /* 운세 한눈 표에서 줄을 누르면 그 주제로 */
  $$('.grade tr').forEach(function (tr) {
    tr.addEventListener('click', function () {
      var panel = tr.closest ? tr.closest('.panel') : null;
      var pk = panel ? $('.picker', panel) : null;
      if (!pk || !pk._go) return;
      pk._go(parseInt(tr.getAttribute('data-go'), 10) || 0);
      pk.scrollIntoView({ block: 'start', behavior: 'smooth' });
    });
  });

  /* 머리말의 「용어 찾기」 — 탭 줄에서는 오른쪽으로 밀려 안 보인다 */
  var gt = $('#goterm');
  if (gt) gt.addEventListener('click', function () {
    var i = -1;
    tabs.forEach(function (b, j) { if (b.textContent.indexOf('용어') > -1) i = j; });
    if (i > -1) { go(i); var q = $('#tq'); if (q) q.focus(); }
  });

  /* ── 통화 시간 ── */
  var s = 0, iv = null, t = $('#t'), tb = $('#tb');
  function draw() {
    var m = Math.floor(s / 60), x = s % 60;
    t.textContent = (m < 10 ? '0' : '') + m + ':' + (x < 10 ? '0' : '') + x;
  }
  if (tb) tb.addEventListener('click', function () {
    if (iv) { clearInterval(iv); iv = null; tb.textContent = '다시 시작'; t.classList.remove('run'); }
    else { iv = setInterval(function () { s++; draw(); }, 1000); tb.textContent = '멈춤'; t.classList.add('run'); }
  });

  /* ── 급질문 프롬프트 ── */
  var memo = $('#memo'), qin = $('#qin'), pr = $('#pr');
  if (memo) {
    try { var v = localStorage.getItem(CS_KEY); if (v) memo.value = v; } catch (e) {}
  }
  function build() {
    var m = (memo && memo.value || '').split(NL)
      .map(function (x) { return x.trim(); })
      .filter(Boolean)
      .map(function (x) { return '- ' + x; });
    var mid = [
      m.length ? m.join(NL) : '- (통화 중 메모 없음)', '',
      '[방금 받은 질문]',
      '"' + ((qin && qin.value || '').trim() || '(여기에 손님 질문을 적으세요)') + '"',
    ];
    return CS_PROMPT.head.concat(mid, CS_PROMPT.tail).join(NL).replace(/\n{3,}/g, '\n\n');
  }
  function refresh() { if (pr) pr.textContent = build(); }
  refresh();
  if (memo) memo.addEventListener('input', function () {
    try { localStorage.setItem(CS_KEY, memo.value); } catch (e) {}
    refresh();
  });
  if (qin) qin.addEventListener('input', refresh);

  var copy = $('#copy');
  if (copy) copy.addEventListener('click', function () {
    var txt = build(), btn = this;
    function ok() {
      btn.textContent = '복사했습니다 ✓';
      setTimeout(function () { btn.textContent = '프롬프트 복사하기'; }, 1800);
    }
    function fail() {
      btn.textContent = '아래 글을 직접 복사하세요';
      setTimeout(function () { btn.textContent = '프롬프트 복사하기'; }, 2400);
    }
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(txt).then(ok, fail);
        return;
      }
    } catch (e) {}
    try {
      var ta = document.createElement('textarea');
      ta.value = txt; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      var done = document.execCommand('copy');
      document.body.removeChild(ta);
      done ? ok() : fail();
    } catch (e) { fail(); }
  });

  var tg = $('#toggle');
  if (tg) tg.addEventListener('click', function () {
    var wrap = $('#prwrap'), hid = wrap.style.display === 'none';
    wrap.style.display = hid ? '' : 'none';
    this.textContent = hid ? '프롬프트 접기' : '프롬프트 펼치기';
  });

  /* ── 용어 찾기 ──
     통화 중에는 정확히 칠 시간이 없다. 한 글자만 쳐도 걸리게 한다. */
  var tq = $('#tq'), tlist = $('#tlist'), tcats = $('#tcats');
  var cat = '전체';

  function norm(x) { return String(x || '').toLowerCase().replace(/\s+/g, ''); }

  function score(it, k) {
    var names = [it.t].concat(it.alt || []);
    var best = -1;
    for (var i = 0; i < names.length; i++) {
      var n = norm(names[i]);
      if (n === k) return 100;
      if (n.indexOf(k) === 0) best = Math.max(best, 80);
      else if (n.indexOf(k) > -1) best = Math.max(best, 60);
    }
    if (best < 0 && norm(it.short).indexOf(k) > -1) best = 30;
    if (best < 0 && norm(it.say).indexOf(k) > -1) best = 20;
    return best;
  }

  function esc(x) {
    return String(x == null ? '' : x)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function bold(x) {
    return esc(x).replace(/&lt;b&gt;/g, '<b>').replace(/&lt;\/b&gt;/g, '</b>');
  }

  function card(it) {
    var h = '<div class="tcard"><h3>' + esc(it.t) +
      '<span class="cat">' + esc(it.cat) + '</span>';
    (it.luck || []).forEach(function (l) { h += '<span class="lk">' + esc(l) + '</span>'; });
    h += '</h3>';
    if (it.short) h += '<p class="short">' + bold(it.short) + '</p>';
    /* 「그래서 제 용신이 뭔데요?」 — 손님이 진짜 묻는 건 이쪽이다.
       사전 뜻보다 위에 둔다. */
    if (it.mine) {
      h += '<div class="say mine"><span class="cue mi">이 손님은</span><p>' +
        esc(it.mine) + '</p></div>';
    }
    if (it.say) h += '<div class="say"><p>' + esc(it.say) + '</p></div>';
    (it.qs || []).forEach(function (q) {
      h += '<details class="qa"><summary>' + esc(q.q) + '</summary>' +
        '<div class="in"><div class="say"><p>' + esc(q.a) + '</p></div></div></details>';
    });
    return h + '</div>';
  }

  function render() {
    if (!tlist) return;
    var k = norm(tq && tq.value);
    var pool = CS_TERMS.filter(function (it) { return cat === '전체' || it.cat === cat; });
    var out;
    if (!k) {
      out = pool;
    } else {
      out = pool.map(function (it) { return { it: it, s: score(it, k) }; })
        .filter(function (o) { return o.s >= 0; })
        .sort(function (a, b) { return b.s - a.s || a.it.t.length - b.it.t.length; })
        .map(function (o) { return o.it; });
    }
    if (!out.length) {
      tlist.innerHTML = '<p class="tnone">찾는 말이 없습니다.<br>' +
        '이럴 땐 이렇게 넘기세요 —<br><b>“그건 정리해서 자료로 보내드릴게요.”</b></p>';
      return;
    }
    tlist.innerHTML = out.map(card).join('');
  }

  if (tq) tq.addEventListener('input', render);
  if (tcats) {
    var cbs = $$('button', tcats);
    cbs.forEach(function (b, i) {
      b.addEventListener('click', function () {
        cbs.forEach(function (x, j) { x.setAttribute('aria-pressed', j === i ? 'true' : 'false'); });
        cat = b.textContent.trim();
        render();
      });
    });
  }
  render();

  /* ── 눌러서 뜻 보기 ──
     원국 표는 사주를 아는 사람에게만 표다. 모르는 사람에게는 한자 덩어리다.
     칸을 누르면 그 말이 무슨 뜻인지, 그리고 이 손님은 어떤지까지
     밑에서 올라오게 한다. 보던 자리는 그대로 둔다 — 통화 중이다.

     data-term 이 붙은 것이면 무엇이든 걸린다. 표 칸, 오행 타일,
     요약 줄의 굵은 글자, 대운·세운·월운 제목 전부. */
  var ts = $('#tsheet'), tsBody = $('#tsheetbody');

  function findTerm(name) {
    var k = norm(name);
    if (!k) return null;
    for (var i = 0; i < CS_TERMS.length; i++) {
      if (norm(CS_TERMS[i].t) === k) return CS_TERMS[i];
    }
    for (var j = 0; j < CS_TERMS.length; j++) {
      var alt = CS_TERMS[j].alt || [];
      for (var m = 0; m < alt.length; m++) if (norm(alt[m]) === k) return CS_TERMS[j];
    }
    return null;
  }

  function openTerm(name) {
    if (!ts || !tsBody) return;
    var it = findTerm(name);
    tsBody.innerHTML = it ? card(it)
      : '<p class="tnone">「' + esc(name) + '」는 사전에 없습니다.<br>' +
        '<b>용어 찾기</b> 탭에서 비슷한 말로 찾아보세요.</p>';
    ts.hidden = false;
    /* 카드가 길면 위부터 보여야 한다 */
    var box = $('.tsheet-in', ts);
    if (box) box.scrollTop = 0;
  }
  function closeTerm() { if (ts) ts.hidden = true; }

  document.addEventListener('click', function (ev) {
    var t = ev.target.closest ? ev.target.closest('[data-term]') : null;
    if (!t) return;
    var name = (t.getAttribute('data-term') || '').trim();
    if (!name) return;
    ev.preventDefault();
    openTerm(name);
  });
  if ($('#tsheetbg')) $('#tsheetbg').addEventListener('click', closeTerm);
  if ($('#tsheetx')) $('#tsheetx').addEventListener('click', closeTerm);
  document.addEventListener('keydown', function (ev) {
    if (ev.key === 'Escape') closeTerm();
  });

})();
