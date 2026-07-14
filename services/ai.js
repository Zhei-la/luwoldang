// 무료사주 AI 생성 (교육생 OpenAI 키 사용)
const { fieldBlock } = require('./sajuFields');

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
→ 이런 내용은 그냥 쓰지 않습니다. 넘어가면 됩니다.

## 본문에 절대 쓰지 말 것 (중요)
각 항목의 값에는 **본문만** 담습니다.
"02 사주로 보는 나는? —", "03 타고난 성향 —" 처럼 **번호나 제목을 본문 앞에 붙이지 마세요.**
제목은 리포트가 알아서 붙입니다. 본문 첫 글자부터 바로 내용이 시작되어야 합니다.

## 절대 반복하지 말 것 (중요)
"정확한 시기는 대운과 세운을 함께 분석해야 확인 가능합니다", "상세 풀이에서 확인할 수 있습니다" 같은
유도 문장을 각 섹션 본문에 넣지 마세요. 매번 반복되면 읽는 사람이 지칩니다.
본문에는 해석만 담고, 여지를 남기는 문장은 마지막 "종합 조언"의 끝 한 번으로 충분합니다.

## 작성 규칙
- 계산된 사주팔자·일간·십성·오행을 실제 근거로 삼아 해석합니다. 사주를 임의로 바꾸지 마세요.
- 단정적인 예언("반드시 ~한다")은 피하고 경향과 흐름으로 표현합니다.
- 좋은 말로만 포장하지 않습니다. 보완할 점은 솔직하게, 다만 상처 주지 않게 씁니다.
- 건강운은 질병을 예측·진단하지 않습니다. 체질 경향과 생활 관리 중심으로 씁니다.
- 존댓말, 따뜻하고 신뢰감 있는 상담 말투. 본문에 한자는 쓰지 말고 한글로만 씁니다.
- 분량 규칙 (반드시 지킬 것): 각 섹션은 3~4문단, 문단당 3~5문장, 섹션 전체 550~750자.
  짧게 끝내지 마세요. 원국의 어느 글자를 근거로 그렇게 보는지 최소 한 번은 짚어야 합니다.
  (예: "일지에 놓인 관성이…", "부족한 수 기운 때문에…")
- 문단 구분은 \\n\\n 으로 합니다.

## 출력 형식
반드시 아래 JSON으로만 출력합니다. 다른 텍스트는 넣지 마세요.

{
  "keywords": ["핵심키워드1", "핵심키워드2", "핵심키워드3"],
  "manse": "01 내 사주 한눈에 보기 (550~750자) — ①사주 원국 요약 ②일간의 성질 ③오행 분포의 의미. 일간의 특성, 오행 분포(강한 기운·부족한 기운)가 이 사람에게 어떤 의미인지. '당신은 어떤 사주인가'를 한눈에 보여주는 요약.",
  "self": "02 사주로 보는 나는? — 반드시 두 덩어리로 씁니다. 두 덩어리 사이는 \\\\n\\\\n 두 번(빈 줄)으로 구분합니다.\n    (앞) 강한 기운이 만들어내는 모습: 가장 강한 오행을 '한여름의 태양처럼' 같은 자연물 비유로 시작해, 그 기운이 이 사람의 에너지·대인관계·일하는 방식에 어떻게 드러나는지. 장점과 함께 그 강함이 지나칠 때 생기는 그림자도 함께 씁니다. 4~5문장.\n    (뒤) 부족한 기운이 만드는 약점: 부족한 오행을 짚고, 그것이 판단·감정조절·변화 대응에서 어떤 어려움으로 나타나는지 솔직하게. 겁주지 말고, 대신 무엇을 의식하면 되는지 한 문장으로 닫습니다. 4~5문장.",
  "personality": "03 타고난 성향 (550~750자) — ①기본 성격 ②장점 ③보완해야 할 점 ④인간관계 성향, 네 가지를 모두 다룹니다. (세부 성격·재능은 상세 풀이 영역) '사주로 보는 나는?'과 내용이 겹치지 않게, 여기서는 인간관계와 일상 습관 중심으로 씁니다.",
  "year": "04 올해 운세 (550~750자) — 올해의 전체 흐름, 상반기와 하반기 분위기, 올해 가장 중요한 키워드. '좋은 흐름이 있다' 정도까지만. 구체적인 월/시기는 절대 쓰지 말 것.",
  "yearOutro": "04 마무리 문구 — 정확한 기회 시기는 대운·세운을 함께 분석해야 확인 가능하다는 안내 (1~2문장)",
  "love": "05 연애운 (550~750자) — ①현재 연애운의 분위기 ②연애 성향(일지·식상 근거) ③인연의 흐름. 좋은 흐름과 주의점만. 인연 시기·배우자 특징·결혼 가능성은 절대 쓰지 말 것.",
  "loveOutro": "05 마무리 문구 — 인연의 시기와 오래 이어질 인연인지는 상세 분석에서 확인 가능하다는 안내 (1~2문장)",
  "wealth": "06 재물운 (550~750자) — ①돈을 버는 방식(재성·식상 근거) ②현재 재물 흐름 ③재물운 한 줄 조언. 돈의 흐름만 간단히. 언제 돈이 들어오는지·어떤 직업이 맞는지는 절대 쓰지 말 것.",
  "wealthOutro": "06 마무리 문구 — 재물운은 직업운과 함께 분석해야 수입이 늘어나는 시기를 정확히 알 수 있다는 안내 (1~2문장)",
  "health": "07 건강운 (550~750자) — ①기본 체력 경향(오행 불균형·12운성 근거) ②생활습관 조언 ③올해 관리 포인트. 체질과 생활 관리 중심. 의학적 진단 아님.",
  "advice": "08 종합 조언 (550~750자) — ①현재 가장 중요한 운의 방향 ②올해 기억해야 할 한 가지 조언 ③앞으로 집중해야 할 부분. 마지막 문단은 상세 풀이에서 무엇을 더 볼 수 있는지 여지를 남기며 닫습니다."
}`;

async function generateFreeSaju({ client, saju, openaiKey, model }) {
  const p = saju.pillars;
  const d = saju.detail;
  const year = new Date().getFullYear();

  const godLine = (key, label) => {
    const x = d[key];
    if (!x || !x.stem) return `${label}: (시간 모름)`;
    const jj = (x.jijanggan || []).map((g) => g.ko).join('');
    return `${label}: ${x.stem.ko}${x.stem.char}(${x.stem.el}, ${x.stem.god}) / ${x.branch.ko}${x.branch.char}(${x.branch.el}, ${x.branch.god})` +
           ` · 12운성 ${x.unseong || '-'} · 지장간 ${jj || '-'}`;
  };

  const dwLine = saju.daewoon && saju.daewoon.list.length
    ? `\n[대운] (${saju.daewoon.forward ? '순행' : '역행'})\n` +
      saju.daewoon.list.slice(0, 8).map((x) => `${x.age}세~ ${x.ko}`).join(' / ')
    : '';

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

${fieldBlock('무료사주')}

위 원국을 근거로 무료 사주 리포트를 JSON으로 작성해주세요.
${year}년 기준으로 올해 운세를 써주세요.`;

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


/* ============================================================
 * 유료 PDF 리포트 생성 (7종)
 *
 * 60~80페이지를 만들려면 한 번의 호출로는 불가능(토큰 한계).
 * → 챕터 단위로 나눠서 여러 번 호출한다.
 *   챕터당 소제목 5개 × 700~900자 = 3,500~4,500자 ≈ 4~5페이지
 *   챕터 15개 → 본문 55~75페이지 (+ 표지/목차/만세력 5p)
 * ============================================================ */

const { OUTLINES, titles, outlineWithQuestion, QUESTION_CHAPTER } = require('./outlines');

const PDF_TYPES = ['신년운세', '종합사주', '연애운', '결혼운', '재물운', '건강운', '무료사주'];

// 하위 호환 (기존 코드가 PDF_OUTLINES를 참조)
const PDF_OUTLINES = {};
PDF_TYPES.forEach((t) => { PDF_OUTLINES[t] = titles(t); });

const PDF_SYSTEM = `당신은 30년 경력의 사주 명리학 상담가입니다. 손님 앞에 앉아 직접 풀이해주듯 씁니다.

## 문체 — 반드시 지킬 것

### 이름 사용
- 이름은 **한 소제목당 최대 2번**만 씁니다. 문단마다 이름을 넣지 마세요.
- 대부분은 주어를 생략하거나 "타고난 성정이", "이 사주는" 처럼 씁니다.
- 나쁜 예: "김가영님은 ~합니다. 김가영님의 사주는 ~. 따라서 김가영님은 ~"
- 좋은 예: "타고난 성정이 곧고 맺고 끊음이 분명합니다. 다만 그 곧음이 때로는 스스로를 옥죕니다."

### 금지 표현 (하나라도 쓰면 실패)
- "AI", "인공지능", "분석 결과", "데이터" 등 기계적인 단어
- 접속사 남발: "결국", "또한", "이러한", "이를 통해", "따라서", "즉"
  → 접속사 없이 바로 이어 쓰세요. 문장 사이는 내용으로 연결합니다.
- 뭉개는 어미: "~할 수 있을 것입니다", "~하는 데 도움이 될 것입니다",
  "~할 가능성이 높습니다", "~하는 것이 중요합니다", "~할 필요가 있습니다"
  → 단정하되 부드럽게: "~합니다", "~하는 편입니다", "~하기 쉽습니다", "~해야 합니다"
- 누구에게나 해당되는 말(바넘 문장): "노력하면 좋아집니다", "균형이 중요합니다",
  "소통이 도움이 됩니다", "긍정적인 마음가짐" → 절대 쓰지 마세요.

### 마무리 금지
- 각 소제목을 "결국 ~할 것입니다" 같은 요약 문장으로 끝내지 마세요.
- 마지막 문단도 그냥 내용으로 끝냅니다. 정리하지 마세요.

### 문장 리듬 — 이게 사람 글과 AI 글을 가릅니다
AI는 모든 문장을 비슷한 길이로 씁니다. 사람은 안 그럽니다.
- **한 문단에 20자 이하의 짧은 문장을 최소 하나 넣으세요.**
  예: "그래서 손해를 봅니다." / "말이 앞섭니다." / "여기서 갈립니다."
- 긴 문장 뒤에는 짧은 문장을 붙여 끊어주세요.
- 결론을 먼저 던지고 근거를 뒤에 붙이세요. 근거부터 쌓아 올리지 마세요.

### 한자투 관료체 금지 (하나라도 쓰면 실패)
"내포하다 / 시사하다 / 자리매김 / 극대화 / 도모하다 / 발현되다 / 잠재력 /
 역량 / 시너지 / 일환으로 / ~함으로써 / ~측면에서 / 기인하다"
→ 이런 말은 보고서에나 씁니다. 사람이 사람에게 하는 말로 바꾸세요.

### 훈계체 금지
"중요합니다 / 필요합니다 / 바람직합니다 / 요구됩니다 / 유념하시기 바랍니다"
→ 가르치려 들지 마세요. 상황을 보여주고 사람이 스스로 판단하게 두세요.

### 다시 써보기 — 실제 예시
❌ AI가 쓴 글:
"어떤 역할을 맡더라도 본인의 기운에 따라 자연스럽게 리더십으로 자리매김할 가능성이 높습니다.
비견의 기운과 겁재의 조화는 사람들을 이끌 수 있는 능력을 내포하고 있습니다.
주변 사람들로부터 신뢰를 얻고 리더로서의 역할을 수행할 기회를 자주 맞이하게 됩니다."

✅ 사람이 쓴 글:
"비견과 겁재가 나란히 서 있습니다. 사람들 앞에 서는 자리가 자연스럽게 돌아옵니다.
떠밀려서가 아니라, 가만히 있어도 무게중심이 이쪽으로 옵니다.
다만 겁재는 같은 기운끼리 부딪히는 글자입니다. 내 몫을 나눠 가지려는 사람이 옆에 붙습니다.
좋은 뜻으로 곁을 내주다가 자리를 내주는 일이 생깁니다. 거기서 갈립니다."

두 글의 차이를 보세요. 아래 글은 짧은 문장이 섞여 있고, 명식의 글자(비견·겁재)를 직접
가리키고, 좋은 말만 하지 않습니다. 이렇게 쓰세요.

## 내용 — 반드시 지킬 것
- **모든 문단은 명식에서 근거를 가져옵니다.** 십성·12운성·지장간·오행·대운 중 무엇을 근거로
  말하는지 드러나야 합니다.
  좋은 예: "일지에 편재를 두어 돈이 눈에 보이면 움직입니다. 다만 12운성이 쇠에 놓여
  벌이는 만큼 나가는 구조입니다."
  나쁜 예: "재물운이 좋은 편입니다. 노력하면 더 좋아질 것입니다."
- 좋은 말만 하지 마세요. 약점·모순·주의점을 구체적으로 짚습니다.
- 단정적 예언("반드시 ~한다", "~하게 된다")은 피하고 경향으로 씁니다.
- 본문에 한자를 쓰지 마세요. 한글로만 씁니다.

## 분량
- **각 소제목마다 700~900자.** 짧게 끝내지 마세요.
- 소제목당 3~4문단. 문단 구분은 \n\n 입니다.

## 출력 형식
반드시 아래 JSON으로만 출력합니다. 다른 텍스트는 넣지 마세요.
{ "blocks": [ { "sub": "소제목", "body": "본문 (700~900자)" }, ... ] }`;

/** 사주 정보 블록 (프롬프트용) */
function sajuBlock(client, saju) {
  const d = saju.detail;
  const year = new Date().getFullYear();

  const godLine = (key, label) => {
    const x = d[key];
    if (!x || !x.stem) return `${label}: (시간 모름)`;
    const jj = (x.jijanggan || []).map((g) => g.ko).join('');
    return `${label}: ${x.stem.ko}(${x.stem.el}, ${x.stem.god}) / ${x.branch.ko}(${x.branch.el}, ${x.branch.god})` +
           ` · 12운성 ${x.unseong || '-'} · 지장간 ${jj || '-'}`;
  };

  const dw = saju.daewoon && saju.daewoon.list.length
    ? `\n[대운] ${saju.daewoon.forward ? '순행' : '역행'} — 10년 단위 인생 흐름\n` +
      saju.daewoon.list.map((x) => `${x.age}세~${x.age + 9}세: ${x.ko}`).join('\n')
    : '';

  // 세운·월운 (신년운세 등 시기 판단에 필수)
  const yl = saju.yearLuck;
  const yearBlock = yl ? `
[${yl.year}년 세운] ${yl.sewoon.ko}
천간 ${yl.sewoon.stem.ko}(${yl.sewoon.stem.el}) = ${yl.sewoon.stem.god}
지지 ${yl.sewoon.branch.ko}(${yl.sewoon.branch.el}) = ${yl.sewoon.branch.god} · 12운성 ${yl.sewoon.unseong}
${yl.currentDaewoon ? `현재 대운: ${yl.currentDaewoon.age}세~ ${yl.currentDaewoon.ko} (올해 ${yl.currentDaewoon.currentAge}세)` : ''}

[${yl.year}년 월운] — 시기 판단은 반드시 이 표를 근거로 하세요
${yl.wolwoon.map((w) =>
  `${String(w.month).padStart(2)}월 ${w.ko}: 천간=${w.stem.god}, 지지=${w.branch.god}, 12운성=${w.unseong}`
).join('\n')}` : '';

  return `[내담자 정보]
이름: ${client.name}
성별: ${client.gender || '미입력'}
생년월일: ${client.birthDate} (${client.calendar})
태어난 시간: ${saju.timeKnown ? client.birthTime : '모름'}
태어난 지역: ${client.region || '미입력'}
현재 연도: ${year}년
${client.question ? `\n[내담자가 남긴 질문]\n${client.question}\n→ 관련 있는 소제목에서 반드시 답해주세요.` : ''}

[사주 원국]
${godLine('year', '년주')}
${godLine('month', '월주')}
${godLine('day', '일주')}
${godLine('hour', '시주')}

[중심 기운]
일간: ${saju.dayMasterKo} (${saju.dayMasterElement})

[오행 분포]
목 ${saju.elements.목} · 화 ${saju.elements.화} · 토 ${saju.elements.토} · 금 ${saju.elements.금} · 수 ${saju.elements.수}
강한 기운: ${saju.strong.join(', ')} / 부족한 기운: ${saju.weak.join(', ')}
${dw}
${yearBlock}`;
}

/** OpenAI 호출 (JSON) */
async function callAI({ system, user, openaiKey, model, maxTokens }) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${openaiKey}` },
    body: JSON.stringify({
      model: model || 'gpt-4o-mini',
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.85,
      max_tokens: maxTokens || 4000,
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'OpenAI 호출 실패');
  const text = data.choices?.[0]?.message?.content || '{}';
  try { return JSON.parse(text); } catch (e) { return {}; }
}

/* ============================================================
 * 문체 검사 — AI 티 나는 표현을 잡아낸다
 * ============================================================ */

const BAD_PATTERNS = [
  { re: /\bAI\b|인공지능|분석 결과|데이터를 통해|알고리즘/g, label: '기계적 표현' },

  // 뭉개는 어미 — AI가 가장 많이 쓴다
  { re: /할 수 있을 것입니다|하는 데 도움이 될 것입니다|할 가능성이 높습니다|일 것으로 보입니다|라고 할 수 있습니다|라고 볼 수 있습니다|것으로 판단됩니다|할 수 있는 능력을|할 것으로 예상됩니다/g, label: '뭉개는 어미' },

  // 한자투 관료체 — 사람은 이렇게 안 쓴다
  { re: /내포하|시사하|자리매김|극대화|도모하|발현되|발현하|잠재력|시너지|역량을|일환으로|측면에서|함으로써|기인한|고취|증진|배가/g, label: '한자투 관료체' },

  // 훈계체
  { re: /중요합니다|필요합니다|바람직합니다|요구됩니다|권장합니다|명심하|유의하시기|유념하시기|noted|힘쓰시기/g, label: '훈계체' },

  // 추상 미사여구
  { re: /조화를 이루|균형을 이루|긍정적인 영향|부정적인 영향|긍정적으로 작용|시너지를 발휘|빛을 발하/g, label: '추상 미사여구' },

  { re: /(^|\n)\s*(결국|또한|이러한|이를 통해|따라서|즉|그러므로|한편)[,\s]/g, label: '접속사 시작' },
  { re: /중요한 역할을 할 것입니다|긍정적인 마음가짐|균형이 중요합니다|노력하면|최선을 다하면/g, label: '바넘 문장' },
];

/** 이름 반복 횟수 */
function countName(text, name) {
  if (!name) return 0;
  const m = String(text).match(new RegExp(name, 'g'));
  return m ? m.length : 0;
}

/** 블록 하나 검사 → 문제 목록 반환 */
function checkStyle(body, name) {
  const issues = [];
  BAD_PATTERNS.forEach((p) => {
    const m = String(body).match(p.re);
    if (m && m.length) issues.push(`${p.label} ${m.length}회`);
  });
  const n = countName(body, name);
  if (n > 2) issues.push(`이름 ${n}회 반복 (2회 이하로)`);
  return issues;
}

/**
 * 챕터 하나 생성
 */
async function generateChapter({ type, chapter, index, total, client, saju, openaiKey, model }) {
  const info = sajuBlock(client, saju);
  const subs = chapter.sub || [];

  const isQuestion = chapter.title === QUESTION_CHAPTER.title;

  // 질문 답변 챕터는 전용 지시를 준다
  const questionGuide = isQuestion ? `

⚠️ 이 챕터는 **내담자가 직접 남긴 질문에 답하는 챕터**입니다.

[내담자의 질문]
"${client.question}"

이 질문에만 집중해서 답하세요.
- 다른 챕터에서 이미 다룬 내용을 반복하지 마세요.
- 질문에 나온 주제를 명식에서 직접 찾아 근거로 삼으세요.
  (예: 결혼 질문 → 일지·배우자성·대운 / 이직 질문 → 관성·재성·현재 대운)
- 두루뭉술하게 넘기지 말고, 이 사람의 명식에서 답을 끌어내세요.
- 다만 단정("~하게 됩니다")은 피하고 흐름과 경향으로 씁니다.
- 답을 회피하지 마세요. 물어본 것에 대해 최선을 다해 답하세요.` : '';

  const user = `${info}

${fieldBlock(type)}

[작성할 챕터]
리포트 종류: ${type}
챕터 ${index + 1}/${total}: ${chapter.title}
${questionGuide}

아래 소제목 ${subs.length}개를 각각 **700~900자**로 작성해주세요.
blocks 배열에 소제목 순서대로 담아주세요. sub는 아래 소제목 그대로 쓰세요.

${subs.map((x, i) => `${i + 1}. ${x}`).join('\n')}

⚠️ 각 소제목마다 반드시 700자 이상 써주세요. 짧게 끝내면 안 됩니다.`;

  let out = await callAI({
    system: PDF_SYSTEM,
    user,
    openaiKey,
    model,
    maxTokens: 4000,
  });

  let blocks = Array.isArray(out.blocks) ? out.blocks : [];

  // 문체 검사 → 문제 있으면 1회 재작성
  const problems = [];
  blocks.forEach((b, i) => {
    const issues = checkStyle(b.body || '', client.name);
    if (issues.length) problems.push(`- "${b.sub}": ${issues.join(', ')}`);
  });

  if (problems.length) {
    console.log(`[문체] ${chapter.title} — ${problems.length}개 블록 재작성`);
    try {
      const fix = await callAI({
        system: PDF_SYSTEM,
        user: `${user}

⚠️ 방금 작성한 글에서 아래 문제가 발견됐습니다. 같은 내용을 유지하되 문체만 고쳐서 다시 써주세요.

${problems.join('\n')}

[다시 강조]
- 이름("${client.name}")은 소제목당 2번 이하로만 쓰세요. 나머지는 주어를 생략하세요.
- "결국", "또한", "이러한", "이를 통해", "따라서"로 문장을 시작하지 마세요.
- "~할 수 있을 것입니다", "~하는 데 도움이 될 것입니다" 같은 뭉개는 어미를 쓰지 마세요.
- 요약 문장으로 마무리하지 마세요.
- 반드시 명식(십성·12운성·지장간·대운)에서 근거를 가져와 쓰세요.

[방금 쓴 글]
${JSON.stringify({ blocks: blocks.map((b) => ({ sub: b.sub, body: b.body })) })}`,
        openaiKey,
        model,
        maxTokens: 4000,
      });
      const fixed = Array.isArray(fix.blocks) ? fix.blocks : [];
      if (fixed.length === blocks.length) blocks = fixed;
    } catch (e) {
      console.error('[문체] 재작성 실패:', e.message);
    }
  }

  return {
    title: chapter.title,
    blocks: blocks.map((b) => ({ sub: b.sub || '', body: b.body || '' })),
  };
}

/**
 * PDF 리포트 전체 생성 (챕터별 순차 호출)
 * @param onProgress (done, total, title) => void
 */
const CONCURRENCY = 3;   // 동시에 굴릴 챕터 수 (올릴수록 빠르지만 OpenAI 레이트리밋에 걸린다)

async function generatePdfReport({ type, client, saju, openaiKey, model, onProgress }) {
  // 내담자가 질문을 남겼으면 '질문 답변' 챕터를 마지막 조언 앞에 끼워 넣는다
  const chapters = outlineWithQuestion(type, client.question);
  const out = new Array(chapters.length);

  let cursor = 0;
  let done = 0;

  // 순차로 하나씩 돌리면 16챕터 × 30초 = 8분. 동시에 여러 개 굴린다.
  async function worker() {
    for (;;) {
      const i = cursor++;
      if (i >= chapters.length) return;
      const ch = chapters[i];

      try {
        out[i] = await generateChapter({
          type, chapter: ch, index: i, total: chapters.length,
          client, saju, openaiKey, model,
        });
      } catch (e) {
        console.error(`[PDF] 챕터 ${i + 1} (${ch.title}) 실패:`, e.message);
        out[i] = { title: ch.title, blocks: [], error: e.message };
      }

      done++;
      if (onProgress) onProgress(done, chapters.length, ch.title);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, chapters.length) }, worker)
  );

  if (onProgress) onProgress(chapters.length, chapters.length, '완료');
  return out;
}

module.exports.PDF_TYPES = PDF_TYPES;
module.exports.PDF_OUTLINES = PDF_OUTLINES;
module.exports.OUTLINES = OUTLINES;
module.exports.generatePdfReport = generatePdfReport;
module.exports.generateChapter = generateChapter;
module.exports.checkStyle = checkStyle;


/* ============================================================
 * 내담자 추가질문 — 이미 보낸 리포트를 근거로 답한다
 * ============================================================ */

/** 저장된 리포트(sections) → AI에게 줄 컨텍스트 */
function reportContext(sections) {
  if (!sections) return '';

  // 유료: [{ title, blocks:[{sub, body}] }]
  if (Array.isArray(sections)) {
    return sections.map((ch) => {
      const body = (ch.blocks || [])
        .map((b) => (b.sub ? `[${b.sub}] ` : '') + String(b.body || ''))
        .join('\n');
      return `## ${ch.title}\n${body}`;
    }).join('\n\n');
  }

  // 무료: { manse, self, personality, year, love, wealth, health, advice }
  const LAB = {
    manse: '내 사주 한눈에 보기', self: '사주로 보는 나는?', personality: '타고난 성향',
    year: '올해 운세', love: '연애운', wealth: '재물운', health: '건강운', advice: '종합 조언',
  };
  return Object.entries(LAB)
    .filter(([k]) => sections[k])
    .map(([k, label]) => `## ${label}\n${sections[k]}`)
    .join('\n\n');
}

/** JSON 강제 없이 글로 받는 호출 */
async function callAIText({ system, messages, openaiKey, model, maxTokens }) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${openaiKey}` },
    body: JSON.stringify({
      model: model || 'gpt-4o-mini',
      messages: [{ role: 'system', content: system }, ...messages],
      temperature: 0.8,
      max_tokens: maxTokens || 1400,
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'OpenAI 호출 실패');
  return (data.choices?.[0]?.message?.content || '').trim();
}

/**
 * 추가질문 답변
 * @param {object} o { client, saju, sections, history, question, openaiKey, model }
 */
async function answerFollowUp({ client, saju, sections, history, question, openaiKey, model }) {
  const system = `당신은 13년 경력의 명리학 상담가입니다.
${client.name}님께 이미 사주 리포트를 보내드렸고, 지금은 그것을 읽고 들어온 추가 질문에 답하는 중입니다.

## 이 사람의 사주
${sajuBlock(client, saju)}

## 이미 보내드린 리포트
${reportContext(sections).slice(0, 6000)}

## 답변 규칙
- 리포트에 쓴 내용과 어긋나지 않게 답합니다. 앞뒤가 맞아야 합니다.
- 원국의 어느 글자를 근거로 그렇게 보는지 최소 한 번은 짚습니다. (예: "일지에 놓인 관성이…")
- 3~5문단, 문단당 2~4문장. 한두 줄로 끊지 마세요.
- 단정하지 말고 흐름과 경향으로 말합니다. "반드시", "무조건" 같은 말은 쓰지 않습니다.
- 좋은 말로만 포장하지 않습니다. 짚어야 할 것은 짚되 겁주지 않습니다.
- 사주로 답할 수 없는 질문(의료 진단, 법률, 투자 종목 등)은 솔직히 그렇다고 말하고,
  대신 사주로 볼 수 있는 결(성향·시기의 흐름)만 짚어줍니다.
- 건강은 진단·치료를 말하지 않고 생활 관리 경향만 이야기합니다.
- AI, 데이터, 분석 결과 같은 기계적인 표현은 절대 쓰지 않습니다.
- ${client.name}님이라고 부르되 매 문단 반복하지는 마세요.
- 마크다운 기호(#, *, -)를 쓰지 말고 그냥 문단으로 씁니다.`;

  const messages = [];
  (history || []).slice(-6).forEach((h) => {
    messages.push({ role: 'user', content: h.question });
    messages.push({ role: 'assistant', content: h.answer });
  });
  messages.push({ role: 'user', content: question });

  return callAIText({ system, messages, openaiKey, model, maxTokens: 1400 });
}

module.exports.answerFollowUp = answerFollowUp;
module.exports.reportContext = reportContext;

