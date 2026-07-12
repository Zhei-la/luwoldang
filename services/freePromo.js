/**
 * freePromo.js
 *
 * 무료사주 PDF 뒤에 붙는 "업셀 페이지" 설정.
 * 교육생이 설정 화면에서 전부 고칠 수 있고, 안 고치면 아래 기본값이 그대로 들어간다.
 *
 * users.free_promo (JSONB) 에 저장.
 */

const DEFAULT_PROMO = {
  // 00 만세력 이해하기 — 모든 리포트에 공통으로 들어가는 해설 (AI 생성 아님)
  manseEssay:
    '사람은 저마다 다른 성격과 기질을 가지고 태어납니다. 누군가는 타고난 추진력으로 사람들을 이끌고, 누군가는 조용하지만 깊은 통찰로 자기 길을 갑니다. 같은 노력을 해도 어떤 사람은 일이 쉽게 풀리고, 어떤 사람은 번번이 벽에 부딪힙니다.\n\n' +
    '이 차이는 우연이 아닙니다. 사람은 태어난 순간의 기운을 타고나며, 그 기운은 이후의 삶에 오래 영향을 미칩니다. 그 흐름을 읽어내는 도구가 만세력입니다. 만세력은 태어난 연·월·일·시를 천간과 지지로 옮겨, 그 사람이 어떤 기운을 가지고 태어났는지 보여주는 지도입니다.\n\n' +
    '만세력은 점이 아닙니다. 정해진 답을 알려주는 것도 아닙니다. 운명을 읽을 수는 있지만, 그 운명을 어떻게 살아갈지는 결국 선택의 몫입니다. 만세력은 더 나은 선택을 하도록 돕는 하나의 도구일 뿐입니다.',

  // 09 프리미엄 안내
  premium: {
    title: '인생의 터닝포인트가 될\n프리미엄 종합사주',
    body:
      '지금 중요한 기로에 서 있거나, 반복되는 고민 속에서 답을 찾고 계실지도 모릅니다.\n\n' +
      '무료 사주로 잠시나마 방향을 잡으셨더라도, 여전히 갈증이 남으실 겁니다. 그것은 당연합니다. 사람의 삶은 몇 장의 요약으로 담아낼 수 있을 만큼 단순하지 않기 때문입니다.\n\n' +
      '프리미엄 종합사주는 사주명식을 깊이 풀어, 그동안 스스로 알아차리지 못했던 부분까지 짚어드리고, 앞으로 나아갈 길에 대한 구체적인 답을 드립니다.\n\n' +
      '두루뭉실한 추측 대신, 삶을 실제로 움직이게 하는 풀이를 경험해보세요.',
  },

  // 10 자주 묻는 질문 — 실제로 답변해드린 질문들
  qa: {
    title: '정통 명리학 기반으로\n속 시원히 답변해드립니다',
    intro: '종합 감명본을 받아보신 뒤에도 기간 제한 없이 질문하실 수 있습니다. 아래는 실제로 답변해드린 질문들입니다.',
    items: [
      '아직 미혼인데 언제쯤 결혼할 수 있을까요? 지금 만나는 사람과 결혼해도 괜찮을지 궁금합니다.',
      '8년 넘게 만난 사람과 헤어지기로 했습니다. 나중에 재회하게 될까요, 아니면 새로운 인연을 만나게 될까요?',
      '토의 기운이 강해 직장 내 마찰과 건강 문제가 생길 수 있다고 하는데, 어떻게 풀어가야 할까요?',
      '지금 직장에서의 발전 가능성은 어떤가요? 직업을 아예 바꾼다면 어떤 분야가 맞을까요?',
      '내년에 복직 예정인데, 복직 가능성이 클까요 아니면 이직하게 될까요?',
      '저에게 왜 이런 일이 생겼고, 앞으로 보완할 방법이 있는지 궁금합니다.',
    ],
  },

  // 11 후기 (교육생이 이미지 업로드)
  reviews: {
    title: '먼저 받아보신 분들의 후기',
    images: [], // data URI 배열 (최대 6장)
  },

  // 12 할인 · 카카오 상담 CTA
  discount: {
    title: '이번 달까지만\n선착순 할인 대상자입니다',
    body:
      '사주는 단순한 운세가 아닙니다. 지금 왜 이런 일이 일어나는지, 어느 방향으로 움직여야 하는지, 정통 명리학을 근거로 답을 찾아드립니다.\n\n' +
      '사주를 처음 보시는 분도, 많이 보셨던 분도 이해하실 수 있도록 쉽고 정확하게 풀어 감명본으로 전달드립니다.\n\n' +
      '곧 선착순 혜택이 종료됩니다. 아래 버튼을 눌러 상담을 신청해주세요.',
    priceWas: '60,000원',
    priceNow: '29,800원',
    off: '50%',
    btn: '할인받고 상담 신청하기',
  },
};

/** 저장된 값 + 기본값 병합 (없는 키는 기본값으로 채움) */
function getPromo(user) {
  const p = (user && user.free_promo) || {};
  return {
    manseEssay: p.manseEssay || DEFAULT_PROMO.manseEssay,
    premium: { ...DEFAULT_PROMO.premium, ...(p.premium || {}) },
    qa: {
      title: (p.qa && p.qa.title) || DEFAULT_PROMO.qa.title,
      intro: (p.qa && p.qa.intro) || DEFAULT_PROMO.qa.intro,
      items: (p.qa && Array.isArray(p.qa.items) && p.qa.items.length)
        ? p.qa.items : DEFAULT_PROMO.qa.items,
    },
    reviews: {
      title: (p.reviews && p.reviews.title) || DEFAULT_PROMO.reviews.title,
      images: (p.reviews && Array.isArray(p.reviews.images)) ? p.reviews.images : [],
    },
    discount: { ...DEFAULT_PROMO.discount, ...(p.discount || {}) },
    show: p.show !== false, // 업셀 페이지 전체 on/off
  };
}

/** 폼에서 받은 값 정리 → DB에 넣을 형태 */
function normalizePromo(body) {
  const s = (v) => String(v || '').trim();
  const imgs = Array.isArray(body?.reviews?.images) ? body.reviews.images : [];

  return {
    show: body.show !== false && body.show !== 'off',
    manseEssay: s(body.manseEssay) || DEFAULT_PROMO.manseEssay,
    premium: {
      title: s(body.premium?.title) || DEFAULT_PROMO.premium.title,
      body: s(body.premium?.body) || DEFAULT_PROMO.premium.body,
    },
    qa: {
      title: s(body.qa?.title) || DEFAULT_PROMO.qa.title,
      intro: s(body.qa?.intro) || DEFAULT_PROMO.qa.intro,
      items: (Array.isArray(body.qa?.items) ? body.qa.items : [])
        .map(s).filter(Boolean).slice(0, 12),
    },
    reviews: {
      title: s(body.reviews?.title) || DEFAULT_PROMO.reviews.title,
      // data URI 이미지만 허용 (외부 URL 주입 차단), 최대 6장
      images: imgs.filter((x) => typeof x === 'string' && x.startsWith('data:image/')).slice(0, 6),
    },
    discount: {
      title: s(body.discount?.title) || DEFAULT_PROMO.discount.title,
      body: s(body.discount?.body) || DEFAULT_PROMO.discount.body,
      priceWas: s(body.discount?.priceWas),
      priceNow: s(body.discount?.priceNow),
      off: s(body.discount?.off),
      btn: s(body.discount?.btn) || DEFAULT_PROMO.discount.btn,
    },
  };
}

module.exports = { DEFAULT_PROMO, getPromo, normalizePromo };
