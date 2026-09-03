/* 전화상담 상담지 — 조립
 *
 * 만세력 계산 결과(services/manseryeok) 를 받아서
 * 「사주를 하나도 모르는 사람이 그대로 읽을 대사」로 바꾼다.
 *
 * 만세력 계산 자체는 건드리지 않는다. 여기서는 읽기만 한다.
 *
 * 나오는 모양
 *   { who, chart, facts, sections:[...], terms, prompt }
 *   section = { key, title, mins, note, picks?, blocks:[...], qs:[...] }
 *   block   = { tag, tone, say:[문장], why }
 */

const { ILGAN, GROUP, EL_NONE, EL_MANY, LUCK } = require('./data');
const TERMS = require('./terms');

const GROUP_OF = {
  비견: '비겁', 겁재: '비겁',
  식신: '식상', 상관: '식상',
  편재: '재성', 정재: '재성',
  편관: '관성', 정관: '관성',
  편인: '인성', 정인: '인성',
};
const EL5 = ['목', '화', '토', '금', '수'];

function nz(v, d) { return v == null ? d : v; }

/* 받침에 따라 조사를 고른다. 「화이 없어서」 같은 말이 안 나오게.
   대사를 소리 내어 읽는 화면이라 조사 하나가 어긋나면 바로 티가 난다. */
function batchim(word) {
  const s = String(word || '');
  if (!s) return 0;
  const c = s.charCodeAt(s.length - 1);
  if (c < 0xac00 || c > 0xd7a3) return 0;
  return (c - 0xac00) % 28;   /* 0 이면 받침 없음, 8 이면 ㄹ */
}
function josa(word, withBat, without) {
  return batchim(word) ? withBat : without;
}
/* 「수예요」 / 「금이에요」 */
function yeyo(word) { return batchim(word) ? '이에요' : '예요'; }
/* 「경오로」 / 「신미로」 — ㄹ 받침도 「로」를 쓴다 */
function ro(word) { const b = batchim(word); return (b === 0 || b === 8) ? '로' : '으로'; }

/* 이 사람 이름을 대사에 박는다. 「당신」은 쓰지 않는다. */
function fill(s, name, extra) {
  let out = String(s == null ? '' : s).replace(/\{이름\}/g, name || '고객');
  if (extra) {
    for (const k of Object.keys(extra)) {
      out = out.split('{' + k + '}').join(extra[k] == null ? '' : String(extra[k]));
    }
  }
  return out;
}

/* ── 계산 결과에서 필요한 사실만 뽑는다 ─────────────────── */
function readFacts(saju, opts) {
  const d = saju.detail || {};
  const timeKnown = saju.timeKnown !== false;

  /* 십성 세기 — 일간 자신은 뺀다. 시를 모르면 시주도 뺀다. */
  const spots = [];
  for (const p of ['year', 'month', 'day', 'hour']) {
    if (p === 'hour' && !timeKnown) continue;
    const c = d[p];
    if (!c) continue;
    if (p !== 'day' && c.stem && c.stem.god) spots.push(c.stem.god);
    if (c.branch && c.branch.god) spots.push(c.branch.god);
  }
  const god = {};
  const grp = { 비겁: 0, 식상: 0, 재성: 0, 관성: 0, 인성: 0 };
  for (const g of spots) {
    god[g] = (god[g] || 0) + 1;
    const G = GROUP_OF[g];
    if (G) grp[G] += 1;
  }

  const els = saju.elements || {};
  const none = EL5.filter((e) => !els[e]);
  const many = EL5.filter((e) => (els[e] || 0) >= 4);

  /* 신강·신약 — 내 편(비겁+인성)이 절반을 넘는지로 본다.
     계산기가 따로 판단값을 주지 않아 여기서 셈한다. */
  const mine = grp.비겁 + grp.인성;
  const total = spots.length || 1;
  const weak = mine / total < 0.4;

  const dw = saju.daewoon || {};
  const list = dw.list || [];
  const yl = saju.yearLuck || {};
  const cur = yl.currentDaewoon || null;

  let curIdx = -1;
  if (cur && cur.age != null) {
    curIdx = list.findIndex((x) => x.age === cur.age);
  }
  if (curIdx < 0 && opts && opts.age != null) {
    for (let i = 0; i < list.length; i++) if (list[i].age <= opts.age) curIdx = i;
  }
  const curDw = curIdx >= 0 ? list[curIdx] : null;
  const nextDw = curIdx >= 0 ? list[curIdx + 1] : null;

  /* 대운·세운을 십성 무리로 읽는다.
     계산기는 원국에만 십성을 붙여주므로 대운은 오행 관계로 셈한다. */
  const seGod = yl.sewoon && yl.sewoon.stem ? yl.sewoon.stem.god : null;
  const seBrGod = yl.sewoon && yl.sewoon.branch ? yl.sewoon.branch.god : null;

  const ilKo = saju.dayMasterKo || (d.day && d.day.stem && d.day.stem.ko) || '무';
  const il = ILGAN[ilKo] || ILGAN['무'];

  return {
    timeKnown, god, grp, els, none, many, weak, il, ilKo,
    dwList: list, curDw, nextDw, curIdx,
    dwGroup: curDw ? groupOfStem(saju, curDw.stem) : null,
    dwBrGroup: curDw ? groupOfBranch(saju, curDw.branch) : null,
    seGroup: GROUP_OF[seGod] || null,
    seBrGroup: GROUP_OF[seBrGod] || null,
    sewoon: yl.sewoon || null,
    year: yl.year || new Date().getFullYear(),
    gongmang: (saju.gongmang && saju.gongmang.ko) || [],
    forward: dw.forward !== false,
  };
}

/* 대운 천간·지지가 이 일간에게 무슨 십성인지.
   계산기가 원국에만 십성을 붙여줘서, 같은 글자를 원국에서 찾아 쓴다.
   못 찾으면 오행 관계로 셈한다. */
const STEM_EL = { 甲:'목',乙:'목',丙:'화',丁:'화',戊:'토',己:'토',庚:'금',辛:'금',壬:'수',癸:'수' };
const BRANCH_EL = { 子:'수',丑:'토',寅:'목',卯:'목',辰:'토',巳:'화',午:'화',未:'토',申:'금',酉:'금',戌:'토',亥:'수' };
const GEN = { 목:'화', 화:'토', 토:'금', 금:'수', 수:'목' };   // 생
const OVR = { 목:'토', 화:'금', 토:'수', 금:'목', 수:'화' };   // 극

function relGroup(dayEl, el) {
  if (!dayEl || !el) return null;
  if (el === dayEl) return '비겁';
  if (GEN[dayEl] === el) return '식상';
  if (OVR[dayEl] === el) return '재성';
  if (OVR[el] === dayEl) return '관성';
  if (GEN[el] === dayEl) return '인성';
  return null;
}
function groupOfStem(saju, ch) { return relGroup(saju.dayMasterElement, STEM_EL[ch]); }
function groupOfBranch(saju, ch) { return relGroup(saju.dayMasterElement, BRANCH_EL[ch]); }

/* ── 각 칸 만들기 ──────────────────────────────────────── */

function sayBlock(tag, tone, lines, why) {
  return { tag: tag || '', tone: tone || 'say', say: (lines || []).filter(Boolean), why: why || '' };
}

/* 1. 첫마디 */
function secOpen(w, f) {
  const t = w.timeText;
  return {
    key: 'open', title: '첫마디', mins: '약 1분',
    note: '그대로 읽으시면 됩니다. 생년월일 확인은 꼭 하세요 — 정보가 틀리면 풀이가 전부 틀립니다.',
    blocks: [
      sayBlock('읽으세요', 'say', [
        '안녕하세요, {이름}님. ' + (w.teacher || '루월당') + '입니다.',
        w.birthText + (t ? ' ' + t : '') + (w.region ? ', ' + w.region : '') + '\n이렇게 태어나신 거 맞으실까요?',
        '네, 확인됐습니다. 사주 보면서 말씀드릴게요.\n편하게 들으시면 되고, 중간에 궁금한 거 있으시면 언제든 끊고 물어보세요.',
        '오늘은 이렇게 진행할게요.\n\n먼저 {이름}님 사주가 어떻게 생겼는지 짚어드리고,\n그다음에 성격이랑 기질 쪽을 좀 자세히 볼 거예요.\n\n그리고 궁금하신 것들 여쭤보면서\n앞으로 흐름이 어떻게 가는지까지 말씀드릴게요.',
        '혹시 오늘 특별히 꼭 듣고 싶으신 게 있으실까요?',
      ], '마지막 질문을 꼭 하세요. 손님이 진짜 궁금한 걸 여기서 말해줍니다. 그걸 듣고 나면 어느 칸을 두껍게 갈지 정해집니다. 「메모」에 적어두면 GPT 프롬프트에 같이 들어갑니다.'),
    ],
    qs: [
      { q: '태어난 시간을 모르는데요',
        a: '시간을 모르시면 시주는 빼고 봐드릴게요.\n나머지 세 기둥으로도 충분히 나옵니다.',
        tip: '시와 관련된 이야기는 하지 마세요. 자식·말년 자리는 언급하지 않습니다.' },
      { q: '음력인데요 / 윤달인데요',
        a: '음력으로 알고 계시면 양력으로 바꿔서 계산해요.\n윤달에 태어나셨는지만 확인해 주시면 됩니다.',
        tip: '윤달 여부를 잘못 넣으면 사주가 통째로 달라집니다. 반드시 확인하세요.' },
      { q: '얼마나 걸려요?',
        a: '30분 정도 볼 거예요.\n중간에 궁금하신 거 물어보셔도 되고요.',
        tip: '' },
    ],
  };
}

/* 2. 사주 풀이 — 원국을 손님에게 읽어준다 */
function secChart(w, f) {
  const il = f.il;
  const blocks = [];

  blocks.push(sayBlock('① 사주가 뭔지부터', 'say', [
    '{이름}님 사주는 글자 여덟 개로 되어 있어요.\n태어난 해, 달, 날, 시 — 이렇게 네 칸이고\n칸마다 글자가 두 개씩 있습니다.',
    '이 중에서 태어난 날의 위쪽 글자가 제일 중요해요.\n그게 {이름}님 본인이거든요.\n\n{이름}님은 그게 ' + il.name + '이에요.',
  ], '용어를 쓰되 쓰자마자 바로 쉬운 말로 풀어주세요. 풀지 않고 용어만 쓰면 손님은 무시당했다고 느낍니다.'));

  blocks.push(sayBlock('② 일간 — 이 사람이 누구인지', 'say', il.body,
    '일간 ' + il.name + '(' + il.mul + ')의 물상 해석입니다. 더 할 말이 필요하면 아래 「더 할 말」을 보세요.'));

  /* 많은 것 */
  const bigG = ['관성', '재성', '식상', '인성', '비겁']
    .map((g) => ({ g, n: f.grp[g] }))
    .sort((a, b) => b.n - a.n)[0];
  if (bigG && bigG.n >= 3 && GROUP[bigG.g].many.say.length) {
    blocks.push(sayBlock('③ 많은 것 — ' + bigG.g, 'say',
      ['{이름}님 사주에서 제일 많은 게 ' + GROUP[bigG.g].label + '이에요.\n쉽게 말하면 ' + GROUP[bigG.g].mean + '이요.']
        .concat(GROUP[bigG.g].many.say),
      GROUP[bigG.g].many.why + ' (' + bigG.n + '개)'));
  }

  /* 없는 오행 — 이게 대개 상담의 뿌리다 */
  if (f.none.length) {
    for (const e of f.none.slice(0, 2)) {
      blocks.push(sayBlock('④ 없는 것 — ' + e + josa(e,'이','가') + ' 없습니다', 'warn',
        [EL_NONE[e].say],
        EL_NONE[e].why + ' 여기서 손님이 울컥하는 경우가 많습니다. 말한 뒤 3초 기다려 주세요.'));
    }
  } else if (f.many.length) {
    blocks.push(sayBlock('④ 치우친 것', 'say',
      [EL_MANY[f.many[0]]], '오행 ' + f.many[0] + ' 과다.'));
  } else {
    blocks.push(sayBlock('④ 고른 사주', 'say', [
      '{이름}님 사주는 다섯 기운이 고르게 있어요.\n\n한쪽으로 치우친 데가 없어서\n큰 굴곡 없이 가시는 편이에요.\n\n대신 특별히 튀는 재주도 잘 안 드러나요.\n{이름}님이 뭘 잘하는지 늦게 아신 편일 거예요.',
    ], '오행이 고릅니다. 무난한 대신 특징이 흐립니다. 「없는 것」으로 못 여는 대신 대운으로 이야기를 만드세요.'));
  }

  /* 없는 십성 */
  const zeroG = ['인성', '식상', '재성', '관성', '비겁'].filter((g) => !f.grp[g]);
  if (zeroG.length) {
    const g = zeroG[0];
    blocks.push(sayBlock('⑤ 비어 있는 자리 — ' + g, 'warn',
      GROUP[g].none.say, GROUP[g].none.why));
  }

  /* 버팀목 */
  blocks.push(sayBlock('⑥ 그래도 좋은 것', 'ok',
    f.weak
      ? ['{이름}님이 지금까지 버텨오신 건\n운이 좋아서가 아니라 {이름}님이 애쓰셔서예요.\n\n타고난 힘보다 짊어진 게 많은 사주인데\n여기까지 오셨잖아요.\n\n그건 사주로 설명이 안 되는 거예요.\n{이름}님이 하신 거죠.']
      : ['{이름}님은 타고난 힘이 좋으세요.\n\n남들 같으면 무너질 상황에서도 서 계실 거예요.\n\n지금까지 안 무너지고 오신 게\n운이 좋아서가 아니라 {이름}님이 강해서예요.'],
    f.weak ? '신약. 여기서 손님을 인정해 주고 넘어가세요. 앞에서 「없다」는 말을 많이 했으니 반드시 세워주고 나가야 합니다.'
           : '신강. 힘이 있으니 쓸 데를 찾아주는 쪽으로 상담을 끌고 가세요.'));

  return {
    key: 'chart', title: '사주 풀이', mins: '약 3~4분',
    note: '손님에게 사주판을 읽어주는 칸입니다. 여기서 「진짜 보는구나」 하는 인상이 생깁니다.',
    blocks,
    qs: [
      { q: '그게 무슨 뜻이에요? (용어를 되물을 때)',
        a: '', tip: '「용어」 칸에서 검색하세요. 통화 중에 3초면 찾습니다.' },
      { q: '사주는 정해진 거 아니에요? 바꿀 수 없잖아요',
        a: '타고난 건 못 바꾸는데 쓰는 법은 바꿀 수 있어요.\n같은 사주라도 어떻게 쓰느냐에 따라 사는 게 달라집니다.\n\n사주는 정답지가 아니라 설명서에 가까워요.',
        tip: '이 답은 외워두세요. 거의 매번 나옵니다.' },
      { q: '제 사주 안 좋은 건가요?',
        a: '나쁜 사주라는 건 없어요.\n\n{이름}님 사주는 ' + (f.weak ? '섬세하고 사람 마음을 잘 아는' : '버티는 힘이 아주 좋은') + ' 사주예요.\n다만 ' + (f.weak ? '다 짊어지시는 게' : '혼자 밀어붙이시는 게') + ' 힘든 거지,\n사주가 나빠서가 아닙니다.',
        tip: '어떤 사주에나 쓸 수 있고 실제로 맞습니다. 외워두세요.' },
      { q: '띠로만 봐도 되는 거 아니에요?',
        a: '띠는 여덟 글자 중에 하나예요.\n사주의 8분의 1만 보는 거죠.\n\n같은 띠여도 나머지 일곱 글자가 다 달라서\n사는 게 완전히 다릅니다.',
        tip: '' },
    ],
  };
}

/* 3. 맞히기 */
function secHit(w, f) {
  const cand = [];

  if (f.grp.인성 === 0) cand.push({
    say: ['{이름}님은 힘들 때 누구한테 말을 못 하시죠.\n\n말해봐야 뭐 하나 싶고,\n말하고 나면 더 초라해지는 것 같고.'],
    why: '인성 0. 받는 회로가 없습니다. 이 사주에서 제일 아픈 자리라 여기서 손님이 울컥합니다. 말한 뒤 2~3초 기다려 주세요.',
  });
  if (f.grp.관성 >= 3) cand.push({
    say: ['해야 할 일이 머릿속에 항상 여러 개 떠 있으실 거예요.\n뭘 먼저 해야 할지 헷갈리고, 다 해야 할 것 같고.\n\n쉬고 있어도 쉬는 것 같지가 않으시죠.'],
    why: '관성 ' + f.grp.관성 + '개. 스스로를 압박합니다. 관살혼잡이면 기준이 여러 개라 늘 헷갈립니다.',
  });
  if (f.grp.비겁 >= 2 && f.grp.인성 === 0) cand.push({
    say: ['{이름}님은 힘들어도 티를 잘 안 내세요.\n주변에서 “너는 알아서 잘하잖아” 이런 말 많이 들으셨을 거예요.\n\n그래서 정작 힘들 때 아무도 안 물어봐 주죠.'],
    why: '비겁이 뿌리라 버팁니다. 인성이 없어 표현은 안 합니다. 그래서 늘 괜찮아 보입니다.',
  });
  if (f.god.편재 && !f.god.정재) cand.push({
    say: ['돈은 들어오는데 일정하지가 않으셨을 거예요.\n한 번에 목돈이 들어왔다가 한동안 없다가, 이런 식으로요.\n\n그래서 돈이 있어도 마음이 안 놓이시죠.'],
    why: '편재만 있고 정재가 없습니다. 목돈형이라 고정 수입이 아닙니다.',
  });
  if (f.grp.식상 === 0) cand.push({
    say: ['하고 싶은 말을 그 자리에서 못 하실 때가 많으시죠.\n\n집에 와서 그때 이 말을 할걸, 하고 생각하신 적 있으실 거예요.'],
    why: '식상 0. 표현하는 통로가 없습니다. 안에 담아두고 나중에 후회합니다.',
  });
  if (f.grp.관성 >= 3 && f.grp.인성 === 0) cand.push({
    say: ['그리고 남한테 일을 잘 못 맡기세요.\n맡겼다가 결국 다시 가져와서 본인이 하시죠.\n\n부탁하는 것도 어려워하시고요.'],
    why: '관성 과다(기준이 높음) + 인성 부재(기대는 회로 없음). 전형적인 「결국 내가 다 함」입니다.',
  });
  if (f.none.indexOf('화') > -1) cand.push({
    say: ['손발이 찬 편이시죠.\n아침에 잘 못 일어나시고요.\n\n그리고 신경 쓰면 바로 속으로 오실 거예요.'],
    why: '화 0. 한(寒)합니다. 몸이 차고 소화기가 약합니다. 병명은 절대 말하지 마세요.',
  });
  if (f.none.indexOf('금') > -1) cand.push({
    say: ['{이름}님은 정리를 잘 못 하세요.\n\n아닌 걸 알면서도 계속 붙들고 계시죠.\n사람이든 일이든요.'],
    why: '금 0. 끊어내는 기운이 없습니다. 관계와 일을 오래 끕니다.',
  });
  if (f.none.indexOf('수') > -1) cand.push({
    say: ['{이름}님은 쉬는 법을 모르세요.\n\n쉬고 있어도 마음이 안 쉬어지죠.\n뭘 해야 할 것 같고요.'],
    why: '수 0. 유연함과 휴식의 기운이 없습니다.',
  });

  /* 20대·30대 등 지나온 대운으로 하나 */
  const past = f.dwList.filter((x) => x.age >= 11 && x.age < (f.curDw ? f.curDw.age : 99));
  if (past.length) {
    const hard = past.map((x) => ({ x, g: groupOfStem({ dayMasterElement: w.dayEl }, x.stem) }))
      .filter((o) => f.weak ? (o.g === '재성' || o.g === '관성') : (o.g === '비겁'));
    if (hard.length) {
      const h = hard[hard.length - 1].x;
      cand.push({
        say: [h.age + '대가 특히 힘드셨을 것 같아요.\n' + h.age + '살부터 ' + (h.age + 9) + '살 사이요.\n\n일이 많았거나, 사람 때문에 지치셨거나,\n아무튼 쉬지 못하고 달리셨을 거예요.'],
        why: h.age + '세 ' + h.ko + ' 대운. ' + (f.weak ? '신약한데 재성·관성 대운이라 감당보다 짐이 컸습니다.' : '경쟁과 소모가 큰 구간입니다.') + ' 이게 맞으면 손님이 완전히 마음을 엽니다.',
      });
    }
  }

  const picked = cand.slice(0, 6);
  return {
    key: 'hit', title: '맞히기', mins: '약 3분',
    note: '여기서 신뢰가 갈립니다. 물어보듯 말고 단정해서 말하세요. 말한 뒤 「맞으세요?」 하고 기다리는 게 핵심입니다.',
    blocks: picked.map((c, i) => sayBlock(String(i + 1), 'say', c.say, c.why)),
    qs: [
      { q: '(안 맞다고 하실 때)', a: '아 그러세요? 그럼 이건 어떠세요.',
        tip: '우기지 마세요. 하나 틀린 건 아무도 기억 안 합니다. 우기는 건 기억합니다.' },
      { q: '어떻게 아세요?',
        a: '사주에 다 나와 있어요.\n{이름}님 여덟 글자가 그렇게 생겼거든요.',
        tip: '여기서 근거를 길게 설명하지 마세요. 궁금해하실 때만 한 줄로 풀어주세요.' },
      { q: '다 맞아요. 소름 돋네요',
        a: '이런 성향이신 분들이 공통으로 갖고 계신 부분이에요.\n{이름}님만 그러신 게 아니니까 너무 걱정 안 하셔도 돼요.',
        tip: '겁먹게 하지 마세요. 여기서 신비주의로 가면 나중에 신뢰를 잃습니다.' },
    ],
  };
}

/* 4. 성격·기질 */
function secChar(w, f) {
  const il = f.il;
  const picks = ['겉과 속', '일할 때', '사람 사이', '화날 때', '지나온 길', '오해받는 점', '타고난 기질'];
  const g = f.grp;

  /* 겉과 속 */
  const in1 = [];
  in1.push(sayBlock('겉으로 보이는 {이름}님', 'say',
    g.관성 >= 3
      ? ['겉으로 보시면 반듯한 분이에요.\n할 일 잘하시고, 약속 지키시고,\n어디 가서 실수하는 법이 없으시죠.',
         '주변에서 {이름}님을 믿음직하다고 해요.']
      : ['겉으로 보시면 편한 분이에요.\n웬만한 건 다 괜찮다고 하시고,\n잘 웃으시고, 화도 잘 안 내시고.',
         '주변에서 {이름}님을 편하다고 해요.\n같이 있으면 부담이 없다고요.'],
    ''));
  in1.push(sayBlock('그런데 속은', 'warn',
    g.인성 === 0
      ? ['그런데 속으로는 다 기억하고 계세요.',
         '괜찮다고 했지만 안 괜찮았던 거,\n넘어갔지만 서운했던 거,\n말 안 했지만 알고 있던 거.\n\n전부 어딘가에 쌓여 있어요.',
         '{이름}님은 잊는 분이 아니라 안 꺼내는 분이에요.',
         '그리고 그게 어느 순간 한 번에 나와요.\n그것도 엉뚱한 일에서요.']
      : ['그런데 속으로는 생각이 훨씬 많으세요.',
         '겉으로 보이는 것보다\n{이름}님 안에서 도는 게 많습니다.',
         '그걸 다 말하지는 않으시죠.\n말해봐야 복잡해지니까요.'],
    g.인성 === 0
      ? '인성 부재 + 담아두는 일간. 「잊는 사람이 아니라 안 꺼내는 사람」 — 이 표현이 핵심입니다. 여기서 손님이 조용해지거나 한숨을 쉬면 맞은 겁니다. 재촉하지 말고 기다리세요.'
      : '인성이 있어 안에서 소화는 됩니다. 다만 밖으로 다 내지는 않습니다.'));

  /* 일할 때 */
  const in2 = [sayBlock('', 'say', il.work, '일간 ' + il.name + '의 일하는 방식입니다.')];
  if (g.관성 >= 3) in2.push(sayBlock('여기에 더해서', 'say',
    ['그리고 {이름}님은 완벽하게 될 것 같지 않으면\n아예 시작을 안 하세요.\n\n준비가 덜 된 것 같고, 더 알아봐야 할 것 같고,\n그러다 시기를 놓치신 적 있으실 거예요.'],
    '관살혼잡 — 맞춰야 할 기준이 여러 개라 준비만 길어집니다.'));
  if (g.식상 === 0) in2.push(sayBlock('그리고', 'say',
    ['인정받고 싶은 마음도 크신데\n그걸 말로는 절대 안 하세요.\n\n알아서 알아봐 주기를 기다리시는 편이에요.'],
    '식상 부재. 인정 욕구는 있는데 표현 통로가 없습니다.'));

  /* 사람 사이 */
  const in3 = [sayBlock('', 'say', il.people, '일간 ' + il.name + '의 대인 방식입니다.')];
  if (g.인성 === 0) in3.push(sayBlock('그리고', 'warn',
    ['사람들이 {이름}님한테 고민을 많이 털어놔요.\n들어주시니까요.\n\n그런데 정작 {이름}님은\n누구한테 털어놓으시나요?',
     '아마 없으실 거예요.\n있어도 반만 말하시죠.'],
    '인성 부재. 받는 회로가 없어 들어주기만 합니다. 이 질문은 던지고 반드시 기다리세요.'));
  if (g.관성 >= 3) in3.push(sayBlock('부탁에 대해서', 'warn',
    ['그리고 부탁을 못 거절하세요.\n거절하면 관계가 어색해질 것 같고,\n어차피 내가 하면 되니까 싶고.\n\n그렇게 계속 떠안으십니다.'],
    '관성 과다 — 남의 시선이 기준이라 거절이 어렵습니다.'));

  /* 화날 때 */
  const in4 = [sayBlock('', 'say', il.anger, '일간 ' + il.name + '의 분노 방식입니다.')];
  if (g.인성 === 0) in4.push(sayBlock('지칠 때는', 'warn',
    ['지치실 때는 잠수하세요.\n연락 다 끊고 혼자 계시죠.\n\n그게 나쁜 게 아니라 {이름}님이 회복하는 방식이에요.\n다만 회복이 좀 오래 걸리세요.'],
    '인성 부재 = 실시간 소화 불가 → 누적 후 차단. 회복이 느립니다.'));

  /* 지나온 길 — 대운 */
  const in5 = [];
  const passed = f.dwList.filter((x) => x.age <= (f.curDw ? f.curDw.age : 99));
  for (const dwx of passed.slice(1, 5)) {
    const gg = groupOfStem({ dayMasterElement: w.dayEl }, dwx.stem);
    const L = gg && LUCK[gg] ? LUCK[gg][f.weak ? 'weak' : 'strong'] : null;
    if (!L) continue;
    const isNow = f.curDw && dwx.age === f.curDw.age;
    in5.push(sayBlock(dwx.age + '~' + (dwx.age + 9) + '세' + (isNow ? ' · 지금' : ''),
      isNow ? 'ok' : 'say',
      [(isNow ? '그리고 지금은요, ' : '') + L.say],
      dwx.ko + ' 대운 (' + gg + '). ' + L.head + '. ' + (f.weak ? '신약' : '신강') + ' 기준으로 읽었습니다.'));
  }
  if (!in5.length) in5.push(sayBlock('', 'say',
    ['{이름}님은 지금까지 큰 굴곡 없이 오신 편이에요.'], '대운 자료가 부족합니다.'));

  /* 오해받는 점 */
  const mis = [];
  if (g.식상 === 0) mis.push('무심하다는 말이요.\n실은 다 알고 계신데 표현을 안 하시는 거죠.');
  if (g.비겁 >= 2 || !f.weak) mis.push('괜찮은 줄 안다는 거요.\n아무도 안 물어봐 주죠. 알아서 잘하는 사람이니까요.');
  if (g.관성 >= 3) mis.push('고집 세다는 말이요.\n고집이 아니라 오래 생각하고 정하신 거라\n쉽게 못 바꾸시는 거예요.');
  if (g.인성 === 0) mis.push('차갑다는 말이요.\n차가운 게 아니라 표현하는 법을 안 배우신 거예요.');
  if (g.식상 >= 3) mis.push('말이 세다는 거요.\n{이름}님은 사실만 말한 건데 상대는 다르게 듣죠.');
  if (!mis.length) mis.push('속을 모르겠다는 말이요.\n{이름}님은 다 말한 것 같은데 상대는 그렇게 안 느끼죠.');
  const in6 = [
    sayBlock('', 'say',
      ['{이름}님이 자주 듣는 오해가 몇 개 있으실 거예요.'].concat(mis)
        .concat(['이거 억울하셨을 것 같은데,\n어디 가서 말은 안 하셨을 것 같아요.']),
      '마지막 「억울했을 텐데 말은 안 했을 것 같다」가 이 칸의 핵심입니다. 여기서 마음이 열립니다.'),
  ];

  /* 타고난 기질 */
  const in7 = [sayBlock('', 'say', [il.one],
    '일간 ' + il.name + '의 물상을 한 문장으로 요약한 것입니다. 마무리 멘트로 그대로 쓰셔도 좋습니다.')];
  if (f.none.length) {
    in7.push(sayBlock('다만 하나만', 'warn',
      ['다만 하나만요.\n\n' + shortNeed(f)],
      '없는 오행을 물상으로 풀어낸 것입니다. 이 사주 전체를 한 문장으로 요약하므로 마무리에도 씁니다.'));
  }

  return {
    key: 'char', title: '성격 · 기질', mins: '약 5~7분 · 제일 두꺼운 곳',
    note: '여기가 상담의 몸통입니다. 순서대로 다 읽으면 7분이 채워집니다. 손님이 「맞아요」 하면 그 항목을 더 파고, 반응이 약하면 넘기세요.',
    picks,
    groups: [in1, in2, in3, in4, in5, in6, in7],
    blocks: [],
    qs: [
      { q: '제가 왜 그런 거예요?',
        a: '타고난 기운이 그렇게 생겨서예요.\n{이름}님이 잘못하신 게 아니라\n원래 그런 쪽으로 태어나신 거예요.',
        tip: '「고쳐야 한다」가 아니라 「알고 쓰면 된다」로 끌고 가세요.' },
      { q: '이거 고칠 수 있어요?',
        a: '고친다기보다 아는 게 먼저예요.\n\n알고 계시면 같은 상황에서 다르게 하실 수 있어요.\n모르고 계실 때가 제일 힘든 거예요.',
        tip: '' },
      { q: '제 성격이 문제인가요?',
        a: '문제가 아니에요.\n{이름}님을 여기까지 오게 한 게 그 성격이에요.\n\n다만 그게 {이름}님을 힘들게 하는 지점이 있으니\n거기만 조절하시면 돼요.',
        tip: '조심할 점을 말한 뒤에는 반드시 세워주고 넘어가세요. 지적으로 끝나면 상담이 아니라 훈계가 됩니다.' },
    ],
  };
}

function shortNeed(f) {
  const e = f.none[0];
  const M = {
    목: '나무가 없으신데,\n{이름}님한테는 시작할 핑계가 하나 필요해요.\n\n완벽하게 준비되고 시작하려 하지 마세요.\n{이름}님은 하면서 배우는 게 빠른 분이에요.',
    화: '{이름}님한테 지금 필요한 건 볕이에요.\n\n산도 볕이 들어야 나무가 자라요.\n그늘진 산은 아무것도 못 키웁니다.\n\n쉬는 거, 받는 거, 볕 드는 거.\n그게 {이름}님한테 필요한 전부예요.',
    토: '{이름}님한테는 발 디딜 데가 하나 필요해요.\n\n다 흔들려도 여기는 안 흔들린다,\n그런 게 하나 있어야 편해지세요.\n\n사람이든 장소든 습관이든요.',
    금: '{이름}님한테는 끊는 연습이 필요해요.\n\n아닌 걸 아닌 채로 두고 계시면\n{이름}님이 계속 소모되세요.\n\n한 번에 다 끊으실 필요는 없고\n하나만 정리해 보세요.',
    수: '{이름}님한테는 쉬는 게 약이에요.\n\n{이름}님은 쉬는 걸 게으른 거라고 생각하시는데\n{이름}님한테는 그게 일이에요.\n\n쉬셔야 다음 게 나옵니다.',
  };
  return M[e] || '';
}

/* 5. 운세 — 주제별 */
function secLuck(w, f) {
  const g = f.grp;
  const picks = ['총운', '연애·결혼', '재물', '직업', '건강', '학업·시험', '가족', '이사·방향'];
  const groups = [];
  const grades = [];

  /* 총운 */
  const dwL = f.dwGroup && LUCK[f.dwGroup] ? LUCK[f.dwGroup][f.weak ? 'weak' : 'strong'] : null;
  groups.push([
    sayBlock('총운', 'say', [
      '{이름}님 사주를 한마디로 하면\n' + (f.weak
        ? '타고난 힘보다 짊어진 게 많은 사주예요.'
        : '힘은 좋은데 그 힘을 쓸 데가 필요한 사주예요.'),
      f.none.length
        ? EL_NONE[f.none[0]].say.split('\n\n')[0] + '\n\n그게 {이름}님을 계속 아쉽게 했을 거예요.'
        : '큰 굴곡 없이 오신 편이에요.',
      dwL ? '그런데 지금은 ' + dwL.head + '예요.\n\n' + dwL.say : '',
    ], '신' + (f.weak ? '약' : '강') + ' / 현재 대운 ' + (f.curDw ? f.curDw.ko : '?') + (f.dwGroup ? ' (' + f.dwGroup + ')' : '')),
  ]);
  grades.push({ g: '—', k: '총운', n: f.weak ? '짊어진 게 많은 사주' : '힘이 좋은 사주' });

  /* 연애·결혼 — 상태 고르기 */
  const loveWhy = g.관성 >= 3
    ? '관성 과다. 인연은 많이 오나 부담으로 옵니다.' + (g.인성 === 0 ? ' 인성이 없어 받는 걸 못 합니다.' : '')
    : g.관성 === 0
      ? '관성 부재. 매이는 걸 싫어해 인연이 오래 가기 어렵습니다.'
      : '관성 적정. 인연 자체는 무난합니다.';
  const loveHead = g.관성 >= 3
    ? ['{이름}님은 인연이 안 오는 사주가 아니에요.\n오히려 많이 오는 쪽입니다.',
       '다만 오는 인연이 편하게 안 느껴지세요.\n좋은 사람인데도 부담스럽고,\n잘해줘도 갚아야 할 것 같고.']
    : g.관성 === 0
      ? ['{이름}님은 매이는 걸 답답해하시는 편이에요.',
         '좋아도 갇히는 느낌이 들면 밀어내시죠.\n그래서 오래 가는 인연이 적으셨을 거예요.']
      : ['{이름}님은 인연 자체는 무난하게 오시는 편이에요.',
         '크게 굴곡 없이 만나고 가시는 쪽이에요.'];

  const loveStates = [
    { k: '솔로', b: [
      sayBlock('', 'say', loveHead.concat([
        f.dwGroup === '식상'
          ? '지금은 안 만나지는 게 아니라\n안 만나는 게 맞는 때예요.\n\n{이름}님 안에서 정리가 일어나는 시기라\n지금 만나면 또 맞춰드리게 됩니다.'
          : f.dwGroup === '관성'
            ? '지금은 인연이 붙는 때예요.\n\n소개나 모임 같은 자리에 나가보세요.\n{이름}님이 가만히 계시면 안 옵니다.'
            : '지금은 급하게 찾지 않으셔도 되는 때예요.\n\n{이름}님이 편해지시면 사람이 붙습니다.',
      ]), loveWhy + ' 현재 대운 ' + (f.dwGroup || '?') + ' 기준.'),
    ]},
    { k: '연애 중', b: [
      sayBlock('', 'say', [
        f.dwGroup === '식상'
          ? '지금 만나는 분한테\n요즘 유난히 트집이 잡히지 않으세요?\n\n전에는 넘어가던 게 요즘은 걸리실 거예요.'
          : '지금 만나는 분이랑은\n{이름}님이 맞춰주시는 편이시죠?',
        f.dwGroup === '식상'
          ? '그게 그 사람이 변한 게 아니라\n{이름}님이 참지 않게 되는 때라 그래요.\n\n그래서 지금 결정하시는 건 조심하셔야 해요.'
          : '{이름}님은 서운한 걸 말 안 하시고\n혼자 정리하시는 편이에요.',
        '다만 참기만 하지는 마세요.\n말을 하셔야 해요.\n\n{이름}님은 말 안 하고 혼자 결론 내시거든요.\n상대는 갑자기 끝난 걸로만 기억합니다.',
      ], loveWhy + (f.dwGroup === '식상' ? ' 상관대운이라 상대의 흠이 유독 크게 보이는 시기입니다(상관견관).' : '')),
    ]},
    { k: '헤어짐·재회', b: [
      sayBlock('', 'say', [
        '먼저 여쭤볼게요.\n헤어진 게 {이름}님이 결정하신 건가요, 상대분이었나요?',
        f.dwGroup === '식상'
          ? '지금 {이름}님한테는 끊어내는 기운이 들어와 있어요.\n\n그래서 이 시기에 끝난 인연은\n다시 붙여도 같은 이유로 또 끝나는 경우가 많습니다.'
          : '지금은 다시 이어질 여지가 있는 때예요.\n\n다만 왜 끝났는지가 정리되지 않으면\n같은 자리에서 또 끝납니다.',
        '돌아가고 싶으신 마음이\n그 사람이 좋아서인지,\n혼자 있는 게 힘들어서인지\n한 번만 나눠서 보세요.',
        '다시 만나신다면 조건이 하나 있어요.\n\n전에 말 못 하고 넘어갔던 걸\n이번엔 말하셔야 합니다.\n\n그것만 되면 가능합니다.',
      ], '재회는 특히 조심. 「된다/안 된다」로 단정하지 마세요. 조건을 걸어주는 방식이 안전하고 실제로도 맞습니다.'),
    ]},
    { k: '결혼 고민', b: [
      sayBlock('', 'say', [
        '결혼 자체가 안 맞는 사주는 아니에요.\n오히려 가정을 잘 지키는 쪽입니다.',
        f.dwGroup === '식상'
          ? '다만 지금 결정하시는 건 권하지 않아요.\n지금은 {이름}님 안에서 정리가 일어나는 때라\n이때 정한 건 나중에 흔들립니다.'
          : '지금은 결정하셔도 괜찮은 때예요.',
        '그리고 상대를 보실 때 하나만 봐주세요.\n\n잘난 사람보다,\n옆에 있으면 마음이 놓이는 사람이요.',
        g.인성 === 0
          ? '{이름}님은 이미 스스로를 충분히 몰아붙이고 계셔서\n같이 몰아붙이는 사람 만나면 정말 힘들어지세요.\n\n그리고 물어봐 주는 사람이어야 해요.\n{이름}님이 말을 잘 안 하시니까요.'
          : '{이름}님 말을 끝까지 들어주는 사람이 맞으세요.',
      ], loveWhy + ' 「편하게 해주는 사람」이 정답이고 거의 틀리지 않습니다. 시기는 연도를 집지 말고 「지금은 아니다」까지만.'),
    ]},
    { k: '부부 문제', b: [
      sayBlock('', 'say', [
        '요즘 참아온 게 올라오시죠.\n전에는 넘어가던 게 요즘은 안 넘어가실 거예요.',
        '그게 {이름}님이 예민해지신 게 아니라\n그동안 너무 많이 참으신 거예요.\n쌓인 게 이제 나오는 겁니다.',
        '그러니까 지금 필요한 건 참는 게 아니라 말하는 거예요.\n\n한 번에 다 말하려 하지 마시고\n하나씩, 화 안 났을 때 말하세요.',
        '{이름}님은 다 참다가 한 번에 터뜨리시는데\n그러면 상대는 갑자기 터진 걸로만 기억합니다.\n\n{이름}님이 얼마나 참았는지는 아무도 모르고요.\n그게 제일 억울한 일이에요.',
      ], '이혼하라 마라는 절대 말하지 마세요. 「말하는 법」으로만 답합니다.'),
    ]},
  ];
  /* 연애 칸은 상태를 골라야 내용이 정해진다.
     나머지 주제와 모양을 맞추기 위해 첫 상태를 기본으로 두고
     전체는 states 로 따로 넘긴다. */
  groups.push(loveStates[0].b);
  grades.push({ g: g.관성 >= 3 ? '주의' : (g.관성 === 0 ? '약함' : '보통'), k: '연애 · 결혼',
    n: g.관성 >= 3 ? '인연은 많이 오는데 부담으로 옴' : (g.관성 === 0 ? '매이는 걸 답답해함' : '무난하게 오는 편') });

  /* 재물 */
  const richOK = f.dwGroup === '재성' || f.dwGroup === '식상';
  groups.push([sayBlock('재물', 'say', [
    f.god.편재 && !f.god.정재
      ? '{이름}님은 월급처럼 꼬박꼬박보다는\n한 번에 크게 들어오는 쪽이세요.\n\n그래서 고정 수입만 보고 계시면 답답하실 거예요.'
      : g.재성 === 0
        ? '{이름}님은 돈을 쫓아다니는 분이 아니세요.\n있으면 쓰고 없으면 마는 쪽이시죠.\n\n그래서 받을 거 못 받고 넘어가신 적 있으실 거예요.'
        : '{이름}님은 버는 만큼 쓰는 쪽이 아니라\n쌓아두는 쪽이세요.',
    richOK
      ? '지금부터 10년은 버는 힘이 좋아지는 때예요.\n{이름}님 실력으로 버는 구간에 들어오셨습니다.'
      : '지금은 크게 벌리기보다\n있는 걸 지키시는 게 맞는 때예요.',
    g.비겁 >= 2
      ? '대신 두 가지만 조심하세요.\n\n하나는 돈 빌려주는 거요.\n또 하나는 같이 하자는 제안이요.\n\n동업은 {이름}님한테 잘 안 맞아요.\n결국 {이름}님이 다 하시게 됩니다.'
      : '',
  ], '재성 ' + g.재성 + '개' + (f.god.편재 ? ' (편재)' : '') + '. 현재 대운 ' + (f.dwGroup || '?') + '. 액수는 절대 말하지 마세요.')]);
  grades.push({ g: richOK ? '좋음' : '보통', k: '재물',
    n: f.god.편재 && !f.god.정재 ? '목돈형. 고정 수입이 아님' : '쌓아두는 쪽' });

  /* 직업 */
  groups.push([sayBlock('직업 · 일', 'say', [
    g.관성 >= 3
      ? '{이름}님은 조직에서 인정은 받으세요.\n맡기면 하는 사람이니까요.\n\n그런데 인정받는 만큼 눌리셨을 거예요.\n잘하니까 더 주고, 더 주니까 더 하고.'
      : g.관성 === 0
        ? '{이름}님은 조직 생활이 답답하셨을 거예요.\n규칙이 많은 데는 특히요.'
        : '{이름}님은 조직에서도 무난하게 가시는 편이에요.',
    f.dwGroup === '식상'
      ? '지금은 그게 안 참아지는 때로 들어오셨어요.\n그래서 나오고 싶은 마음이 드는 게 맞습니다.'
      : f.dwGroup === '관성'
        ? '지금은 자리가 생기는 때예요.\n책임이 늘어나는 대신 인정도 같이 옵니다.'
        : '지금은 크게 흔들 때가 아니에요.\n하시던 걸 다지시는 게 맞습니다.',
    '맞는 일은 ' + jobFit(f) + '이에요.',
  ], '관성 ' + g.관성 + ' / 식상 ' + g.식상 + '. 현재 대운 ' + (f.dwGroup || '?') + '. 「퇴사하세요」라고 말하지 마세요. 흐름만 짚고 결정은 손님이.')]);
  grades.push({ g: f.dwGroup === '식상' ? '전환' : '보통', k: '직업 · 일',
    n: f.dwGroup === '식상' ? '나오고 싶어지는 때' : '다지는 때' });

  /* 건강 */
  groups.push([sayBlock('건강', 'say', [
    healthLine(f),
    '{이름}님은 스트레스를 머리로 안 받고\n몸으로 받으시는 분이에요.',
    healthCare(f),
  ], '병명은 절대 입에 담지 마세요. 「병원 가보세요」까지가 최대입니다.')]);
  grades.push({ g: f.none.length ? '주의' : '보통', k: '건강', n: healthShort(f) });

  /* 학업·시험 */
  const inSe = f.seGroup === '인성' || f.seBrGroup === '인성';
  groups.push([sayBlock('학업 · 시험', 'say', [
    g.인성 === 0
      ? '지금까지 시험은 좀 아쉬우셨을 거예요.\n머리가 나쁜 게 아니라 운이 안 붙었던 거예요.\n\n공부를 안 한 게 아니라\n해도 결과가 안 나오는 쪽이셨을 겁니다.'
      : '{이름}님은 배우는 걸 잘하세요.\n한번 배우면 오래 가시고요.',
    inSe
      ? '그런데 올해가 다릅니다.\n{이름}님 인생에서 문서운이 제일 좋은 해예요.\n\n자격증이든 시험이든 계약이든,\n올해 안에 도장 찍는 일은 밀어붙이셔도 됩니다.\n\n미뤄두신 게 있으면 올해 하세요.'
      : '시험이나 자격증은\n서두르시기보다 준비를 길게 잡으시는 게 맞아요.',
  ], '인성 ' + g.인성 + '개. 올해 세운 ' + (f.sewoon ? f.sewoon.ko : '?') + (inSe ? ' — 인성이 들어옵니다. 가장 강한 카드입니다. 자신 있게 말하세요.' : '.'))]);
  grades.push({ g: inSe ? '최고' : (g.인성 === 0 ? '약함' : '보통'), k: '학업 · 시험',
    n: inSe ? '올해가 인생에서 제일 좋음' : (g.인성 === 0 ? '운이 안 붙었던 쪽' : '무난함') });

  /* 가족 */
  groups.push([sayBlock('가족', 'say', [
    g.관성 >= 3
      ? '어릴 때 기대를 많이 받고 자라셨을 거예요.\n잘해야 한다는 말을 많이 들으셨거나,\n아니면 말 안 해도 그렇게 느끼셨거나.'
      : '어릴 때 비교적 자유롭게 자라신 편이에요.',
    g.인성 === 0
      ? '손 안 가는 아이셨을 거고요.\n그게 칭찬 같지만 사실은\n안 챙겨줘도 되는 아이였다는 뜻이기도 해요.\n\n사랑을 안 받으신 건 아니에요.\n다만 표현이 오가는 집은 아니었던 것 같아요.'
      : '집에서 받은 게 {이름}님 밑천이 됐어요.',
    g.인성 === 0
      ? '지금 {이름}님이 힘들 때 말 못 하시는 게\n거기서 온 거예요.\n배운 적이 없으신 거죠.\n\n그러니까 지금이라도 한 번씩 연습해 보세요.\n“나 오늘 좀 힘들었어” 이 한마디요.'
      : '',
  ], '부모를 나쁘게 말하지 마세요. 「사랑을 안 받은 게 아니라 표현이 오가는 집이 아니었다」 — 이 표현이 안전하고 대부분 맞습니다.')]);
  grades.push({ g: '보통', k: '가족', n: g.관성 >= 3 ? '기대는 컸고 정은 아쉬움' : '비교적 자유로움' });

  /* 이사·방향 */
  groups.push([sayBlock('이사 · 방향', 'say', [
    dirLine(f),
    '부적 같은 거 안 하셔도 돼요.\n{이름}님한테 필요한 건 그런 게 아니라\n' + dirNeed(f) + '이에요.',
  ], '실생활 처방이라 만족도가 높고 부작용이 없습니다. 마지막 「부적 안 하셔도 된다」가 신뢰를 크게 올립니다. 꼭 넣으세요.')]);
  grades.push({ g: '좋음', k: '이사 · 방향', n: dirShort(f) });

  return {
    key: 'luck', title: '종합 운세', mins: '약 5분',
    note: '한눈에 보시고, 손님이 묻는 것부터 골라 말하세요. 표의 줄을 누르면 그 항목으로 갑니다.',
    picks, groups, grades, blocks: [],
    /* 연애 칸(picks 의 1번)에서만 상태를 한 번 더 고른다 */
    stateAt: 1, states: loveStates,
    qs: [
      { q: '올해는 어때요?',
        a: '올해는 ' + (inSe ? '{이름}님한테 제일 필요한 기운이 들어오는 해예요.\n숨통이 트이는 해라고 보시면 돼요.' : '크게 흔들 때가 아니라 다지는 해예요.\n하시던 걸 잘 지키시면 됩니다.'),
        tip: '올해 세운 ' + (f.sewoon ? f.sewoon.ko : '?') + '.' },
      { q: '언제쯤 좋아져요?',
        a: nextGood(f),
        tip: '연도를 딱 집지 마세요. 「이때쯤 기운이 좋아진다」까지만.' },
      { q: '제가 뭘 하면 될까요?',
        a: shortNeed(f) || '{이름}님이 지금 하고 계신 걸 그대로 하시면 돼요.\n다만 혼자 다 하려고는 하지 마세요.',
        tip: '실행할 수 있는 걸 하나만 주세요. 여러 개 주면 하나도 안 합니다.' },
      { q: '부적이나 개명 해야 하나요?',
        a: '그런 거 안 하셔도 돼요.\n{이름}님한테 필요한 건 그런 게 아니에요.',
        tip: '겁주고 물건 파는 건 신고 대상입니다. 절대 하지 마세요. 여기서 신뢰가 크게 올라갑니다.' },
    ],
  };
}

function jobFit(f) {
  if (f.grp.식상 >= 3) return '{이름}님 재주를 직접 쓰는 일';
  if (f.grp.관성 >= 3) return '내 이름으로 하는 일이에요.\n누가 시켜서 하는 것보다,\n내가 해놓은 걸 보고 사람들이 찾아오는 쪽';
  if (f.grp.재성 >= 3) return '성과가 숫자로 돌아오는 일';
  if (f.grp.인성 >= 3) return '가르치거나 정리하는 일';
  return '오래 걸리는 일이에요.\n십 년 하면 아무도 못 따라오는 일';
}
function healthLine(f) {
  if (f.none.indexOf('화') > -1) return '몸이 찬 편이세요.\n손발 차고, 아침에 잘 못 일어나시죠.\n\n그리고 신경 쓰면 바로 속으로 오실 거예요.';
  if (f.none.indexOf('수') > -1) return '몸에 열이 잘 오르세요.\n잠이 얕고, 답답한 느낌이 있으실 거예요.';
  if (f.many.indexOf('목') > -1) return '신경을 많이 쓰시는 편이라\n속이 자주 불편하실 거예요.';
  return '큰 문제는 없으신데\n무리하시면 한 번에 오는 쪽이세요.';
}
function healthCare(f) {
  if (f.none.indexOf('화') > -1) return '따뜻하게 드시고 잠 챙기시는 게\n{이름}님한테는 다른 어떤 것보다 중요합니다.\n\n찬 거, 밤늦게 먹는 거\n두 개만 줄이셔도 확실히 다릅니다.';
  if (f.none.indexOf('수') > -1) return '물 자주 드시고, 잠자리를 서늘하게 하세요.\n{이름}님은 잘 쉬는 게 제일 큰 약이에요.';
  return '규칙적으로 드시고 주무시는 게\n{이름}님한테는 제일 좋은 관리예요.';
}
function healthShort(f) {
  if (f.none.indexOf('화') > -1) return '몸이 참. 위장과 잠';
  if (f.none.indexOf('수') > -1) return '열이 오름. 잠이 얕음';
  return '무리하면 한 번에 옴';
}
function dirLine(f) {
  const e = f.none[0] || (f.weak ? '토' : '수');
  const M = {
    목: '{이름}님한테 필요한 건 푸른 기운이에요.\n\n동쪽, 나무 많은 데가 좋고\n초록색을 가까이 두세요.\n\n산책이나 걷는 것도 {이름}님한테는 약이에요.',
    화: '{이름}님한테 제일 필요한 건 볕이에요.\n\n이사하신다면 남향, 낮에 해 잘 드는 집으로 가세요.\n지금 집이 어둡거나 북향이면\n그것만 바꿔도 다릅니다.\n\n옷이나 소품도 밝은 색, 따뜻한 색으로 두세요.\n아침에 해 한 번 보고 나가시고요.',
    토: '{이름}님한테 필요한 건 안정이에요.\n\n자주 옮기지 마시고 한곳에 자리 잡으세요.\n\n집 안에 흙이나 돌 같은 걸 두시는 것도 좋고,\n노란색 계열이 잘 맞으세요.',
    금: '{이름}님한테 필요한 건 정리예요.\n\n서쪽이 좋고, 집을 비우세요.\n물건이 많으면 {이름}님이 더 무거워지세요.\n\n흰색이나 금속 느낌이 잘 맞습니다.',
    수: '{이름}님한테 필요한 건 쉼이에요.\n\n북쪽이 좋고, 물 가까운 데가 좋아요.\n\n검정이나 짙은 파랑이 맞고,\n물 자주 드시는 것도 {이름}님한테는 약이에요.',
  };
  return M[e];
}
function dirNeed(f) {
  const e = f.none[0] || '토';
  return { 목: '걷는 거랑 푸른 것', 화: '볕이랑 잠이랑 따뜻한 밥',
    토: '한곳에 자리 잡는 것', 금: '집을 비우는 것', 수: '쉬는 것' }[e];
}
function dirShort(f) {
  const e = f.none[0] || '토';
  return { 목: '동쪽, 나무 많은 곳', 화: '남쪽, 볕 드는 집',
    토: '한곳에 자리 잡기', 금: '서쪽, 비우기', 수: '북쪽, 물 가까이' }[e];
}
function nextGood(f) {
  const nx = f.nextDw;
  if (!nx) return '지금이 나쁘지 않은 때예요.\n조급해하지 않으셔도 됩니다.';
  return nx.age + '살 넘어가시면서 흐름이 한 번 바뀌어요.\n그때 좀 편해지실 거예요.\n\n다만 그때까지 기다리시라는 게 아니라,\n지금 준비하신 게 그때 열매가 되는 구조예요.';
}

/* 6. 마무리 */
function secClose(w, f) {
  return {
    key: 'close', title: '마무리', mins: '약 2분',
    note: '끝맺음이 후기를 만듭니다. 급하게 끊지 마세요.',
    blocks: [
      sayBlock('읽으세요', 'say', [
        '오늘 말씀드린 거, 정리해서 메일로 보내드릴게요.\n통화하면서 다 못 적으셨을 테니까요.',
        '그리고 마지막으로 하나만 더요.',
        f.il.one,
        shortNeed(f) || '{이름}님은 지금 잘 가고 계세요.',
        '또 궁금한 거 생기시면 편하게 연락 주세요.\n고생 많으셨어요.',
      ], '마지막 두 문단은 이 사람 사주에서 나온 말입니다. 손님마다 달라집니다 — 그 사람 사주의 가장 아픈 데를 한 번 더 짚고 끝내세요. 여기서 후기가 갈립니다.'),
    ],
    qs: [
      { q: '더 물어봐도 돼요?',
        a: '그럼요. 지금 생각나시는 거 있으면 말씀하세요.',
        tip: '여기서 끊으려 하지 마세요. 마지막 1분이 후기를 만듭니다.' },
      { q: '또 봐주실 수 있어요?',
        a: '네, 언제든 연락 주세요.\n{이름}님 사주는 제가 갖고 있으니까\n다음엔 바로 이어서 봐드릴 수 있어요.',
        tip: '재방문으로 이어지는 자리입니다. 꼭 말하세요.' },
      { q: '녹음해도 돼요?',
        a: '네, 편하게 하세요.\n정리본도 메일로 따로 보내드릴게요.',
        tip: '거절하지 마세요. 녹음을 원한다는 건 만족했다는 뜻입니다.' },
    ],
  };
}

/* ── GPT 급질문 프롬프트 ──────────────────────────────── */
/* parts:true 로 부르면 문자열 대신 { head, tail } 을 돌려준다.
   화면에서 메모와 질문을 칠 때마다 다시 만들 수 있게 하려는 것이다. */
function buildPrompt(w, f, memo, question, parts) {
  const NL = '\n';
  const d = w.chart;
  const lines = [
    '너는 30년 경력의 사주 상담가다. 나는 지금 이 손님과 전화 상담 중이고,',
    '방금 예상하지 못한 질문을 받았다. 내가 30초 안에 읽고 그대로 말할 수 있는 답을 줘.',
    '',
    '[손님]',
    w.name + ' / ' + (w.gender || '') + ' / ' + (w.age != null ? w.age + '세 / ' : '') +
      w.birthText + ' ' + (w.timeText || '시 모름') + ' ' + (w.region || ''),
    '',
    '[원국]',
    '시 ' + d.hour + '   일 ' + d.day + '   월 ' + d.month + '   년 ' + d.year,
    '오행  ' + EL5.map((e) => e + (f.els[e] || 0)).join('  '),
    '일간 ' + f.il.name + ' · ' + (f.weak ? '신약' : '신강') +
      ' · 비겁' + f.grp.비겁 + ' 식상' + f.grp.식상 + ' 재성' + f.grp.재성 +
      ' 관성' + f.grp.관성 + ' 인성' + f.grp.인성,
    f.none.length ? '없는 오행: ' + f.none.join(', ') : '오행이 고르게 있음',
    f.gongmang.length ? '공망: ' + f.gongmang.join(', ') : '',
    '',
    '[운]',
    f.curDw ? '현재 대운 ' + f.curDw.age + '세 ' + f.curDw.ko + (f.dwGroup ? ' (' + f.dwGroup + ')' : '') : '',
    f.nextDw ? '다음 대운 ' + f.nextDw.age + '세 ' + f.nextDw.ko : '',
    f.sewoon ? f.year + '년 세운 ' + f.sewoon.ko + (f.seGroup ? ' (' + f.seGroup + ')' : '') : '',
    '',
    '[오늘 상담에서 이미 나눈 이야기]',
    '- 일간이 ' + f.il.name + '(' + f.il.mul + ')이라 어떤 사람인지 설명함',
    f.none.length ? '- ' + f.none[0] + josa(f.none[0],'이','가') + ' 없어서 생기는 부분을 짚어줌' : '- 오행이 고른 편이라고 설명함',
    '- 성격과 기질을 자세히 봄',
    f.curDw ? '- 지금 ' + f.curDw.ko + ' 대운이라 어떤 시기인지 설명함' : '',
  ];
  const head = lines.filter((x) => x !== null && x !== undefined);
  const tail = [];
  tail.push('');
  tail.push('[답변 규칙]');
  tail.push('1. 사주 근거는 속으로만 잡고, 겉으로는 쉬운 말로만 답한다.');
  tail.push('2. 내가 손님에게 그대로 읽을 수 있는 문장으로 준다. 5~8문장.');
  tail.push('3. 존댓말. "' + w.name + '님"이라고 부른다. "당신"은 쓰지 않는다.');
  tail.push('4. 이미 나눈 이야기와 어긋나는 말을 하지 않는다.');
  tail.push('5. 죽음·질병·이혼을 단정하지 않는다. 병명을 말하지 않는다.');
  tail.push('6. "무조건" "반드시" "틀림없이" 같은 단정하는 말을 쓰지 않는다.');
  tail.push('7. 연도·액수·직업명을 딱 집어 말하지 않는다. 성질까지만 말한다.');
  tail.push('8. 상대방 생년월일 없이 궁합을 단정하지 않는다.');
  tail.push('9. 근거가 약하면 지어내지 말고, 모른다고 넘기는 문장을 대신 준다.');
  tail.push('10. 답 끝에 [근거] 한 줄로 어느 글자에서 나온 말인지 적는다.');
  tail.push('    이 줄은 내가 볼 것이고 손님에게 읽지 않는다.');
  tail.push('');
  tail.push('답만 줘. 설명하지 마.');

  if (parts) return { head, tail };

  const m = String(memo || '').split(NL).map((x) => x.trim()).filter(Boolean).map((x) => '- ' + x);
  const mid = [
    m.length ? m.join(NL) : '- (통화 중 메모 없음)', '',
    '[방금 받은 질문]',
    '"' + (String(question || '').trim() || '(여기에 손님 질문을 적으세요)') + '"',
  ];
  return head.concat(mid, tail)
    .filter((x) => x !== null && x !== undefined)
    .join(NL).replace(/\n{3,}/g, '\n\n');
}

/* ── 이 손님한테는 어떻게 나오는가 ─────────────────────
 *
 * 용어 사전은 「용신이란 무엇인가」까지만 알려준다. 통화 중에 손님이 묻는 건
 * 그게 아니라 「그래서 제 용신이 뭔데요?」다. 그래서 용어마다 이 사람의
 * 답을 계산해서 같이 붙인다.
 *
 * 계산해서 확실히 말할 수 있는 것만 넣는다. 애매한 건 넣지 않는다.
 */

/* 삼재 — 띠(년지)로 정해진다. 손님이 제일 많이 묻는 것 중 하나다. */
const SAMJAE = [
  { g: ['신', '자', '진'], y: ['인', '묘', '진'] },
  { g: ['인', '오', '술'], y: ['신', '유', '술'] },
  { g: ['사', '유', '축'], y: ['해', '자', '축'] },
  { g: ['해', '묘', '미'], y: ['사', '오', '미'] },
];
function samjaeOf(yearBranchKo, thisYearBranchKo) {
  const row = SAMJAE.filter((r) => r.g.indexOf(yearBranchKo) > -1)[0];
  if (!row) return null;
  const i = row.y.indexOf(thisYearBranchKo);
  return { years: row.y, on: i > -1, phase: ['들삼재', '눌삼재', '날삼재'][i] || null };
}

function personalize(f, w, saju) {
  const P = {};
  const g = f.grp;
  const els = f.els || {};
  const n = (k) => (els[k] || 0);

  P['일간'] = '{이름}님 일간은 ' + f.il.name + yeyo(f.il.name) + '.\n' + f.il.mul + ' 같은 기운이요.';
  P['일주'] = (function(){ var d=(saju.pillarsKo && saju.pillarsKo.day)||''; return '{이름}님 일주는 ' + d + yeyo(d) + '.'; })();
  P[f.weak ? '신약' : '신강'] = '{이름}님이 ' + (f.weak ? '신약' : '신강') + '이세요.\n' +
    (f.weak ? '타고난 힘보다 짊어진 게 많은 쪽이에요.\n그래서 다 하시면 지치세요.'
            : '타고난 힘이 좋으세요.\n그 힘을 쓸 데가 있어야 편해지세요.');
  P[f.weak ? '신강' : '신약'] = '{이름}님은 ' + (f.weak ? '신약' : '신강') + '이라 이쪽은 아니세요.';

  P['오행'] = '{이름}님은 ' + EL5.map((e) => e + n(e)).join(' · ') + ' 이에요.\n\n' +
    (f.none.length ? f.none.join('이랑 ') + josa(f.none[f.none.length - 1], '이', '가') + ' 없으세요.'
                   : '다섯 기운이 고르게 있으세요.');

  const need = f.none[0] || (f.weak ? null : null);
  if (need) {
    P['용신'] = '{이름}님한테 제일 필요한 건 ' + need + yeyo(need) + '.\n\n' +
      '사주에 하나도 없는 기운이라\n이게 들어오는 해에 확실히 편해지세요.';
  }

  P['공망'] = (f.gongmang && f.gongmang.length)
    ? '{이름}님 공망은 ' + f.gongmang.join('·') + yeyo(f.gongmang[f.gongmang.length-1]) + '.' : null;

  if (f.curDw) {
    P['대운'] = '{이름}님은 지금 ' + f.curDw.age + '세 ' + f.curDw.ko + ' 대운이세요.' +
      (f.nextDw ? '\n' + f.nextDw.age + '세에 ' + f.nextDw.ko + ro(f.nextDw.ko) + ' 바뀌고요.' : '') +
      (f.dwGroup ? '\n\n' + f.dwGroup + '이 들어오는 10년이에요.' : '');
  }
  if (f.sewoon) {
    P['세운'] = '올해는 ' + f.sewoon.ko + '년이에요.\n' +
      (f.seGroup
        ? '{이름}님한테는 ' + f.seGroup + '이 들어오는 해예요.'
        : '{이름}님한테는 무난한 해예요.');
  }

  /* 십성 — 몇 개인지 그대로 말해준다 */
  const many = (k) => (g[k] >= 3 ? '많은 편이에요.' : g[k] === 0 ? '하나도 없으세요.' : '적당히 있으세요.');
  ['비겁', '식상', '재성', '관성', '인성'].forEach((k) => {
    P[k] = '{이름}님은 ' + k + '이 ' + g[k] + '개세요. ' + many(k);
  });
  Object.keys(GROUP_OF).forEach((k) => {
    const c = f.god[k] || 0;
    P[k] = c ? '{이름}님 사주에 ' + k + josa(k,'이','가') + ' ' + c + '개 있어요.'
             : '{이름}님 사주에는 ' + k + josa(k,'이','가') + ' 없어요.';
  });
  P['십성'] = '{이름}님은 비겁' + g.비겁 + ' 식상' + g.식상 + ' 재성' + g.재성 +
    ' 관성' + g.관성 + ' 인성' + g.인성 + ' 이에요.';

  const hon = (f.god.편관 || 0) > 0 && (f.god.정관 || 0) > 0;
  P['관살혼잡'] = hon
    ? '{이름}님이 여기 해당되세요.\n편관이랑 정관이 같이 있어서\n기준이 여러 개라 늘 헷갈리세요.'
    : '{이름}님은 여기 해당 안 되세요.';

  /* 삼재 */
  const yb = (saju.detail && saju.detail.year && saju.detail.year.branch && saju.detail.year.branch.ko) || '';
  const sb = (f.sewoon && f.sewoon.ko && f.sewoon.ko.charAt(1)) || '';
  const sj = samjaeOf(yb, sb);
  if (sj) {
    P['삼재'] = sj.on
      ? '{이름}님은 올해가 삼재예요. ' + (sj.phase || '') + '요.\n\n' +
        '그런데 겁내실 것 없어요.\n크게 새로 벌이는 걸 한 박자 늦추시고\n하시던 걸 지키시면 넘어갑니다.'
      : '{이름}님은 올해 삼재 아니세요.\n' + sj.years.join('·') + '년이 {이름}님 삼재예요.';
  }

  P['궁합'] = '{이름}님 쪽은 지금 보고 있고요,\n상대분 생년월일을 알려주시면 같이 봐드릴게요.';
  P['만세력'] = '{이름}님 사주는 ' +
    ['hour', 'day', 'month', 'year'].map((k) => (saju.pillarsKo && saju.pillarsKo[k]) || '')
      .filter(Boolean).reverse().join(' · ') + ' 이에요.';

  return P;
}

/* ── 대사에 나온 용어 골라내기 ─────────────────────────
 *
 * 손님이 말을 듣다가 「그게 뭐예요?」 하고 되물을 때가 있다.
 * 그때 용어 탭으로 옮겨 찾을 시간이 없으니 그 자리에 미리 붙여둔다.
 *
 * 아무 말이나 걸리면 시끄러워지므로 되물을 만한 것만 본다.
 * 한 글자짜리(합·충·형)는 아무 데나 걸려서 뺀다.
 */
const ASKABLE = [
  '일간', '일주', '월주', '년주', '시주', '지장간', '육십갑자',
  '오행', '상생', '상극',
  '비견', '겁재', '식신', '상관', '편재', '정재', '편관', '정관', '편인', '정인',
  '비겁', '식상', '재성', '관성', '인성', '관살혼잡', '십성',
  '신강', '신약', '용신', '희신', '기신', '조후', '격국',
  '대운', '세운', '십이운성', '삼재',
  '도화살', '역마살', '화개살', '백호살', '괴강살', '양인살', '원진살',
  '귀문관살', '공망', '천을귀인', '문창귀인', '홍염살', '망신살', '겁살',
  '장성살', '반안살', '고신살',
  '궁합', '만세력', '절기', '진태양시', '야자시', '윤달',
];

function termsIn(block, name, ex, mine) {
  const hay = (block.say || []).join(' ') + ' ' + (block.why || '');
  const seen = {};
  const out = [];
  for (const key of ASKABLE) {
    if (hay.indexOf(key) < 0 || seen[key]) continue;
    const hit = TERMS.TERMS.filter((t) => t.t === key)[0];
    if (!hit) continue;
    seen[key] = 1;
    out.push({
      t: hit.t,
      short: hit.short,
      say: fill(hit.say, name, ex),
      mine: mine[key] ? fill(mine[key], name, ex) : '',
    });
    if (out.length >= 3) break;   /* 셋을 넘으면 대사보다 사전이 길어진다 */
  }
  return out;
}

/* ── 한 장으로 묶기 ───────────────────────────────────── */
function build(saju, who) {
  const w = Object.assign({
    name: '고객', gender: '', age: null, birthText: '', timeText: '', region: '', teacher: '루월당', ask: '',
  }, who || {});
  w.dayEl = saju.dayMasterElement;

  const p = saju.pillarsKo || {};
  w.chart = { year: p.year || '', month: p.month || '', day: p.day || '', hour: p.hour || '' };

  const f = readFacts(saju, w);

  const sections = [
    secOpen(w, f), secChart(w, f), secHit(w, f), secChar(w, f),
    secLuck(w, f), secClose(w, f),
  ];

  /* 이름 채우기 — 대사·근거·예상질문 전부 */
  const ex = {
    일간: f.il.name, 물상: f.il.mul,
    대운: f.curDw ? f.curDw.ko : '',
    대운시작: f.curDw ? f.curDw.age : '',
    다음대운나이: f.nextDw ? f.nextDw.age : '',
  };
  for (const s of sections) {
    s.note = fill(s.note, w.name, ex);
    const all = (s.blocks || []).slice();
    for (const g of (s.groups || [])) all.push.apply(all, g);
    for (const st of (s.states || [])) all.push.apply(all, st.b);
    for (const b of all) {
      b.say = b.say.map((x) => fill(x, w.name, ex));
      b.tag = fill(b.tag, w.name, ex);
      b.why = fill(b.why, w.name, ex);
    }
    s.qs = (s.qs || []).map((q) => ({
      q: fill(q.q, w.name, ex), a: fill(q.a, w.name, ex), tip: fill(q.tip || '', w.name, ex),
    }));
  }

  /* 용어마다 「그래서 이 손님은?」을 계산해 붙인다.
     사전 뜻만 읽어주면 손님이 원하는 답이 아니다. */
  const mine = personalize(f, w, saju);

  /* 대사에 나온 용어를 그 자리에 바로 붙인다.
     손님이 「재성이 뭐예요?」 하고 되물었을 때 탭을 옮겨 찾을 시간이 없다. */
  for (const s of sections) {
    const all = (s.blocks || []).slice();
    for (const g of (s.groups || [])) all.push.apply(all, g);
    for (const st of (s.states || [])) all.push.apply(all, st.b);
    for (const b of all) b.terms = termsIn(b, w.name, ex, mine);
  }

  const terms = TERMS.TERMS.map((t) => Object.assign({}, t, {
    say: fill(t.say, w.name, ex),
    mine: mine[t.t] ? fill(mine[t.t], w.name, ex) : '',
    qs: (t.qs || []).map((q) => ({ q: fill(q.q, w.name, ex), a: fill(q.a, w.name, ex) })),
  }));

  return {
    who: w, facts: f, sections, terms, cats: TERMS.CATS,
    /* 화면에서 메모·질문을 칠 때마다 다시 만들 수 있게 앞뒤를 나눠 넘긴다 */
    promptParts: buildPrompt(w, f, '', '', true),
  };
}

module.exports = { build, buildPrompt, readFacts, search: TERMS.search };
