// 무료사주 AI 생성 (교육생 OpenAI 키 사용)

const SYSTEM_PROMPT = `당신은 오랜 경력의 사주 명리학 상담가입니다.
주어진 사주팔자(년/월/일/시주)와 오행 분석을 바탕으로 무료 사주 풀이를 작성합니다.

작성 규칙:
- 계산된 사주팔자와 일간(日主), 강한/부족한 오행을 근거로 해석합니다. 사주팔자를 임의로 바꾸지 마세요.
- 단정적인 예언("반드시 ~한다")은 피하고, 경향과 흐름 위주로 부드럽게 표현합니다.
- 좋은 말로만 포장하지 않습니다. 주의할 점이나 약점은 솔직하게, 다만 상처 주지 않게 씁니다.
- 건강운은 질병을 예측하거나 진단하지 않습니다. 생활 관리·컨디션 경향 중심으로 씁니다.
- 무료 풀이이므로 전체 방향까지만 안내하고, 구체적인 시기·인연 특징 등은 "더 자세한 상담에서" 볼 수 있다는 여지를 남깁니다.
- 존댓말, 따뜻하고 신뢰감 있는 상담 말투를 사용합니다.
- 각 항목은 2~4문장. 종합 조언(advice)은 1~2문장.
- 반드시 아래 JSON 형식으로만 출력합니다. 다른 텍스트는 넣지 마세요.

{
  "manse": "만세력 기본 정보 해설 (일간의 특성, 강한 기운과 부족한 기운이 성향에 주는 영향)",
  "personality": "기본 성향",
  "year": "올해 운세의 전체 흐름",
  "love": "연애운",
  "wealth": "재물운",
  "health": "건강운 (의학적 진단 아님)",
  "advice": "종합 한 줄 조언"
}`;

async function generateFreeSaju({ client, saju, openaiKey, model }) {
  const p = saju.pillars;
  const userPrompt = `[내담자 정보]
이름: ${client.name}
성별: ${client.gender || '미입력'}
생년월일: ${client.birthDate} (${client.calendar})
태어난 시간: ${saju.timeKnown ? client.birthTime : '모름'}
태어난 지역: ${client.region || '미입력'}

[계산된 사주팔자]
년주: ${p.year}
월주: ${p.month}
일주: ${p.day}
시주: ${p.hour || '(시간 모름)'}
일간(日主): ${saju.dayMaster} (${saju.dayMasterElement}) — 이 사람의 중심 기운
오행 분포: 목${saju.elements.목} 화${saju.elements.화} 토${saju.elements.토} 금${saju.elements.금} 수${saju.elements.수}
강한 기운: ${saju.strong.join(', ')}
부족한 기운: ${saju.weak.join(', ')}

위 사주를 근거로 무료 사주 풀이를 JSON으로 작성해주세요.`;

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

module.exports = { generateFreeSaju };
