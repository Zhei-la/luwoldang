/* ============================================================
 * 리포트 미리보기 · 수정하기
 *
 * 이 파일은 서버 템플릿 리터럴 "밖"에 있는 진짜 .js 파일이다.
 * 그래서 \/ 나 ${...} 나 \n 을 마음대로 써도 안 깨진다.
 *
 * 서버(routes/preview.js)가 넘겨주는 값:
 *   window.PDF_ID      리포트 번호
 *   window.LEAD_ID     신청자 번호
 *   window.LEAD_EMAIL  신청자 이메일
 * ============================================================ */
(function () {
  'use strict';

  var PDF_ID = window.PDF_ID;
  var LEAD_ID = window.LEAD_ID;
  var EMAIL = window.LEAD_EMAIL || '';

  // ↓ 옛날 버그의 범인. 이제 진짜 파일이라 정규식이 안 깨진다.
  var IN_APP = /KAKAOTALK|NAVER|Instagram|FBAN|FBAV|Line\//i.test(navigator.userAgent || '');

  var EDITING = false;
  var DIRTY = false;

  function $(id) { return document.getElementById(id); }

  /* 챕터 본문 페이지만 고른다.
     data-ch 가 없는 페이지(표지 · 목차 · 용어 풀이)는 건드리지 않는다. */
  function pagesOf() {
    return Array.prototype.slice.call(document.querySelectorAll('.page.chapter[data-ch]'));
  }

  function toast(msg, bad) {
    var t = $('toast');
    if (!t) return;
    t.textContent = msg;
    t.style.background = bad ? '#c0392b' : '#2f9e5e';
    t.classList.add('on');
    setTimeout(function () { t.classList.remove('on'); }, 1900);
  }

  /* ---------- 화면 → 저장할 데이터 ----------
     페이지가 아니라 '챕터' 단위로 담는다.
     (리플로우 때문에 한 챕터가 여러 페이지에 걸쳐 있다) */
  function collect() {
    var byCh = {};
    var order = [];

    pagesOf().forEach(function (sec) {
      var k = sec.dataset.ch;
      if (!byCh[k]) {
        var t = sec.querySelector('.ch-title');
        byCh[k] = { title: t ? t.innerText.trim() : '', blocks: [] };
        order.push(k);
      }
      sec.querySelectorAll('.ch-block').forEach(function (b) {
        var subEl = b.querySelector('.ch-sub');
        var paras = [];
        b.querySelectorAll('p').forEach(function (p) {
          var t = p.innerText.trim();
          if (t) paras.push(t);
        });
        if (!subEl && !paras.length) return;

        var sub = subEl ? subEl.innerText.trim() : '';
        var arr = byCh[k].blocks;
        var last = arr[arr.length - 1];

        // 소제목 없는 조각은 앞 블록에 이어 붙인다 (페이지가 갈린 것뿐이므로)
        if (!sub && last) last.body += '\n\n' + paras.join('\n\n');
        else arr.push({ sub: sub, body: paras.join('\n\n') });
      });
    });

    // 챕터 순서대로 (0,1,2...)
    order.sort(function (a, b) { return Number(a) - Number(b); });
    return order.map(function (k) { return byCh[k]; });
  }

  /* ---------- 저장 ---------- */
  async function save(btn) {
    var old = btn ? btn.textContent : '';
    if (btn) { btn.disabled = true; btn.textContent = '저장 중...'; }
    try {
      var r = await fetch('/pdfs/' + PDF_ID + '/edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chapters: collect() })
      });
      var d = await r.json();
      if (!d.ok) throw new Error(d.error || '실패');
      DIRTY = false;
      toast('저장했습니다');
      return true;
    } catch (e) {
      toast('저장 실패: ' + e.message, true);
      return false;
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = old; }
    }
  }

  /* ---------- 되돌리기 (처음 만들어진 글로) ---------- */
  async function revert(ch, btn) {
    var old = btn ? btn.textContent : '';
    if (btn) { btn.disabled = true; btn.textContent = '되돌리는 중...'; }
    try {
      var r = await fetch('/pdfs/' + PDF_ID + '/revert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ch: ch, chapters: collect() })
      });
      var d = await r.json();
      if (!d.ok) throw new Error(d.error || '실패');
      DIRTY = false;
      toast('처음 글로 되돌렸습니다');
      setTimeout(function () { location.reload(); }, 600);
    } catch (e) {
      toast('되돌리기 실패: ' + e.message, true);
      if (btn) { btn.disabled = false; btn.textContent = old; }
    }
  }

  /* ---------- 문단 하나만 AI 로 다시 쓰기 ---------- */
  async function rewriteBlock(blk, btn) {
    var sec = blk.closest('.page.chapter[data-ch]');
    if (!sec) return;

    var note = prompt(
      '어떻게 고칠까요? (비워두면 문체만 다듬습니다)\n\n' +
      '예) 더 구체적으로 / 좀 더 짧게 / 사물 비유를 빼줘'
    );
    if (note === null) return;

    var subEl = blk.querySelector('.ch-sub');
    var paras = [];
    blk.querySelectorAll('p').forEach(function (p) {
      var t = p.innerText.trim();
      if (t) paras.push(t);
    });
    if (!paras.length) { alert('내용이 없습니다.'); return; }

    var old = btn.textContent;
    btn.disabled = true;
    btn.textContent = '다시 쓰는 중...';

    try {
      var titleEl = sec.querySelector('.ch-title');
      var r = await fetch('/pdfs/' + PDF_ID + '/rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chapterTitle: titleEl ? titleEl.innerText.trim() : '',
          sub: subEl ? subEl.innerText.trim() : '',
          body: paras.join('\n\n'),
          note: (note || '').trim()
        })
      });
      var d = await r.json();
      if (!d.ok) throw new Error(d.error || '실패');

      // 기존 문단을 새 문단으로 갈아끼운다
      blk.querySelectorAll('p').forEach(function (p) { p.remove(); });
      var tools = blk.querySelector('.blk-tools');
      String(d.body).split(/\n{2,}|\n/).filter(Boolean).forEach(function (t) {
        var p = document.createElement('p');
        p.textContent = t.trim();
        p.setAttribute('contenteditable', 'true');
        p.oninput = function () { DIRTY = true; };
        if (tools) blk.insertBefore(p, tools);
        else blk.appendChild(p);
      });

      DIRTY = true;
      toast('다시 썼습니다. 확인하고 저장하세요.');
    } catch (e) {
      toast('실패: ' + e.message, true);
    }

    btn.disabled = false;
    btn.textContent = old;
  }

  /* ---------- 페이지 오른쪽 위 버튼 (되돌리기 / 이 페이지 저장) ---------- */
  function addPageTools() {
    pagesOf().forEach(function (sec) {
      if (sec.querySelector('.pg-tools')) return;

      var ch = sec.dataset.ch;

      var box = document.createElement('div');
      box.className = 'pg-tools no-print';

      var rv = document.createElement('button');
      rv.type = 'button';
      rv.textContent = '되돌리기';
      rv.title = '이 페이지를 처음 만들어진 글로 되돌립니다';
      rv.onclick = function () {
        if (!confirm('이 페이지를 처음 만들어진 글로 되돌릴까요?\n(고친 내용은 사라집니다)')) return;
        revert(Number(ch), rv);
      };

      var sv = document.createElement('button');
      sv.type = 'button';
      sv.className = 'save';
      sv.textContent = '이 페이지 저장';
      sv.onclick = function () { save(sv); };

      box.appendChild(rv);
      box.appendChild(sv);
      sec.appendChild(box);
    });
  }

  /* ---------- 글을 눌러서 고칠 수 있게 ---------- */
  function makeEditable(root) {
    root.querySelectorAll('.ch-title, .ch-sub, .ch-block p').forEach(function (el) {
      el.setAttribute('contenteditable', 'true');
      el.oninput = function () { DIRTY = true; };
    });

    root.querySelectorAll('.ch-block').forEach(function (b) {
      if (b.querySelector('.blk-tools')) return;

      var box = document.createElement('div');
      box.className = 'blk-tools no-print';

      var ai = document.createElement('button');
      ai.type = 'button';
      ai.className = 'blk-ai';
      ai.textContent = 'AI 다시 쓰기';
      ai.onclick = function () { rewriteBlock(b, ai); };

      var x = document.createElement('button');
      x.type = 'button';
      x.className = 'blk-del';
      x.textContent = '×';
      x.title = '이 문단 묶음 삭제';
      x.onclick = function () {
        if (confirm('이 문단 묶음을 지울까요?')) { b.remove(); DIRTY = true; }
      };

      box.appendChild(ai);
      box.appendChild(x);
      b.appendChild(box);
    });
  }

  /* ---------- 상단 버튼 ---------- */
  function bind() {
    var btnEdit = $('btnEdit');
    var btnDone = $('btnDone');
    var btnSend = $('btnSend');
    var btnDl = $('btnDl');
    var pvMode = $('pvMode');

    if (btnEdit) btnEdit.onclick = function () {
      EDITING = true;
      document.body.classList.add('editing');
      addPageTools();
      pagesOf().forEach(makeEditable);
      btnEdit.style.display = 'none';
      if (btnDone) btnDone.style.display = '';
      if (pvMode) pvMode.textContent = '수정 중';
    };

    if (btnDone) btnDone.onclick = async function () {
      if (DIRTY) {
        if (confirm('저장하지 않은 수정이 있습니다. 저장할까요?')) {
          var ok = await save(btnDone);
          if (!ok) return;   // 저장 실패하면 화면을 날리지 않는다
        }
      }
      EDITING = false;
      toast('정리된 내용으로 다시 만듭니다');
      setTimeout(function () { location.reload(); }, 700);
    };

    if (btnDl) btnDl.addEventListener('click', function () {
      btnDl.classList.add('loading');
      btnDl.textContent = 'PDF 만드는 중...(20초쯤)';
      setTimeout(function () {
        btnDl.classList.remove('loading');
        btnDl.textContent = 'PDF 다운받기';
      }, 45000);
    });

    if (btnSend) btnSend.onclick = async function () {
      if (!EMAIL) { alert('이 신청자의 이메일이 없습니다.'); return; }
      if (DIRTY && !confirm('저장하지 않은 수정이 있습니다. 그대로 보낼까요?')) return;
      if (!confirm(EMAIL + ' 로 보낼까요?')) return;

      var btns = document.querySelectorAll('.pv-actions button');
      btns.forEach(function (b) { b.disabled = true; });
      btnSend.textContent = '보내는 중...';

      try {
        var r = await fetch('/pdfs/' + PDF_ID + '/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: EMAIL })
        });
        var d = await r.json();
        if (!d.ok) throw new Error(d.error || '실패');
        alert('발송 완료: ' + d.to);
        location.href = '/leads/' + LEAD_ID;
      } catch (e) {
        alert('발송 실패: ' + e.message);
        btns.forEach(function (b) { b.disabled = false; });
        btnSend.textContent = '이메일 보내기';
      }
    };

    if (IN_APP && $('pvWarn')) $('pvWarn').style.display = 'block';

    window.addEventListener('beforeunload', function (e) {
      if (EDITING && DIRTY) { e.preventDefault(); e.returnValue = ''; }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind);
  } else {
    bind();
  }
})();
