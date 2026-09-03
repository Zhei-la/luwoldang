/* 전화상담 상담지 — 궁합(두 사람)
 *
 * 상대방 생년월일이 들어 있을 때만 쓴다.
 * 궁합 상담은 상대방 사주가 없으면 아예 할 수가 없다.
 *
 * 계산해서 확실히 말할 수 있는 것만 다룬다.
 *   · 두 일간의 관계 (상대가 나에게 무슨 십성인가)
 *   · 일지끼리의 충·합·원진
 *   · 서로 없는 오행을 채워주는가
 *   · 신강·신약의 조합
 * 그 밖의 것은 지어내지 않는다.
 *
 * 고칠 때 지킬 것
 *  - 「헤어져라」 「안 맞는다」로 끝내지 않는다. 어디서 부딪히는지를 알려주는 것이 궁합이다.
 *  - 한쪽을 나쁘게 말하지 않는다. 손님이 듣고 상처받는다.
 */

const JI = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];

/* 지지 충 — 여섯 짝 */
const CHUNG = [['자', '오'], ['축', '미'], ['인', '신'], ['묘', '유'], ['진', '술'], ['사', '해']];
/* 지지 육합 */
const YUKHAP = [['자', '축'], ['인', '해'], ['묘', '술'], ['진', '유'], ['사', '신'], ['오', '미']];
/* 원진 — 까닭 없이 불편한 짝 */
const WONJIN = [['자', '미'], ['축', '오'], ['인', '유'], ['묘', '신'], ['진', '해'], ['사', '술']];

function pairIn(list, a, b) {
  return list.some((p) => (p[0] === a && p[1] === b) || (p[0] === b && p[1] === a));
}

/* 두 글자가 같은 무리인지 (삼합) */
const SAMHAP = [
  { g: ['신', '자', '진'], el: '수' },
  { g: ['인', '오', '술'], el: '화' },
  { g: ['사', '유', '축'], el: '금' },
  { g: ['해', '묘', '미'], el: '목' },
];
function samhapOf(a, b) {
  const row = SAMHAP.filter((r) => r.g.indexOf(a) > -1 && r.g.indexOf(b) > -1)[0];
  return row ? row.el : null;
}

/* 상대가 나에게 무슨 자리인가 — 십성 무리로 본다 */
const GEN = { 목: '화', 화: '토', 토: '금', 금: '수', 수: '목' };
const OVR = { 목: '토', 화: '금', 토: '수', 금: '목', 수: '화' };
function relGroup(mineEl, otherEl) {
  if (!mineEl || !otherEl) return null;
  if (otherEl === mineEl) return '비겁';
  if (GEN[mineEl] === otherEl) return '식상';
  if (OVR[mineEl] === otherEl) return '재성';
  if (OVR[otherEl] === mineEl) return '관성';
  if (GEN[otherEl] === mineEl) return '인성';
  return null;
}

/* 상대가 나에게 어떤 사람으로 오는가 */
const AS = {
  비겁: {
    head: '친구처럼 오는 사람',
    say: '{상대}님은 {이름}님한테 친구 같은 자리예요.\n\n편하고 말이 잘 통하세요.\n서로 뭘 원하는지 설명 안 해도 아시죠.\n\n대신 너무 비슷해서 부딪힐 때가 있어요.\n같은 걸 갖고 싶어 하시거든요.',
    why: '상대 일간이 본인의 <b>비겁</b>. 편하지만 경쟁이 생깁니다.',
  },
  식상: {
    head: '{이름}님이 쏟는 사람',
    say: '{이름}님이 {상대}님한테 많이 주시는 쪽이에요.\n\n챙겨주고, 걱정해주고, 먼저 움직이시죠.\n\n{이름}님은 그게 자연스러우신데\n오래 되면 지치실 수 있어요.\n\n{상대}님이 알아주고 계신지 한번 보세요.',
    why: '상대 일간이 본인의 <b>식상</b>. 내가 내보내는 자리라 주는 쪽이 됩니다.',
  },
  재성: {
    head: '{이름}님이 챙기는 사람',
    say: '{이름}님이 {상대}님을 챙기게 되는 자리예요.\n\n{상대}님이 {이름}님한테는\n지켜야 할 사람처럼 느껴지실 거예요.\n\n{이름}님이 애정을 쏟는 만큼\n힘도 같이 쓰이는 관계예요.',
    why: '상대 일간이 본인의 <b>재성</b>. 내가 다루고 지키는 자리입니다.',
  },
  관성: {
    head: '{이름}님이 신경 쓰는 사람',
    say: '{상대}님은 {이름}님한테\n조금 어려운 자리예요.\n\n좋은데 편하지만은 않으시죠.\n잘 보이고 싶고, 실망시키기 싫고.\n\n{이름}님이 {상대}님 앞에서\n조금 더 반듯해지시는 게 그래서예요.',
    why: '상대 일간이 본인의 <b>관성</b>. 나를 누르는 자리라 긴장이 있습니다.',
  },
  인성: {
    head: '{이름}님을 품어주는 사람',
    say: '{상대}님은 {이름}님한테\n기댈 수 있는 자리예요.\n\n같이 있으면 마음이 놓이고,\n{이름}님이 굳이 애쓰지 않아도 되는 관계요.\n\n{이름}님한테는 아주 좋은 자리예요.',
    why: '상대 일간이 본인의 <b>인성</b>. 나를 생해주는 자리라 편안합니다. 신약이면 최고의 인연입니다.',
  },
};

/* 일지 관계 */
function branchTie(a, b) {
  if (!a || !b) return null;
  if (a === b) return {
    kind: '같음', head: '많이 닮은 두 분',
    say: '두 분 일지가 같아요.\n\n닮은 데가 많으세요.\n좋아하는 것도, 싫어하는 것도 비슷하시죠.\n\n그래서 편한데,\n같은 데서 같이 무너지실 수 있어요.\n\n한 분이 힘들면 두 분 다 힘들어지는 관계예요.',
    why: '일지가 같습니다(복음). 닮았지만 약점도 같습니다.',
  };
  if (pairIn(CHUNG, a, b)) return {
    kind: '충', head: '부딪히는 자리가 있는 두 분',
    say: '두 분 일지가 부딪혀요.\n\n서로 참 다르세요.\n한 분이 맞다 하면 한 분은 아니라고 하시죠.\n\n그런데 이게 나쁘기만 한 건 아니에요.\n{이름}님한테 없는 걸 {상대}님이 갖고 계시거든요.\n\n다르다는 걸 알고 계시면 서로 배우는데,\n모르고 부딪히면 지칩니다.',
    why: '일지 <b>충</b>. 변동과 자극이 큽니다. 「안 맞는다」로 단정하지 마세요 — 서로 없는 걸 채우는 조합이기도 합니다.',
  };
  if (pairIn(YUKHAP, a, b)) return {
    kind: '합', head: '잘 붙는 두 분',
    say: '두 분 일지가 서로 붙는 자리예요.\n\n같이 있으면 편하시죠.\n말 안 해도 통하는 데가 있으시고요.\n\n오래 갈 수 있는 조합이에요.\n\n다만 너무 붙어 있어서\n둘만의 세계에 갇히실 수 있어요.',
    why: '일지 <b>육합</b>. 인연이 잘 붙습니다. 다만 합은 묶이는 것이라 답답해질 수도 있습니다.',
  };
  if (pairIn(WONJIN, a, b)) return {
    kind: '원진', head: '이유 없이 걸리는 데가 있는 두 분',
    say: '두 분 사이에 이유 없이 불편한 데가 있어요.\n\n딱히 잘못한 것도 없는데 걸리고,\n그런데 또 끊어지지도 않는 관계요.\n\n혹시 그런 적 있으세요?\n\n이건 알고 계시는 게 중요해요.\n모르고 부딪히면 서로를 탓하게 되거든요.',
    why: '일지 <b>원진</b>. 까닭 없이 불편합니다. 「헤어져라」로 가지 마세요 — 알면 조절이 됩니다.',
  };
  const sh = samhapOf(a, b);
  if (sh) return {
    kind: '삼합', head: '같은 방향을 보는 두 분',
    say: '두 분이 같은 쪽을 보고 계세요.\n\n원하는 게 비슷하고,\n같이 뭘 하기에 좋은 조합이에요.\n\n연애도 연애지만\n같이 일을 도모하기에도 잘 맞으세요.',
    why: '일지가 <b>' + sh + ' 삼합</b>. 방향이 같아 함께 도모하기 좋습니다.',
  };
  return {
    kind: '무난', head: '무난한 두 분',
    say: '두 분 일지는 특별히 부딪히지도,\n특별히 붙지도 않아요.\n\n무난한 조합이에요.\n\n크게 흔들릴 일도 없지만\n확 끌리는 것도 덜하실 거예요.\n\n이런 관계는 시간이 만들어줍니다.',
    why: '일지에 충·합·원진이 없습니다. 무난합니다.',
  };
}

/* 서로 없는 오행을 채워주는가 — 실제로 제일 크게 작동한다.
 * 두 방향을 따로 부르므로 이름을 그대로 박는다.
 * {이름}·{상대} 를 쓰면 어느 방향이든 같은 말이 나와버린다. */
function fillEach(lackNone, haveEls, lackName, haveName) {
  const filled = (lackNone || []).filter((e) => (haveEls[e] || 0) > 0);
  if (!filled.length) return null;
  return {
    els: filled,
    say: haveName + '님이 ' + lackName + '님한테 없는 걸 갖고 계세요.\n\n' +
      filled.join('이랑 ') + ' 기운인데,\n' +
      lackName + '님 사주에는 하나도 없는 거예요.\n\n' +
      '그래서 ' + haveName + '님이랑 같이 계시면\n' +
      lackName + '님이 편해지시는 게 있을 거예요.\n\n' +
      '이게 궁합에서 제일 크게 작동하는 부분이에요.',
    why: lackName + '님에게 없는 <b>' + filled.join(', ') + '</b>을 ' + haveName +
      '님이 가지고 있습니다. 오행 보완 — 실제 궁합에서 가장 크게 작동합니다.',
  };
}

/**
 * @param {object} me     본인 facts (index.js readFacts 결과)
 * @param {object} you    상대방 facts
 * @param {object} meSaju 본인 계산 결과
 * @param {object} youSaju 상대방 계산 결과
 * @param {string} meName / youName
 */
function build(me, you, meSaju, youSaju, meName, youName) {
  const myEl = meSaju.dayMasterElement;
  const yourEl = youSaju.dayMasterElement;

  const asMe = relGroup(myEl, yourEl);      /* 상대가 나에게 */
  const asYou = relGroup(yourEl, myEl);     /* 내가 상대에게 */

  const myBranch = (meSaju.detail && meSaju.detail.day && meSaju.detail.day.branch
    && meSaju.detail.day.branch.ko) || '';
  const yourBranch = (youSaju.detail && youSaju.detail.day && youSaju.detail.day.branch
    && youSaju.detail.day.branch.ko) || '';
  const tie = branchTie(myBranch, yourBranch);

  const fillMe = fillEach(me.none, you.els, meName, youName);
  const fillYou = fillEach(you.none, me.els, youName, meName);

  return { asMe, asYou, tie, fillMe, fillYou, myBranch, yourBranch, AS };
}

module.exports = { build, AS, branchTie, relGroup };
