/* 상담 응대 — 화면 동작
 *
 * 서버에 묻지 않는다. 상황과 문구를 통째로 들고 시작한다.
 * 상담 중에 기다림이 있으면 안 되고, API 비용도 0원이어야 한다.
 * 서버를 부르는 건 두 곳뿐이다 — 내 기준 저장, 그리고 보정 차이 계산.
 */
(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) {
    return Array.prototype.slice.call((r || document).querySelectorAll(s));
  };
  var BLANK = '○○';

  function esc(x) {
    return String(x == null ? '' : x)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function norm(x) { return String(x || '').toLowerCase().replace(/\s+/g, ''); }

  /* 받침을 보고 조사를 고른다. 「횟수을(를)」 같은 게 화면에 나오면 안 된다. */
  function josa(word, withBat, without) {
    var s = String(word || '');
    var c = s.charCodeAt(s.length - 1);
    if (!(c >= 0xAC00 && c <= 0xD7A3)) return withBat;   /* 한글이 아니면 안전한 쪽 */
    return ((c - 0xAC00) % 28) ? withBat : without;
  }

  /* ── 내 기준 ──
     문구의 ○○ 를 메우는 값. 안 채우면 ○○ 로 둔다.
     지어낸 숫자가 그대로 손님에게 나가는 것보다 낫다. */
  var st = CS_ST || {};
  var custName = '';

  function withUnit(v, unit) {
    var s = String(v == null ? '' : v).trim();
    if (!s) return BLANK + unit;
    return /[가-힣]$/.test(s) ? s : s + unit;
  }
  function fill(text) {
    return String(text == null ? '' : text)
      .split('{이름}').join(custName || BLANK)
      .split('{기간}').join(withUnit(st.days, '일'))
      .split('{횟수}').join(withUnit(st.times, '회'))
      .split('{환불}').join(st.refund || '제작 전 전액 환불 / 제작 후 환불 불가 / 정보 오류 시 무료 재제작');
  }
  function missing(sit) {
    var need = sit.need || [], out = [];
    if (need.indexOf('기간') > -1 && !st.days) out.push('제작 기간');
    if (need.indexOf('횟수') > -1 && !st.times) out.push('추가 질문 횟수');
    if (need.indexOf('환불') > -1 && !st.refund) out.push('환불 기준');
    return out;
  }

  function setSummary() {
    var p = [];
    p.push(st.concept === 'A' ? '점사+사주' : st.concept === 'B' ? '명리만' : '컨셉 미정');
    p.push(st.days ? withUnit(st.days, '일') : '기간 미정');
    p.push(st.times ? withUnit(st.times, '회') : '횟수 미정');
    p.push(st.refund ? '환불 정함' : '환불 미정');
    var el = $('#csSetSum');
    if (el) el.textContent = p.join(' · ');
  }

  $$('.cs-radios button').forEach(function (b) {
    b.addEventListener('click', function () {
      $$('.cs-radios button').forEach(function (x) { x.classList.remove('on'); });
      b.classList.add('on');
      st.concept = b.getAttribute('data-c');
    });
  });

  var nameIn = $('#csName');
  if (nameIn) nameIn.addEventListener('input', function () {
    custName = nameIn.value.trim();
    render();
  });

  function saveSettings(done) {
    fetch('/counsel/settings', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(st),
    }).then(function (r) { return r.json(); }).then(function (j) {
      if (j && j.ok) st = j.st;
      setSummary();
      if (done) done(j && j.ok);
    }).catch(function () { if (done) done(false); });
  }

  var saveBtn = $('#csSave');
  if (saveBtn) saveBtn.addEventListener('click', function () {
    st.days = ($('#csDays').value || '').trim();
    st.times = ($('#csTimes').value || '').trim();
    st.refund = ($('#csRefund').value || '').trim();
    saveBtn.disabled = true;
    saveSettings(function (ok) {
      saveBtn.disabled = false;
      if (!ok) { alert('저장하지 못했습니다. 잠시 후 다시 시도해주세요.'); return; }
      var m = $('#csSaved');
      if (m) { m.hidden = false; setTimeout(function () { m.hidden = true; }, 2000); }
      render();
    });
  });

  /* ── 복사 ── */
  function copyText(txt, btn) {
    function ok() {
      var old = btn.textContent;
      btn.textContent = '복사했습니다'; btn.classList.add('done');
      setTimeout(function () { btn.textContent = old; btn.classList.remove('done'); }, 1600);
    }
    function fail() {
      var old = btn.textContent;
      btn.textContent = '직접 복사하세요';
      setTimeout(function () { btn.textContent = old; }, 2200);
    }
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(txt).then(ok, fail); return;
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
  }

  document.addEventListener('click', function (ev) {
    var b = ev.target.closest ? ev.target.closest('.cs-copy') : null;
    if (!b) return;
    var box = b.parentElement, pre = box ? $('pre', box) : null;
    if (pre) copyText(pre.textContent, b);
  });

  /* ── 찾기 ──
     손님 말을 통째로 붙여넣어도 걸려야 한다. 상담 중에는 정확히 칠 시간이 없다. */
  function score(sit, k) {
    var names = [sit.t].concat(sit.alt || []);
    var best = -1;
    for (var i = 0; i < names.length; i++) {
      var v = norm(names[i]);
      if (!v) continue;
      if (v === k) return 100;
      if (v.indexOf(k) === 0) best = Math.max(best, 80);
      else if (v.indexOf(k) > -1) best = Math.max(best, 60);
      else if (k.length >= 2 && k.indexOf(v) > -1) best = Math.max(best, 70);
    }
    if (best < 0 && norm(sit.when).indexOf(k) > -1) best = 30;
    if (best < 0) {
      for (var j = 0; j < (sit.says || []).length; j++) {
        if (norm(sit.says[j].text).indexOf(k) > -1) { best = 20; break; }
      }
    }
    return best;
  }

  function isDanger(q) {
    var k = norm(q);
    if (k.length < 2) return false;
    for (var i = 0; i < CS_DANGER_WORDS.length; i++) {
      if (k.indexOf(norm(CS_DANGER_WORDS[i])) > -1) return true;
    }
    return false;
  }

  /* ── 카드 그리기 ──
     목록과 봇이 같은 것을 쓴다. 두 곳이 다른 문구를 보여주면 안 된다.
     갈래 보이기/숨기기가 카드마다 따로 놀아야 해서 번호를 자체로 매긴다. */
  var uid = 0;
  function card(sit) {
    var idx = ++uid;
    var h = '<div class="cs-card" data-k="' + esc(sit.k) + '">';
    h += '<h3>' + esc(sit.t);
    if (sit.star) h += '<span class="star">가장 중요</span>';
    h += '<span class="cat">' + esc(sit.cat) + '</span></h3>';
    h += '<p class="cs-when">' + esc(sit.when) + '</p>';

    if (sit.check) h += '<div class="cs-check">' + esc(sit.check) + '</div>';

    /* 컨셉에 따라 갈리는데 아직 안 정했으면 먼저 정하게 한다.
       모르고 아무거나 보내면 반은 틀린 답이 나간다. */
    if (sit.concept === 'AB' && !st.concept) {
      h += '<div class="cs-needc"><b>컨셉을 먼저 정하세요.</b> ' +
        '이 질문은 답이 정반대로 갈립니다. 위 「내 기준」에서 고르시면 ' +
        '맞는 쪽이 먼저 열립니다.</div>';
    }

    var says = sit.says || [];
    var pick = 0;
    if (sit.concept === 'AB' && st.concept) pick = st.concept === 'A' ? 0 : 1;

    if (says.length > 1) {
      h += '<div class="cs-picks" data-for="' + idx + '">';
      says.forEach(function (s, i) {
        h += '<button type="button" aria-pressed="' + (i === pick ? 'true' : 'false') + '">' +
          esc(s.label || ('갈래 ' + (i + 1))) + '</button>';
      });
      h += '</div>';
    }

    var miss = missing(sit);
    if (miss.length) {
      var last = miss[miss.length - 1];
      h += '<p class="cs-miss">아직 <b>' + esc(miss.join(' · ')) + '</b>' +
        josa(last, '을', '를') + ' 안 정하셨습니다. ' +
        '문구에 ○○ 로 남아 있으니 <b>보내기 전에 채우세요.</b></p>';
    }

    says.forEach(function (s, i) {
      h += '<div class="cs-say cs-s' + idx + (i === pick ? '' : ' cs-hidden') + '">' +
        '<button type="button" class="cs-copy">복사</button>' +
        '<pre>' + esc(fill(s.text)) + '</pre></div>';
    });

    /* 「다른 데랑 왜 달라요」 — 설명보다 숫자가 세다 */
    if (sit.calc) h += calcBox();

    if (sit.why) {
      h += '<details class="cs-why"><summary>왜 이렇게 답하나</summary>' +
        '<div class="in">' + esc(sit.why) + '</div></details>';
    }
    if (sit.care) {
      h += '<details class="cs-why cs-care"><summary>조심할 것</summary>' +
        '<div class="in">' + esc(sit.care) + '</div></details>';
    }
    return h + '</div>';
  }

  function calcBox() {
    return '<div class="cs-calc">' +
      '<h4>이 손님은 실제로 갈리나 — 계산해보기</h4>' +
      '<p>설명보다 숫자가 셉니다. 생년월일시를 넣으면 지역시 보정을 넣었을 때와 ' +
      '뺐을 때 <b>시주가 실제로 갈리는지</b> 계산합니다. 갈리면 그게 답 그 자체입니다.</p>' +
      '<div class="cs-calc-row">' +
      '<input type="text" class="gBirth" placeholder="1992-12-11" inputmode="numeric">' +
      '<input type="text" class="gHour" placeholder="11:20" inputmode="numeric">' +
      '</div><div class="cs-calc-row">' +
      '<select class="gCal"><option>양력</option><option>음력</option><option>윤달</option></select>' +
      '<input type="text" class="gRegion" value="서울특별시">' +
      '<button type="button" class="cs-calc-go">계산</button>' +
      '</div><div class="cs-calc-out"></div></div>';
  }

  /* ── 목록 ── */
  var listEl = $('#csList'), qEl = $('#csQ'), catsEl = $('#csCats');
  var cat = '전체';

  function render() {
    if (!listEl) return;
    var q = qEl ? qEl.value : '';
    var k = norm(q);

    var dEl = $('#csDanger');
    if (dEl) dEl.hidden = !isDanger(q);

    var pool = CS_SITS.filter(function (s) { return cat === '전체' || s.cat === cat; });
    var out;
    if (!k) out = pool;
    else {
      out = pool.map(function (s) { return { s: s, v: score(s, k) }; })
        .filter(function (o) { return o.v >= 0; })
        .sort(function (a, b) { return b.v - a.v || a.s.t.length - b.s.t.length; })
        .map(function (o) { return o.s; });
    }
    if (!out.length) {
      listEl.innerHTML = '<p class="cs-none">그런 상황은 아직 정리돼 있지 않습니다.<br>' +
        '자료집 「상담 응대 / 대처 방법」을 보시거나, <b>루월당에 카톡으로 물어보세요.</b><br>' +
        '겪으신 상황을 알려주시면 여기 넣어두겠습니다.</p>';
      return;
    }
    listEl.innerHTML = out.map(card).join('');
  }

  if (qEl) qEl.addEventListener('input', render);
  if (catsEl) {
    var cbs = $$('button', catsEl);
    cbs.forEach(function (b, i) {
      b.addEventListener('click', function () {
        cbs.forEach(function (x, j) { x.setAttribute('aria-pressed', j === i ? 'true' : 'false'); });
        cat = b.textContent.trim();
        render();
      });
    });
  }

  /* 갈래 고르기 — 카드를 다시 그리면 스크롤이 튀므로 보이기만 바꾼다 */
  document.addEventListener('click', function (ev) {
    var b = ev.target.closest ? ev.target.closest('.cs-picks button') : null;
    if (!b) return;
    var wrap = b.parentElement, idx = wrap.getAttribute('data-for');
    var btns = $$('button', wrap), says = $$('.cs-s' + idx, wrap.parentElement);
    var i = btns.indexOf(b);
    btns.forEach(function (x, j) { x.setAttribute('aria-pressed', j === i ? 'true' : 'false'); });
    says.forEach(function (s, j) { s.classList.toggle('cs-hidden', j !== i); });
  });

  /* 보정 차이 계산 — 서버에서 실제로 두 번 돌린다 */
  document.addEventListener('click', function (ev) {
    var b = ev.target.closest ? ev.target.closest('.cs-calc-go') : null;
    if (!b) return;
    var box = b.closest('.cs-calc'), out = $('.cs-calc-out', box);
    out.innerHTML = '<p class="cs-when">계산하고 있습니다…</p>';
    b.disabled = true;
    fetch('/counsel/gap', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        birth: $('.gBirth', box).value, hour: $('.gHour', box).value,
        calendar: $('.gCal', box).value, region: $('.gRegion', box).value,
        name: custName,
      }),
    }).then(function (r) { return r.json(); }).then(function (j) {
      b.disabled = false;
      if (!j.ok) { out.innerHTML = '<p class="cs-err">' + esc(j.error) + '</p>'; return; }
      var v = j.changed
        ? '갈립니다 — 보정하면 ' + esc(j.hourOn) + ', 안 하면 ' + esc(j.hourOff) +
          ' (' + esc(j.region) + ' ' + Math.abs(j.mins) + '분)'
        : '안 갈립니다 — 보정을 넣어도 빼도 ' + esc(j.hourOn) +
          ' (' + esc(j.region) + ' ' + Math.abs(j.mins) + '분)';
      out.innerHTML = '<p class="cs-verdict ' + (j.changed ? 'yes' : 'no') + '">' + v + '</p>' +
        '<p class="cs-lbl">이 손님에게 보낼 말</p>' +
        '<div class="cs-say"><button type="button" class="cs-copy">복사</button>' +
        '<pre>' + esc(j.say) + '</pre></div>';
    }).catch(function () {
      b.disabled = false;
      out.innerHTML = '<p class="cs-err">계산하지 못했습니다. 잠시 후 다시 시도해주세요.</p>';
    });
  });

  /* ── 봇 ──
     처음 쓰는 사람은 뭘 쳐야 할지도 모른다. 봇이 먼저 말을 건다.
     속은 위 검색과 같은 것이다. 대화처럼 보이게 감쌌을 뿐이라 API 를 쓰지 않는다.

     되묻는 자리는 두 곳이다.
       · 어느 상황인지 헷갈릴 때 — 후보를 눌러서 고르게 한다
       · 컨셉에 따라 답이 갈릴 때 — 먼저 고르게 한다. 모르고 보내면 반은 틀린다
     그 밖에는 되묻지 않는다. 상담 중에 세 번 눌러야 답이 나오면 안 쓴다. */
  var logEl = $('#csLog'), askForm = $('#csAsk'), askIn = $('#csAskIn');

  function bubble(who, html) {
    if (!logEl) return null;
    var d = document.createElement('div');
    d.className = 'cs-b cs-b-' + who;
    d.innerHTML = html;
    logEl.appendChild(d);
    d.scrollIntoView({ block: 'nearest' });
    return d;
  }
  function chips(list) {
    return '<div class="cs-chips">' + list.map(function (c) {
      return '<button type="button" data-go="' + esc(c.go) + '"' +
        (c.v != null ? ' data-v="' + esc(c.v) + '"' : '') + '>' + esc(c.t) + '</button>';
    }).join('') + '</div>';
  }

  function greet() {
    bubble('bot',
      '<p>손님이 뭐라고 하셨나요? <b>그대로 붙여넣으셔도 됩니다.</b></p>' +
      '<p class="cs-b-sub">아래에서 골라도 되고, 밑에 직접 치셔도 됩니다.</p>' +
      chips([
        { go: 'q', v: '신점인가요', t: '신점인가요?' },
        { go: 'q', v: 'AI 돌린거 아니에요', t: 'AI 쓴 거 아니냐' },
        { go: 'q', v: '좀 안 맞는 것 같아요', t: '안 맞는 것 같다' },
        { go: 'q', v: '다른데서 본거랑 달라요', t: '다른 데랑 다르다' },
        { go: 'q', v: '환불해주세요', t: '환불해달라' },
        { go: 'q', v: '하나만 더 봐주세요', t: '질문이 계속 온다' },
      ]));
  }

  /* 모르는 것은 모른다고 한다. 지어내면 그게 그대로 손님에게 나간다. */
  function notFound(q) {
    bubble('bot',
      '<p><b>「' + esc(q) + '」는 정리된 내용이 없습니다.</b></p>' +
      '<p>지어내서 답을 드리면 그게 그대로 손님한테 나가서, 여기서는 없는 건 없다고 합니다.</p>' +
      '<p class="cs-b-sub">겪으신 상황을 <b>루월당에 카톡으로 물어봐 주세요.</b> ' +
      '알려주시면 여기에 넣어두겠습니다 — 다음 사람이 같은 일로 헤매지 않게요.</p>' +
      '<div class="cs-chips"><a class="cs-b-link" href="/support">문의하기로 남기기</a>' +
      '<button type="button" data-go="list">목록에서 직접 찾아보기</button></div>');
  }

  function askWhich(list, q) {
    bubble('bot',
      '<p>비슷한 상황이 여럿입니다. <b>어느 쪽인가요?</b></p>' +
      chips(list.slice(0, 5).map(function (s) { return { go: 'sit', v: s.k, t: s.t }; })));
  }

  function askConcept(k) {
    bubble('bot',
      '<p>이 질문은 <b>컨셉에 따라 답이 정반대</b>입니다. 어느 쪽으로 하고 계세요?</p>' +
      '<p class="cs-b-sub">한 번만 고르시면 저장해두고 다음부터 안 여쭤봅니다.</p>' +
      chips([
        { go: 'c', v: 'A|' + k, t: '점사와 사주를 함께 봅니다' },
        { go: 'c', v: 'B|' + k, t: '사주 명리만 봅니다' },
      ]));
  }

  function answer(sit) {
    if (sit.concept === 'AB' && !st.concept) { askConcept(sit.k); return; }
    var b = bubble('bot', '<p>이렇게 보내세요.</p>');
    b.classList.add('cs-b-wide');
    var box = document.createElement('div');
    box.innerHTML = card(sit);
    b.appendChild(box.firstChild);
    b.scrollIntoView({ block: 'nearest' });
  }

  function ask(q) {
    var text = String(q || '').trim();
    if (!text) return;
    bubble('me', '<p>' + esc(text) + '</p>');

    if (isDanger(text)) {
      var d = $('#csDanger');
      if (d) d.hidden = false;
      bubble('bot',
        '<p class="cs-b-warn">지금은 사주를 볼 때가 아닙니다.</p>' +
        '<p>손님 말에 <b>위험 신호</b>가 있습니다. 사주 이야기를 멈추고 아래를 보내신 뒤 상담을 끝내세요.</p>' +
        '<div class="cs-say"><button type="button" class="cs-copy">복사</button>' +
        '<pre>' + esc(CS_DANGER_SAY) + '</pre></div>' +
        '<p class="cs-b-sub">109(자살예방) · 1577-0199(정신건강 위기) · 1388(청소년) · 1366(여성 긴급)<br>' +
        '판단하지 말고 들어주세요. 번호를 알려주세요. 상담을 끝내세요. ' +
        '환불이 필요하면 해드리세요 — 돈보다 중요합니다.</p>' +
        '<p class="cs-b-sub">자세한 것은 <b>아래 빨간 칸</b>에 펼쳐 뒀습니다.</p>');
      return;
    }

    var k = norm(text);
    var hits = CS_SITS.map(function (s) { return { s: s, v: score(s, k) }; })
      .filter(function (o) { return o.v >= 40; })
      .sort(function (a, b) { return b.v - a.v || a.s.t.length - b.s.t.length; });

    if (!hits.length) { notFound(text); return; }
    /* 1등이 확실히 앞서면 되묻지 않는다. 상담 중에 한 번이라도 덜 누르는 게 낫다. */
    if (hits.length === 1 || hits[0].v - hits[1].v >= 20) { answer(hits[0].s); return; }
    askWhich(hits.map(function (o) { return o.s; }), text);
  }

  if (askForm) askForm.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var v = askIn.value;
    askIn.value = '';
    ask(v);
  });

  /* 말풍선 안의 단추들 */
  if (logEl) logEl.addEventListener('click', function (ev) {
    var b = ev.target.closest ? ev.target.closest('[data-go]') : null;
    if (!b) return;
    var go = b.getAttribute('data-go'), v = b.getAttribute('data-v') || '';
    if (go === 'q') { ask(v); return; }
    if (go === 'sit') {
      var sit = CS_SITS.filter(function (s) { return s.k === v; })[0];
      if (sit) { bubble('me', '<p>' + esc(sit.t) + '</p>'); answer(sit); }
      return;
    }
    if (go === 'c') {
      var parts = v.split('|');
      st.concept = parts[0];
      bubble('me', '<p>' + (parts[0] === 'A' ? '점사와 사주를 함께 봅니다' : '사주 명리만 봅니다') + '</p>');
      $$('.cs-radios button').forEach(function (x) {
        x.classList.toggle('on', x.getAttribute('data-c') === parts[0]);
      });
      saveSettings(function () {
        var sit = CS_SITS.filter(function (s) { return s.k === parts[1]; })[0];
        if (sit) answer(sit);
        render();
      });
      return;
    }
    if (go === 'list') {
      var q = $('#csQ');
      if (q) { q.focus(); q.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
    }
  });


  setSummary();
  render();
  greet();
})();
