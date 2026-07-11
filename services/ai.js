// 무료사주 AI 생성 (교육생 OpenAI 키 사용)

const SYSTEM_PROMPT = `당신은 오랜 경력의 사주 명리학 상담가입니다.
계산된 사주팔자(원국)와 십성·오행을 근거로 "무료 사주 리포트"를 작성합니다.

## 무료 리포트의 핵심 원칙 (반드시 지킬 것)
무료 리포트는 "현재의 흐름"까지만 알려줍니다.
"왜 그런 흐름이 생기는지"와 "언제 어떻게 움직여야 하는지"는 상세(유료) 풀이의 영역입니다.

[알려주는 것] 타고난 성향, 전체적인 기운의 방향, 올해의 큰 흐름, 좋은 흐름과 주의점
[알려주지 않는 것] ※ 절대 쓰지 마세요
- 구체적인 월(月)이나 정확한 시기 ("3월에", "하반기 9월경" 같은 표현 금지)
- 인연이 들어오는 시기, 결혼 가능성, 배우자의 구체적 특징
- 돈이 들어오는 정확한 시기, 구체적인 직업·업종 추천
- 대운·세운 분석, 용신
→ 이런 내용은 "상세 풀이에서 확인할 수 있다"고 여지를 남기며 마무리합니다.

## 작성 규칙
- 계산된 사주팔자·일간·십성·오행을 실제 근거로 삼아 해석합니다. 사주를 임의로 바꾸지 마세요.
- 단정적인 예언("반드시 ~한다")은 피하고 경향과 흐름으로 표현합니다.
- 좋은 말로만 포장하지 않습니다. 보완할 점은 솔직하게, 다만 상처 주지 않게 씁니다.
- 건강운은 질병을 예측·진단하지 않습니다. 체질 경향과 생활 관리 중심으로 씁니다.
- 존댓말, 따뜻하고 신뢰감 있는 상담 말투. 본문에 한자는 쓰지 말고 한글로만 씁니다.
- 각 섹션은 2~3문단(문단당 2~3문장). 문단 구분은 \\n\\n 으로 합니다.

## 출력 형식
반드시 아래 JSON으로만 출력합니다. 다른 텍스트는 넣지 마세요.

{
  "keywords": ["핵심키워드1", "핵심키워드2", "핵심키워드3"],
  "manse": "01 만세력 기본 정보 — 사주 원국 요약. 일간의 특성, 오행 분포(강한 기운·부족한 기운)가 이 사람에게 어떤 의미인지. '당신은 어떤 사주인가'를 한눈에 보여주는 요약.",
  "personality": "02 타고난 성향 — 기본 성격, 장점, 보완해야 할 점, 인간관계 성향. 핵심 해석만. (세부 성격·재능은 상세 풀이 영역)",
  "year": "03 올해 운세 — 올해의 전체 흐름, 상반기와 하반기 분위기, 올해 가장 중요한 키워드. '좋은 흐름이 있다' 정도까지만. 구체적인 월/시기는 절대 쓰지 말 것.",
  "yearOutro": "03 마무리 문구 — 정확한 기회 시기는 대운·세운을 함께 분석해야 확인 가능하다는 안내 (1~2문장)",
  "love": "04 연애운 — 현재 연애운, 연애 성향, 인연의 흐름. 좋은 흐름과 주의점만. 인연 시기·배우자 특징·결혼 가능성은 절대 쓰지 말 것.",
  "loveOutro": "04 마무리 문구 — 인연의 시기와 오래 이어질 인연인지는 상세 분석에서 확인 가능하다는 안내 (1~2문장)",
  "wealth": "05 재물운 — 돈을 버는 방식, 현재 재물 흐름, 재물운 한 줄 조언. 돈의 흐름만 간단히. 언제 돈이 들어오는지·어떤 직업이 맞는지는 절대 쓰지 말 것.",
  "wealthOutro": "05 마무리 문구 — 재물운은 직업운과 함께 분석해야 수입이 늘어나는 시기를 정확히 알 수 있다는 안내 (1~2문장)",
  "health": "06 건강운 — 기본 체력 경향, 생활습관 조언, 올해 관리 포인트. 체질과 생활 관리 중심. 의학적 진단 아님.",
  "advice": "07 종합 조언 — 현재 가장 중요한 운의 방향, 올해 기억해야 할 한 가지 조언, 앞으로 집중해야 할 부분."
}`;

async function generateFreeSaju({ client, saju, openaiKey, model }) {
  const p = saju.pillars;
  const d = saju.detail;
  const year = new Date().getFullYear();

  const godLine = (key, label) => {
    const x = d[key];
    if (!x || !x.stem) return `${label}: (시간 모름)`;
    return `${label}: ${x.stem.ko}${x.stem.char}(${x.stem.el}, ${x.stem.god}) / ${x.branch.ko}${x.branch.char}(${x.branch.el}, ${x.branch.god})`;
  };

  const userPrompt = `[내담자 정보]
이름: ${client.name}
성별: ${client.gender || '미입력'}
생년월일: ${client.birthDate} (${client.calendar})
태어난 시간: ${saju.timeKnown ? client.birthTime : '모름'}
태어난 지역: ${client.region || '미입력'}
현재 연도: ${year}년

[사주 원국] (천간/지지 — 오행, 십성)
${godLine('year', '년주')}
${godLine('month', '월주')}
${godLine('day', '일주')}
${godLine('hour', '시주')}

[중심 기운]
일간(日主): ${saju.dayMasterKo}${saju.dayMaster} (${saju.dayMasterElement}) — 이 사람 자신을 나타내는 기준

[오행 분포]
목 ${saju.elements.목} · 화 ${saju.elements.화} · 토 ${saju.elements.토} · 금 ${saju.elements.금} · 수 ${saju.elements.수}
강한 기운: ${saju.strong.join(', ')}
부족한 기운: ${saju.weak.join(', ')}

위 원국을 근거로 무료 사주 리포트를 JSON으로 작성해주세요.
${year}년 기준으로 올해 운세를 써주세요.
구체적인 시기(월)·인연 시기·결혼 가능성·직업 추천은 절대 쓰지 마세요.`;

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${openaiKey}`,
    },
    body: JSON.stringify({
      model: model || 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.85,
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    const err = new Error(data.error?.message || 'OpenAI 호출 실패');
    err.code = data.error?.code;
    throw err;
  }

  const text = data.choices?.[0]?.message?.content || '{}';
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (e) {
    parsed = {};
  }
  return parsed;
}

// 08 더 자세한 사주 풀이 — 고정 문구 (AI 호출 불필요)
const UPSELL = {
  intro: '무료 리포트는 사주의 전체적인 방향을 간략하게 살펴보는 내용입니다.\n상세 사주에서는 다음 내용을 더욱 깊이 있게 확인할 수 있습니다.',
  items: [
    '대운과 세운으로 보는 인생의 전환점',
    '언제 운이 풀리고 언제 조심해야 하는지',
    '직업과 이직에 가장 유리한 시기',
    '돈이 들어오는 구조와 재물 상승 시기',
    '배우자의 성향과 결혼 가능성이 높은 시기',
    '연애가 잘 풀리지 않았던 원인',
    '나에게 맞는 직업과 사업 방향',
    '앞으로 5년~10년의 운세 흐름',
    '용신 분석과 개운 방향',
    '지금 가장 좋은 선택과 피해야 할 선택',
  ],
  closing: "무료 사주는 '현재의 흐름'을 알려드립니다.\n종합 사주는 '왜 그런 흐름이 생기는지'와 '언제 어떻게 움직여야 하는지'까지 분석해 드립니다.",
};

module.exports = { generateFreeSaju, UPSELL };
