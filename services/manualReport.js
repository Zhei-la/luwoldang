/* ============================================================
 * manualReport.js — 직접 작성 리포트 (AI 안 씀)
 *
 * ChatGPT 등에서 받아온 글을 통째로 붙여넣으면
 * 장(章)·소제목별로 잘라서 리포트 형식(sections)으로 만들어준다.
 *
 * 이렇게 만든 sections 는 AI가 만든 것과 형식이 완전히 같아서
 * 표지·만세력·배경지·각주·PDF 저장·메일 발송이 전부 그대로 동작한다.
 *
 * ⚠️ API 호출 없음 → 요금 0원.
 *
 * 붙여넣기 형식:
 *   ## 01 나의 재물 성향 한눈에 보기      ← 장 제목 (숫자는 있어도 없어도 됨)
 *   ### 돈에 대한 나를 한 문장으로         ← 소제목
 *   본문...
 *
 *   ### 돈이 들어오는 주된 방식
 *   본문...
 * ============================================================ */

const { OUTLINES, outlineWithQuestion, tuneNewYear } = require('./outlines');

/** 리포트 종류에 맞는 목차를 가져온다 (AI 경로와 같은 규칙) */
function outlineFor(type, question) {
  let base = outlineWithQuestion(type, question || '');
  if (!base || !base.length) base = OUTLINES[type] || OUTLINES['종합사주'] || [];
  if (type === '신년운세') {
    try { base = tuneNewYear(base) || base; } catch (e) { /* 실패해도 원래 목차로 진행 */ }
  }
  return base;
}

/** 목차만으로 빈 껍데기를 만든다 (글은 나중에 수정하기로 채움) */
function blankSections(type, question) {
  return outlineFor(type, question).map((ch) => ({
    title: ch.title,
    blocks: (ch.sub || ['']).map((s) => ({ sub: s || '', body: '' })),
  }));
}

/** 제목 비교용 — 번호·기호·공백을 털어낸다 ("## 01 나의 재물 성향" → "나의재물성향") */
function keyOf(s) {
  return String(s || '')
    .replace(/^[#\s]*/, '')
    .replace(/^\d+\s*[.)\-—]?\s*/, '')
    .replace(/[^가-힣a-zA-Z0-9]/g, '')
    .toLowerCase();
}

/**
 * 붙여넣은 글을 파싱한다.
 * ## 로 장을 나누고, ### 로 소제목을 나눈다.
 * @returns {{chapters: Array<{title:string, blocks:Array<{sub:string,body:string}>}>}}
 */
function parsePasted(text) {
  const lines = String(text || '').replace(/\r\n?/g, '\n').split('\n');
  const chapters = [];
  let ch = null, blk = null;

  const pushBlk = () => {
    if (ch && blk) {
      blk.body = blk.body.replace(/\n{3,}/g, '\n\n').trim();
      ch.blocks.push(blk);
      blk = null;
    }
  };

  for (const raw of lines) {
    const line = raw.replace(/\s+$/, '');

    const mCh = line.match(/^\s*##(?!#)\s*(.+)$/);
    if (mCh) {
      pushBlk();
      ch = { title: mCh[1].trim(), blocks: [] };
      chapters.push(ch);
      continue;
    }

    const mSub = line.match(/^\s*###\s*(.+)$/);
    if (mSub) {
      pushBlk();
      if (!ch) { ch = { title: '', blocks: [] }; chapters.push(ch); }
      blk = { sub: mSub[1].trim(), body: '' };
      continue;
    }

    if (!ch) {
      // ## 없이 그냥 본문부터 시작한 경우 — 통짜로 담아둔다
      ch = { title: '', blocks: [] };
      chapters.push(ch);
    }
    if (!blk) blk = { sub: '', body: '' };
    blk.body += line + '\n';
  }
  pushBlk();

  return { chapters: chapters.filter((c) => c.blocks.length || c.title) };
}

/* 본문이 이만큼도 안 되면 안 쓴 것으로 본다 */
const MIN_BODY = 30;

/**
 * 빈 소제목·빈 장을 걷어낸다.
 *
 *   GPT 가 소제목을 몇 개 빠뜨리는 일이 있는데, 예전에는 목차에 있는 소제목을
 *   전부 만들어 두는 바람에 제목만 있고 본문이 빈 칸이 PDF 에 그대로 실렸다.
 *
 *   · 붙여넣은 글에 아예 없던 소제목  → 본문이 비어 있으므로 빠진다
 *   · 소제목은 있는데 본문이 너무 짧음 → 빠진다
 *   · 한 장의 소제목이 전부 빠지면      → 그 장도 빠진다
 *
 *   장 번호는 배열 순서로 매겨지므로, 장이 빠지면 번호는 알아서 다시 매겨진다.
 *   순서는 그대로 두고 "있는 것만" 남긴다.
 */
function pruneEmpty(sections) {
  let dropped = 0;          // 빠진 소제목 수
  const droppedChapters = []; // 통째로 빠진 장 제목

  const kept = [];
  (sections || []).forEach((ch) => {
    const blocks = (ch.blocks || []).filter((b) => {
      const body = String((b && b.body) || '').trim();
      if (body.length >= MIN_BODY) return true;
      dropped++;
      return false;
    });
    if (blocks.length) kept.push(Object.assign({}, ch, { blocks }));
    else droppedChapters.push(ch.title || '(제목 없음)');
  });

  return { sections: kept, dropped, droppedChapters };
}

/**
 * 붙여넣은 글 → 저장할 sections
 *
 * 목차와 최대한 맞춰준다:
 *   1) 장 제목이 목차와 같으면 그 자리에 넣는다
 *   2) 못 찾으면 순서대로 채운다
 *   3) 붙여넣은 글에 없는 장은 빈 칸으로 남긴다 (나중에 수정하기로 채우면 됨)
 *
 * @returns {{ sections: Array, matched: number, total: number, extra: number }}
 */
function buildFromPaste(type, question, text) {
  const outline = outlineFor(type, question);
  const sections = blankSections(type, question);
  const parsed = parsePasted(text).chapters;

  if (!parsed.length) {
    return { sections: [], matched: 0, total: 0, extra: 0, dropped: 0, droppedChapters: [] };
  }

  const used = new Array(parsed.length).fill(false);
  let matched = 0;

  const fill = (si, p) => {
    const target = sections[si];
    const outSubs = (outline[si] && outline[si].sub) || [];
    // 소제목이 목차와 같은 게 있으면 그 자리에, 없으면 순서대로
    const leftovers = [];
    p.blocks.forEach((b) => {
      const at = outSubs.findIndex((s, i) => keyOf(s) === keyOf(b.sub) && !target.blocks[i].body);
      if (at >= 0) target.blocks[at].body = b.body;
      else leftovers.push(b);
    });
    let cursor = 0;
    leftovers.forEach((b) => {
      while (cursor < target.blocks.length && target.blocks[cursor].body) cursor++;
      if (cursor < target.blocks.length) {
        if (b.sub) target.blocks[cursor].sub = b.sub;
        target.blocks[cursor].body = b.body;
        cursor++;
      } else {
        target.blocks.push({ sub: b.sub || '', body: b.body });
      }
    });
    matched++;
  };

  // 1) 제목이 일치하는 것부터
  sections.forEach((sec, si) => {
    const at = parsed.findIndex((p, pi) => !used[pi] && p.title && keyOf(p.title) === keyOf(sec.title));
    if (at >= 0) { used[at] = true; fill(si, parsed[at]); }
  });

  // 2) 남은 건 순서대로
  let pi = 0;
  sections.forEach((sec, si) => {
    const alreadyFilled = sec.blocks.some((b) => b.body);
    if (alreadyFilled) return;
    while (pi < parsed.length && used[pi]) pi++;
    if (pi < parsed.length) { used[pi] = true; fill(si, parsed[pi]); pi++; }
  });

  // 3) 목차보다 글이 많으면 뒤에 장으로 덧붙인다 (버리지 않는다)
  let extra = 0;
  parsed.forEach((p, i) => {
    if (used[i]) return;
    sections.push({ title: p.title || ('추가 ' + (++extra)), blocks: p.blocks });
    used[i] = true;
    extra++;
  });

  /* 안 채워진 소제목·장을 걷어낸다.
     붙여넣은 글에 없는 것을 빈 칸으로 PDF 에 싣지 않기 위해서다. */
  const pruned = pruneEmpty(sections);

  return {
    sections: pruned.sections,
    matched,
    total: pruned.sections.length,
    extra,
    dropped: pruned.dropped,
    droppedChapters: pruned.droppedChapters,
  };
}

module.exports = { blankSections, parsePasted, buildFromPaste, outlineFor, pruneEmpty, MIN_BODY };
