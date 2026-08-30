/* 손님 만세력의 「풀어 쓴 해석」을 두껍게 만든다.
 *
 * cbFortune 의 buildReading() 이 만든 글은 한 토막에 100~250자였다.
 * 읽는 재미가 나려면 500자쯤은 되어야 해서, 이미 계산돼 있는데
 * 화면에서 안 쓰던 값들(격국·십이운성·신살·대운·조후…)로 살을 붙인다.
 *
 * ⚠️ 계산은 손대지 않는다. 여기서 하는 일은 이미 나온 값을 사람 말로
 *    옮겨 적는 것뿐이다.
 *
 * ⚠️ 한자는 혼자 두지 않는다. 「정丁火」처럼 붙여 쓰면 못 읽는 분이 많다.
 *    한글을 앞에 두고 한자는 괄호에 넣는다 — 「정화(丁火)」.
 */

'use strict';

/* ── 오행 ────────────────────────────────────── */
const EL = {
  목: { han: '木', color: '초록', dir: '동쪽', season: '봄', job: '기획과 교육',
        body: '간과 눈', word: '자라고 뻗는' },
  화: { han: '火', color: '빨강', dir: '남쪽', season: '여름', job: '표현과 영업',
        body: '심장과 혈압', word: '밝히고 퍼지는' },
  토: { han: '土', color: '노랑', dir: '가운데', season: '환절기', job: '관리와 부동산',
        body: '위장', word: '품고 버티는' },
  금: { han: '金', color: '흰색', dir: '서쪽', season: '가을', job: '정리와 금융',
        body: '폐와 피부', word: '거두고 자르는' },
  수: { han: '水', color: '검정', dir: '북쪽', season: '겨울', job: '연구와 유통',
        body: '신장', word: '스미고 흐르는' },
};

/* ── 천간 ────────────────────────────────────── */
const STEM = {
  갑: '甲', 을: '乙', 병: '丙', 정: '丁', 무: '戊',
  기: '己', 경: '庚', 신: '辛', 임: '壬', 계: '癸',
};
const STEM_EL = {
  갑: '목', 을: '목', 병: '화', 정: '화', 무: '토',
  기: '토', 경: '금', 신: '금', 임: '수', 계: '수',
};

/* ── 십성 다섯 무리 ──────────────────────────── */
const GROUP = {
  비겁: { what: '나와 같은 기운', good: '자기 주관과 뚝심, 함께 가는 동료',
          watch: '고집과 경쟁, 남에게 맡기지 못하는 것' },
  식상: { what: '내가 내보내는 기운', good: '표현력과 재주, 만들어 내는 힘',
          watch: '말이 앞서는 것, 벌여만 놓고 못 거두는 것' },
  재성: { what: '내가 다루는 기운', good: '현실 감각과 돈을 만지는 힘',
          watch: '욕심이 앞서는 것, 사람보다 계산이 먼저가 되는 것' },
  관성: { what: '나를 누르는 기운', good: '책임감과 자리, 규율을 지키는 힘',
          watch: '눌려 지내는 것, 남의 기준으로만 사는 것' },
  인성: { what: '나를 받쳐주는 기운', good: '공부와 문서, 받쳐주는 사람',
          watch: '생각만 길어지는 것, 기대다 못 움직이는 것' },
};

/* ── 십이운성 — 지금 내 기운이 어느 자리에 있나 ── */
const UNSEONG = {
  장생: '막 태어난 자리입니다. 새로 시작하는 일에 힘이 붙습니다',
  목욕: '다듬어지는 자리입니다. 흔들림이 있지만 그만큼 배웁니다',
  관대: '옷을 갖춰 입는 자리입니다. 준비가 끝나 나설 때입니다',
  건록: '제 몫을 하는 자리입니다. 스스로 벌어 서는 힘이 있습니다',
  제왕: '가장 힘이 센 자리입니다. 다만 넘치기 쉬워 덜어낼 곳이 필요합니다',
  쇠: '한풀 꺾이는 자리입니다. 벌이기보다 지키는 쪽이 맞습니다',
  병: '힘이 빠지는 자리입니다. 몸과 마음을 먼저 챙기셔야 합니다',
  사: '멈추는 자리입니다. 정리하고 매듭짓기에 좋습니다',
  묘: '갈무리하는 자리입니다. 안으로 쌓아 두는 힘이 큽니다',
  절: '끊기는 자리입니다. 비우고 나면 다음이 옵니다',
  태: '다시 잉태되는 자리입니다. 아직 안 보여도 자라고 있습니다',
  양: '자라는 자리입니다. 서두르지 않아야 크게 됩니다',
};

/* ── 신살 — 겁주는 말로 옮기지 않는다 ────────── */
const SINSAL = {
  도화살: '사람 눈에 잘 띄는 기운입니다. 매력으로 쓰면 좋고, 구설로 가면 피곤합니다',
  홍염살: '끌어당기는 기운입니다. 인기가 따르지만 감정에 휩쓸리기도 쉽습니다',
  화개살: '혼자 파고드는 기운입니다. 공부와 예술, 종교 쪽에 인연이 깊습니다',
  역마살: '움직이는 기운입니다. 이동과 출장, 해외와 인연이 있습니다',
  장성살: '앞에 서는 기운입니다. 책임을 맡을수록 힘이 납니다',
  반안살: '자리를 얻는 기운입니다. 윗사람의 도움을 받습니다',
  귀문관살: '예민하고 눈치가 빠른 기운입니다. 남이 못 보는 것을 봅니다',
  현침살: '날카롭게 파고드는 기운입니다. 정밀한 일에 강합니다',
  백호살: '기세가 센 기운입니다. 크게 쓰면 추진력이 됩니다',
  괴강살: '한번에 밀어붙이는 기운입니다. 강단이 있습니다',
  양인살: '날이 선 기운입니다. 결단이 빠릅니다',
  천을귀인: '어려울 때 사람이 나타나는 자리입니다',
  천덕귀인: '위험한 고비를 넘겨주는 자리입니다',
  월덕귀인: '주변이 도와주는 자리입니다',
  문창귀인: '글과 공부가 잘 붙는 자리입니다',
  학당귀인: '배우고 가르치는 데 인연이 있는 자리입니다',
  태극귀인: '끝을 맺어주는 자리입니다',
  협록: '먹을 것이 따라오는 자리입니다',
  금여: '편안한 자리를 얻는 기운입니다',
  암록: '보이지 않게 도와주는 자리입니다',
};

/* ── 격국 — 무엇으로 먹고사는 판인가 ─────────── */
const GYEOK = {
  정재격: '차곡차곡 쌓아 만드는 판입니다. 꾸준한 벌이와 실속이 중심에 놓입니다',
  편재격: '크게 굴려 만드는 판입니다. 흐름을 읽고 움직이는 데 강합니다',
  정관격: '자리와 이름으로 서는 판입니다. 맡은 것을 지켜 신뢰를 얻습니다',
  편관격: '밀어붙여 뚫는 판입니다. 압박이 있을 때 오히려 힘이 납니다',
  정인격: '배우고 받쳐 받는 판입니다. 문서와 자격이 힘이 됩니다',
  편인격: '남다른 눈으로 보는 판입니다. 한 가지를 깊이 파는 데 강합니다',
  식신격: '만들어 내며 사는 판입니다. 손에서 나오는 것이 곧 재산입니다',
  상관격: '드러내고 바꾸는 판입니다. 틀을 깨는 자리에서 빛납니다',
  건록격: '제 힘으로 서는 판입니다. 남에게 기대지 않고 벌어 냅니다',
  양인격: '기세로 미는 판입니다. 결단이 빠르고 물러서지 않습니다',
};

const esc = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * 「정丁火」처럼 한자를 붙여 쓴 것을 「정화(丁火)」로 편다.
 * 한글을 먼저 읽히게 하고 한자는 괄호로 밀어 넣는다.
 */
function plainHanja(html) {
  let s = String(html == null ? '' : html);
  /* 천간한글 + 천간한자 + 오행한자  →  천간한글+오행한글(한자한자) */
  s = s.replace(/([가-힣])([一-鿿])([木火土金水])/g, (m, ko, han, elHan) => {
    const el = Object.keys(EL).find((k) => EL[k].han === elHan);
    if (!el || STEM[ko] !== han) return m;
    return ko + el + '(' + han + elHan + ')';
  });
  /* 남은 홀한자는 앞에 한글이 없으면 그대로 둔다 (원국표 등은 여기 안 온다) */
  return s;
}

const P = (t) => '<p>' + t + '</p>';

/**
 * 조사를 받침에 맞춰 붙인다.
 * 「화(火)」처럼 뒤에 한자 괄호가 붙어도, 읽는 말인 「화」를 보고 고른다.
 * 이걸 안 하면 「화(火)은(는)」 같은 글이 그대로 손님에게 나간다.
 */
function lastKo(w) {
  const t = String(w == null ? '' : w);
  for (let i = t.length - 1; i >= 0; i--) {
    const code = t.charCodeAt(i);
    if (code >= 0xac00 && code <= 0xd7a3) return code;
  }
  return -1;
}
function J(w, withJong, without) {
  const c = lastKo(w);
  if (c < 0) return withJong;
  return ((c - 0xac00) % 28) ? withJong : without;
}
const 은 = (w) => w + J(w, '은', '는');
const 이 = (w) => w + J(w, '이', '가');
const 을 = (w) => w + J(w, '을', '를');
const 으로 = (w) => w + J(w, '으로', '로');
const 과 = (w) => w + J(w, '과', '와');
const el = (name) => (EL[name] ? name + '(' + EL[name].han + ')' : String(name || ''));
/** 천간 한 글자를 「갑목(甲木)」으로 편다 */
const stemFull = (ko) => {
  const k = String(ko || '').trim();
  if (!STEM[k]) return k;
  return k + STEM_EL[k] + '(' + STEM[k] + EL[STEM_EL[k]].han + ')';
};
/** 「갑 (보조: 경)」 같은 조후 표기를 사람 말로 */
const johuText = (v) => String(v == null ? '' : v)
  .replace(/^\s*([가-힣])/, (m, g) => stemFull(g))
  .replace(/\s*\(\s*보조:\s*([가-힣])\s*\)/, (m, g) => ', 보조로는 ' + stemFull(g));

/* ── 토막마다 살 붙이기 ─────────────────────── */

function moreSelf(c, w) {
  const out = [];
  const day = (w || []).find((p) => p.key === '일') || {};
  if (c.격국) {
    const g = GYEOK[c.격국];
    out.push('사주 전체가 어느 쪽으로 짜였는지를 격국이라고 부릅니다. 당신은 <b>' +
      esc(c.격국) + '</b>입니다. ' + (g || '태어난 달을 중심으로 판이 정해집니다') + '.');
  }
  if (day.unseong && UNSEONG[day.unseong]) {
    out.push('태어난 날의 기운은 열두 자리 가운데 <b>' + esc(day.unseong) +
      '</b>에 놓여 있습니다. ' + UNSEONG[day.unseong] +
      '. 씨앗에서 자라 무성해졌다가 다시 갈무리되는 흐름 중, 내가 어디쯤 서 있는지를 알려주는 표시입니다.');
  }
  if (day.branchTenGod) {
    out.push('태어난 날의 아랫글자는 <b>' + esc(day.branchTenGod) +
      '</b>입니다. 이 자리는 배우자와 가장 가까운 사람이 앉는 자리로 봅니다. ' +
      '내가 어떤 관계에서 편안해지는지가 여기서 드러납니다.');
  }
  if (c.공망일 && c.공망일.length) {
    out.push('공망은 <b>' + c.공망일.map(esc).join(', ') +
      '</b>입니다. 비어 있다는 뜻으로, 그 자리와 얽힌 일은 애를 써도 손에 잘 안 남습니다. ' +
      '대신 마음을 비우고 하면 오히려 잘 풀리는 자리이기도 합니다.');
  }
  return out;
}

function moreBalance(c) {
  const out = [];
  const dist = c.오행분포 || {};
  const lines = Object.keys(EL).map((k) => el(k) + ' ' + (dist[k] || 0) + '개');
  out.push('다섯 기운을 하나씩 세어 보면 ' + lines.join(', ') + '입니다. ' +
    '많다고 좋고 없다고 나쁜 것이 아니라, 어느 쪽으로 치우쳤는지를 보는 것입니다. ' +
    '치우친 쪽은 힘이 세지만 그만큼 탈이 나기도 쉽습니다.');

  const zero = Object.keys(EL).filter((k) => !(dist[k] > 0));
  if (zero.length) {
    out.push('없는 기운은 ' + zero.map((k) => '<b>' + el(k) + '</b>').join('과 ') +
      '입니다. 없다고 해서 그 힘을 못 쓰는 것은 아닙니다. ' +
      '저절로 되지 않으니 의식해서 챙겨야 한다는 뜻입니다. ' +
      zero.map((k) => EL[k].word + ' 일').join('과 ') + '이 그렇습니다.');
  }
  if (!zero.length) {
    out.push('다섯 기운이 하나도 빠짐없이 들어 있습니다. 흔치 않은 짜임입니다. ' +
      '어느 쪽 일이든 손을 댈 수 있다는 뜻이라 쓰임새가 넓지만, ' +
      '반대로 한 곳을 깊이 파고들 계기가 저절로 오지는 않습니다. ' +
      '무엇을 오래 할지는 스스로 정하셔야 합니다.');
  }
  const 합 = (c.합 || []).filter(Boolean);
  const 충 = (c.충형파해 || []).filter(Boolean);
  if (합.length || 충.length) {
    const t = [];
    if (합.length) {
      t.push('서로 끌어당겨 묶이는 <b>합</b>이 ' + 합.map(esc).join(', ') + ' 있습니다. ' +
        '합은 붙잡아 주는 힘이라 인연이 오래 가지만, 묶여서 못 움직이기도 합니다');
    }
    if (충.length) {
      t.push('부딪히고 흔드는 <b>충·형·파·해</b>는 ' + 충.map(esc).join(', ') + '입니다. ' +
        '흔들린다는 것은 나쁘기만 한 것이 아니라 판이 한 번 뒤집힌다는 뜻이라, ' +
        '고여 있던 것이 이때 움직입니다');
    }
    out.push('글자끼리 맺는 관계도 함께 봅니다. ' + t.join('. ') + '.');
  }
  if (c.조후) {
    out.push('계절의 온도로 보면 <b>' + esc(johuText(c.조후)) + '</b>이 필요합니다. ' +
      '힘의 균형과는 별개로, 사주가 너무 뜨겁거나 차갑지 않게 맞춰주는 기운입니다. ' +
      '여름에 태어나 불이 넘치면 물이, 겨울에 태어나 얼어붙으면 불이 급한 식입니다.');
  }
  return out;
}

function moreYongsin(c) {
  const out = [];
  const y = c.용신, e = EL[y];
  if (c.득령 || c.득지 || c.득세) {
    const mark = (v) => (v === 'O' ? '있음' : v === '△' ? '반반' : '없음');
    out.push('힘을 재는 세 가지를 보면 태어난 달의 도움 <b>' + mark(c.득령) +
      '</b>, 태어난 날 아랫자리의 받침 <b>' + mark(c.득지) +
      '</b>, 나머지 글자들의 편 <b>' + mark(c.득세) +
      '</b>. 이 셋을 합쳐 ' + 으로(esc(c.신강약 || '')) + ' 봅니다.');
  }
  if (e) {
    out.push('용신 ' + 은('<b>' + el(y) + '</b>') + ' 생활에서 이렇게 씁니다. 색은 ' + e.color +
      ', 방향은 ' + e.dir + ', 계절로는 ' + e.season + '이고, 일로는 ' + e.job +
      ' 쪽이 잘 맞습니다. 몸으로는 ' + 을(e.body) + ' 챙기시면 좋습니다.');
  }
  const line = [];
  if (c.희신) line.push('용신 다음으로 이로운 <b>희신</b>은 ' + el(c.희신));
  if (c.기신) line.push('가장 부딪히는 <b>기신</b>은 ' + el(c.기신));
  if (c.구신) line.push('기신을 돕는 <b>구신</b>은 ' + el(c.구신));
  if (c.한신) line.push('이롭지도 해롭지도 않은 <b>한신</b>은 ' + el(c.한신));
  if (line.length) {
    out.push(line.join(', ') + '입니다. ' +
      '대운이나 그해의 기운이 용신·희신 쪽으로 들어오면 하던 일이 순해지고, ' +
      '기신 쪽으로 들어오면 같은 일을 해도 힘이 더 듭니다.');
  }
  out.push('다만 용신은 부적이 아닙니다. 맞는 색 옷을 입는다고 일이 풀리지는 않습니다. ' +
    '어디에 힘을 쓰고 어디서 물러설지 정할 때 보는 나침반으로 여기시면 됩니다.');
  return out;
}

function moreTenGod(c, w) {
  const out = [];
  const d = c.십성분포 || {};
  const has = Object.keys(GROUP).filter((k) => d[k] > 0).sort((a, b) => d[b] - d[a]);
  if (has.length) {
    out.push('여덟 글자에 담긴 십성을 무리로 묶으면 ' +
      has.map((k) => '<b>' + k + '</b> ' + d[k] + '개').join(', ') + '입니다.');
    has.slice(0, 2).forEach((k) => {
      out.push(은('<b>' + k + '</b>') + ' ' + GROUP[k].what + '입니다. ' +
        이(GROUP[k].good) + ' 강점이고, ' + 을(GROUP[k].watch) + ' 조심하시면 됩니다.');
    });
  }
  const none = Object.keys(GROUP).filter((k) => !(d[k] > 0));
  if (none.length) {
    out.push('반대로 ' + 은(none.map((k) => '<b>' + k + '</b>').join('과 ')) +
      ' 한 글자도 없습니다. ' +
      none.map((k) => k + '이 맡는 ' + GROUP[k].good.split(',')[0]).join(', ') +
      ' 쪽은 타고난 힘으로 되지 않습니다. 사람이나 환경으로 채워 넣어야 하는 자리입니다.');
  }
  const mine = [];
  (w || []).forEach((p) => (p.sinsal || []).forEach((x) => {
    if (SINSAL[x] && mine.indexOf(x) === -1) mine.push(x);
  }));
  if (mine.length) {
    out.push('타고난 신살 중 눈에 띄는 것은 ' +
      mine.slice(0, 3).map((x) => '<b>' + esc(x) + '</b>').join(', ') + '입니다. ' +
      mine.slice(0, 3).map((x) => 은(x) + ' ' + SINSAL[x].replace(/^./, (m) => m)).join('. ') + '.');
  }
  return out;
}

function moreYear(c) {
  const out = [];
  const cur = c.현재대운, nx = c.다음대운, se = c.올해세운, wo = c.이번달월운;
  if (cur && cur.간지) {
    out.push('지금은 <b>' + esc(cur.간지) + ' 대운</b>을 지나고 있습니다. ' +
      (cur.나이 != null ? cur.나이 + '세에 시작한 십 년이고, ' : '') +
      '십성으로는 ' + esc(cur.십성 || '') + '이며 기운의 자리는 ' + esc(cur.운성 || '') + '입니다.' +
      (UNSEONG[cur.운성] ? ' ' + UNSEONG[cur.운성] + '.' : ''));
  }
  if (nx && nx.나이 != null) {
    out.push('다음 대운은 ' + 으로('<b>' + esc(nx.간지 || '') + '</b>') + ' ' + nx.나이 + '세에 바뀝니다. ' +
      '대운이 바뀌는 해 앞뒤 1~2년은 두 기운이 겹칩니다. 이 무렵에 큰 변화를 겪었다는 분이 많은 까닭입니다.');
  }
  if (c.대운방향 && c.대운수 != null) {
    out.push('대운은 ' + esc(c.대운방향) + '하고 대운수는 ' + c.대운수 + '입니다. ' +
      '태어난 해의 음양과 성별로 방향이 정해지고, 절기까지의 날수를 셋으로 나눈 값이 첫 대운의 나이가 됩니다.');
  }
  if (se && se.간지) {
    out.push('올해 ' + (se.년도 || '') + '년은 <b>' + esc(se.간지) + '</b>, 십성으로는 ' +
      esc(se.십성 || '') + '입니다.' +
      (se.운성 && UNSEONG[se.운성] ? ' 기운의 자리는 ' + esc(se.운성) + ' — ' + UNSEONG[se.운성] + '.' : ''));
  }
  const 앞 = (c.대운목록 || []).filter((d) => d && !d.현재 && d.나이 > (cur && cur.나이 || 0)).slice(0, 3);
  if (앞.length) {
    out.push('앞으로 지날 대운은 ' +
      앞.map((d) => d.나이 + '세 ' + esc(d.간지 || '') + '(' + esc(d.천간십성 || '') + ')').join(', ') +
      ' 순서입니다. 십 년마다 판이 한 번씩 바뀐다고 보시면 됩니다.');
  }
  if (wo && wo.간지) {
    out.push('이번 달 ' + esc(wo.라벨 || '') + '은 <b>' + esc(wo.간지) + '</b>, ' +
      esc(wo.십성 || '') + '의 달입니다. 한 해의 흐름 위에 이 달의 결이 한 겹 더 얹힌다고 보시면 됩니다.');
  }
  return out;
}

/**
 * 「여기서부터는 사람이 읽습니다」 밑에 보이는 맛보기.
 * 예전에는 누구에게나 똑같은 글이 나갔다. 그 사람 사주에서 뽑아 쓴다.
 */
function teaserOf(c) {
  const cur = c.현재대운 || {}, nx = c.다음대운 || {}, se = c.올해세운 || {};
  const bits = [];
  if (cur.간지) {
    bits.push('지금 지나는 ' + cur.간지 + ' 대운은 ' + (cur.십성 || '') +
      '의 십 년이고, 기운의 자리는 ' + (cur.운성 || '') + '입니다');
  }
  if (nx.나이 != null) {
    bits.push(nx.나이 + '세에 ' + 으로(nx.간지 || '') + ' 넘어가면서 결이 한 번 크게 바뀝니다');
  }
  if (c.용신) {
    bits.push('당신에게 필요한 기운은 ' + el(c.용신) +
      (c.기신 ? ', 부딪히는 기운은 ' + el(c.기신) : '') +
      J(c.기신 || c.용신, '이라', '라') + ' 같은 일도 어느 해에 하느냐에 따라 드는 힘이 달라집니다');
  }
  if (se.간지) {
    bits.push('올해 ' + (se.년도 || '') + '년 ' + 은(se.간지) + ' ' + (se.십성 || '') +
      '의 해라 무엇을 앞세우고 무엇을 미룰지가 갈립니다');
  }
  bits.push('직업 적성과 관계의 결, 달마다의 흐름은 원국을 직접 읽어야 나옵니다');
  return bits.join('. ') + '…';
}

/**
 * buildReading 이 만든 글에 살을 붙인다.
 *
 * @param {object} c     consult (명식표상세 결과의 raw.consult)
 * @param {object} base  cbFortune.buildReading(c)
 * @param {Array}  w     raw.wonguk — 기둥마다의 십성·운성·신살
 */
function enrich(c, base, w) {
  const more = {
    '01': moreSelf, '02': moreBalance, '03': moreYongsin,
    '04': moreTenGod, '05': moreYear,
  };
  const blocks = (base.blocks || []).map((b) => {
    const fn = more[b.no];
    let html = plainHanja(b.html);
    /* 원래 글은 태그 없이 그냥 문장이라, 뒤에 문단을 붙이면 첫 덩어리만
       문단 대접을 못 받아 다음 글과 딱 붙어 보인다. 먼저 문단으로 싸 준다. */
    if (!/^\s*<(p|div|ul|ol|h[1-6])/i.test(html)) html = P(html);
    if (fn) {
      let add = [];
      try { add = fn(c, w) || []; } catch (e) { add = []; }
      if (add.length) html += add.map((t) => P(plainHanja(t))).join('');
    }
    return Object.assign({}, b, { html });
  });
  return Object.assign({}, base, {
    blocks,
    iljuBody: plainHanja(base.iljuBody || ''),
  });
}

module.exports = { enrich, teaserOf, plainHanja };
