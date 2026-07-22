// 무료사주 AI 생성 (교육생 OpenAI 키 사용)
const { fieldBlock } = require('./sajuFields');

/* 쓰는 모델
 * gpt-4o-mini 는 문체 지시(끊지 말고 이어 써라)를 거의 못 따른다.
 * 리포트가 상품이므로 gpt-4o 를 쓴다. 리포트 한 편에 300~500원 수준.
 * 환경변수 AI_MODEL 로 바꿀 수 있다. */
const MODEL = process.env.AI_MODEL || 'gpt-4o';

/* ============================================================
 * 문체 규칙 — 무료사주와 유료 리포트가 같이 쓴다.
 * (한쪽만 고치면 결이 갈라진다)
 * ============================================================ */
const STYLE_RULES = `### 문체 총칙 — 사람이 직접 설명하는 느낌으로

0. **가장 중요 — 문장이 뚝뚝 끊기면 무조건 실패입니다.**
   존댓말이든 아니든, 어미가 무엇이든 상관없습니다.
   짧은 문장을 하나씩 툭 떨어뜨려 나열하면 그 순간 AI 글이 됩니다.

   ❌ "~합니다. ~합니다. ~합니다."
   ❌ "~됩니다. ~됩니다. ~됩니다."
   ❌ "~있습니다. ~있습니다. ~있습니다."
   → 어미 이름이 뭐든 상관없습니다. **끊기면 실패입니다.**

   문장과 문장은 서로를 붙들고 있어야 합니다.
   앞 문장이 뒤 문장의 원인이 되고, 뒤 문장이 앞 문장을 받아야 합니다.
   그렇게 한 문단이 하나의 흐름으로 읽혀야 합니다.

1. **같은 어미를 두 번 연속 쓰지 마세요.**
   섞어 쓰세요: ~합니다 / ~입니다 / ~한 편입니다 / ~기 쉽습니다 / ~게 됩니다 /
   ~일 때가 많습니다 / ~해서 그렇습니다 / ~하곤 합니다 / ~는 셈입니다

2. **문장 길이를 다양하게.** 짧은 문장과 긴 문장을 섞으세요.

3. **접속어는 문장 안에서만.** 특히·반면·예를 들어 는 문장 중간에 넣으세요.
   ⚠️ "또한", "따라서", "즉", "이러한" 으로 **문장을 시작하지 마세요.** AI 티가 확 납니다.
   ❌ "또한 재물운이 좋습니다."
   ✅ "재물운도 함께 열립니다."

4. **마침표를 줄이고 문단으로 묶으세요.** 관련된 내용은 한 문단 안에서
   자연스럽게 이어 붙이세요. 한 문장씩 툭툭 떨어뜨리지 마세요.

5. **보고서체 금지.** 사람이 앞에 앉아 설명하는 말투로 쓰세요.

### 문장 리듬 — 이게 사람 글과 AI 글을 가릅니다
AI는 모든 문장을 비슷한 길이로, 전부 "~입니다"로 끝냅니다. 사람은 안 그럽니다.

**가장 흔한 실패 — 문장이 뚝뚝 끊깁니다:**
❌ "감정의 기복이 약점으로 작용합니다. 타인의 감정에 민감하여 스스로의 감정을 잃어버리기도 합니다.
   이로 인해 우울감을 느끼거나 자신을 잃는 경향이 나타납니다. 감정을 조절하는 것이 필요합니다."
→ 네 문장이 전부 "~니다"로 끝나고, 서로 이어지지 않고 나열만 됩니다.

✅ "감정의 기복이 큽니다.
   남의 기분을 먼저 읽어버리는 탓에 정작 내 감정이 어디쯤 와 있는지를 놓칠 때가 많습니다.
   그렇게 며칠을 흘려보내고 나면 이유 없이 가라앉습니다.
   기복 자체를 없애려 들면 더 지치기 때문에 지금 내 기분이 어디쯤인지 알아차리는 것만으로 충분합니다."

→ 이 글의 어디가 다른지 정확히 보세요.
   1) 첫 문장이 짧게 치고 들어옵니다. 결론을 먼저 던졌습니다.
   2) 둘째 문장은 깁니다. "~탓에"로 원인을 물려 한 호흡에 이었습니다.
   3) 셋째 문장이 그 결과를 받습니다. "그렇게"로 앞 문장과 물려 있습니다.
   4) 마지막은 조언인데, "~기 때문에"로 근거와 결론을 한 문장에 묶었습니다.
      여기서 "더 지칩니다. 알아차리는 것만으로 충분합니다." 처럼 끊었다면 실패입니다.

   즉 짧게 → 길게 → 받고 → 묶어서 닫습니다. 문장이 서로를 붙들고 있습니다.

**지킬 것:**
- **문장을 서로 이어 쓰세요.** 연결어미(~하고, ~지만, ~는데, ~어서, ~며, ~탓에, ~면)를 써서
  앞뒤가 원인·결과·대조로 물리게 하세요. 짧은 문장만 나열하지 마세요.
- **한 문단에 20자 이하의 짧은 문장을 최소 하나** 넣으세요. 긴 문장 뒤에 붙여 끊어주세요.
  예: "그래서 손해를 봅니다." / "말이 앞섭니다." / "여기서 갈립니다."
- **어미를 바꾸세요.** "~입니다"만 반복하지 말고 "~합니다 / ~한 편입니다 / ~기 쉽습니다 /
  ~해서 그렇습니다 / ~게 됩니다 / ~일 때가 많습니다" 를 섞으세요.
- 결론을 먼저 던지고 근거를 뒤에 붙이세요. 근거부터 쌓아 올리지 마세요.
- **조언은 근거와 한 문장으로 묶으세요.** "~기 때문에" "~라서" "~니까" 로 이유와 결론을 붙이세요.
  ❌ "더 지칩니다. 알아차리는 것만으로 충분합니다."  (두 동강)
  ✅ "더 지치기 때문에, 알아차리는 것만으로 충분합니다."  (한 호흡)

### 쉼표 — 습관처럼 찍지 마세요
쉼표는 숨을 쉬는 자리입니다. 숨이 안 차는데 찍으면 글이 답답해집니다.

**써도 되는 경우:**
1. 단어를 나열할 때 — "일, 사람, 돈"
2. 앞뒤 절이 둘 다 길어서 한 번 끊어줘야 할 때
   ✅ "목은 간의 기능과 밀접하게 연관되므로, 간이 지치는 상황은 회복력을 떨어뜨립니다."
   ✅ "스트레스를 받으면 회복이 둔해져 주의가 필요하고, 감정적으로 힘든 시기가 반복되면
       신체 회복에도 영향을 줍니다."

**쓰지 말아야 할 경우 — 짧은 구 뒤:**
❌ "남의 기분을 읽는 탓에, 내 감정을 놓칩니다."
✅ "남의 기분을 읽는 탓에 내 감정을 놓칩니다."
❌ "이 시기에는, 기회가 옵니다."
✅ "이 시기에는 기회가 옵니다."

한 문장에 쉼표는 **하나면 충분합니다.** 두 개 이상 찍혔다면 문장을 잘못 만든 것입니다.

### 한자투 관료체 금지 (하나라도 쓰면 실패)
"내포하다 / 시사하다 / 자리매김 / 극대화 / 도모하다 / 발현되다 / 잠재력 /
 역량 / 시너지 / 일환으로 / ~함으로써 / ~측면에서 / 기인하다"
→ 이런 말은 보고서에나 씁니다. 사람이 사람에게 하는 말로 바꾸세요.

### 훈계체 금지
"중요합니다 / 필요합니다 / 바람직합니다 / 요구됩니다 / 유념하시기 바랍니다"
→ 가르치려 들지 마세요. 상황을 보여주고 사람이 스스로 판단하게 두세요.

### 문단 안에서 문장을 물려 쓰세요 — 실제 교정 사례

아래는 AI가 쓴 글과, 사람이 손본 글입니다. 무엇이 바뀌었는지 정확히 보세요.

❌ AI:
"목은 간담의 속성과 연결되어 있어 기운이 소모된 후에 빠르게 충전되는 경향이 있습니다.
 이러한 특성 덕분에 힘든 상황에서도 빠른 시간 안에 정상 컨디션으로 돌아옵니다."
✅ 사람:
"목은 간담의 속성과 연결되어 있어 기운이 소모된 후에 빠르게 충전되는 경향이 있는데
 이러한 특성 덕분에 힘든 상황에서도 빠른 시간 안에 정상 컨디션으로 돌아옵니다."
→ "있습니다. 이러한" 을 "있는데 이러한" 으로 물렸습니다.

❌ AI:
"스트레스를 많이 받을 경우 회복력이 둔화될 수 있어 주의가 필요합니다.
 감정적으로 힘든 시기가 반복되면 신체적 회복에도 악영향을 미칠 수 있습니다."
✅ 사람:
"스트레스를 많이 받을 경우 회복력이 둔화될 수 있어 주의가 필요하고,
 감정적으로 힘든 시기가 반복되면 신체적 회복에도 악영향을 미칠 수 있습니다."
→ "필요합니다. 감정적으로" 를 "필요하고, 감정적으로" 로 물렸습니다.

❌ AI:
"대운의 흐름이 지나치게 가속화되면 오히려 지치는 현상이 발생할 수 있습니다.
 이런 시기엔 적절한 휴식과 재충전이 필요합니다."
✅ 사람:
"대운의 흐름이 지나치게 가속화되면 오히려 지치는 현상이 발생할 수 있으니
 이런 시기에는 적절한 휴식과 재충전이 필요합니다."
→ "있습니다. 이런 시기엔" 을 "있으니 이런 시기에는" 으로 물렸습니다.

**핵심: 한 문단은 3~4문장으로 줄이고, 마지막은 한 문장으로 닫습니다.**
문장을 하나씩 툭툭 떨어뜨리지 말고, 앞 문장의 끝과 뒤 문장의 앞을
"~는데 / ~고 / ~니 / ~어서 / ~므로" 로 물려서 이으세요.

### ⭐ 이 글이 정답입니다. 이 결로 쓰세요.

건강운 '회복력' 을 이렇게 썼습니다:

"회복력이 빠릅니다.
 일간이 갑목이라 소모된 기운이 금세 채워지는데 목이 간담과 이어져 있어서 그렇습니다.
 며칠을 몰아쳐도 하루 자고 나면 다시 서는 편이라, 스스로도 체력이 좋다고 여기며 살아왔을 겁니다.

 다만 그 회복이 무너지는 자리가 하나 있습니다.
 간이 지치면 목의 기운도 같이 주저앉기 때문에 스트레스가 길게 이어지면 평소 같으면 하루면 될
 회복이 사흘이 되고 일주일이 됩니다.
 몸이 아니라 마음이 먼저 지치는 구조라, 감정이 흔들리는 시기가 반복되면 체력까지 같이 끌려 내려갑니다.

 지금 대운인 기사는 기운이 넘치는 자리입니다.
 회복도 잘 되지만 넘치는 만큼 자기도 모르게 몰아붙이게 되니, 지치고 나서 쉬는 게 아니라
 지치기 전에 끊어주는 편이 낫습니다."

**이 글의 뼈대를 그대로 가져가세요:**

1. **문단은 짧은 한 문장으로 칩니다.** "회복력이 빠릅니다." / "다만 그 회복이 무너지는 자리가 하나 있습니다."
   결론이나 전환을 먼저 던지고 시작합니다.

2. **그다음 긴 문장으로 근거를 붙입니다.** 이때 마침표로 끊지 말고 "~라 / ~는데 / ~서 그렇습니다 /
   ~기 때문에 / ~되니" 로 물려서 한 호흡에 갑니다.

3. **한 문단은 2~3문장.** 그 이상 늘어지면 나열이 됩니다.

4. **어미가 매번 다릅니다.** 빠릅니다 → 그렇습니다 → 겁니다 → 있습니다 → 됩니다 → 내려갑니다 → 낫습니다.
   같은 어미가 두 번 연속 오지 않습니다.

5. **말이 구체적입니다.** "빠르게 충전되는 경향이 있습니다" 가 아니라
   "하루 자고 나면 다시 서는 편이라" 라고 씁니다. 겪은 사람의 말로 쓰세요.

6. **좋은 말만 하지 않습니다.** 회복이 빠르다고 말한 다음, 그게 무너지는 자리를 바로 짚습니다.

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
가리키고, 좋은 말만 하지 않습니다. 이렇게 쓰세요.`;

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

${STYLE_RULES}

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
      model: model || MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.85,
      // ⚠️ 이걸 안 주면 기본 한도에서 잘려서 뒤쪽 섹션(건강운·종합조언)이 통째로 사라진다.
      //    8섹션 × 750자 ≈ 6000자 ≈ 4500토큰. 넉넉히 잡는다.
      max_tokens: 8000,
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    const err = new Error(data.error?.message || 'OpenAI 호출 실패');
    err.code = data.error?.code;
    throw err;
  }

  const finish = data.choices?.[0]?.finish_reason;
  if (finish === 'length') {
    console.error('[무료사주] 응답이 토큰 한도에서 잘렸습니다. max_tokens 를 올려야 합니다.');
  }

  const text = data.choices?.[0]?.message?.content || '{}';
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (e) {
    console.error('[무료사주] JSON 파싱 실패 (응답이 잘린 듯):', String(text).slice(-120));
    parsed = {};
  }

  /* 빠진 섹션이 있으면 그것만 다시 받아온다 (잘렸든 모델이 빼먹었든) */
  const NEED = ['manse', 'self', 'personality', 'year', 'love', 'wealth', 'health', 'advice'];
  const missing = NEED.filter((k) => !parsed[k] || String(parsed[k]).trim().length < 50);

  if (missing.length) {
    console.log('[무료사주] 빠진 섹션 다시 요청:', missing.join(', '));
    try {
      const more = await callAI({
        system: SYSTEM_PROMPT,
        user: `${userPrompt}

⚠️ 방금 응답에서 아래 항목이 빠졌습니다. **이 항목만** JSON 으로 다시 써주세요.
다른 항목은 넣지 마세요.

${missing.map((k) => '- ' + k).join('\n')}`,
        openaiKey,
        model,
        maxTokens: 4000,
      });
      missing.forEach((k) => {
        if (more[k] && String(more[k]).trim().length > 30) parsed[k] = more[k];
      });
    } catch (e) {
      console.error('[무료사주] 빠진 섹션 보충 실패:', e.message);
    }
  }
  /* 문체 검사 — 걸린 섹션만 다시 쓴다 (유료 리포트와 같은 기준) */
  const LONG = ['manse', 'self', 'personality', 'year', 'love', 'wealth', 'health', 'advice'];
  const bad = LONG.filter((k) => parsed[k] && checkStyle(parsed[k], client.name).length);

  if (bad.length) {
    const notes = bad
      .map((k) => `- ${k}: ${checkStyle(parsed[k], client.name).join(', ')}`)
      .join('\n');
    console.log('[문체] 무료사주 —', bad.length, '개 항목 재작성:', bad.join(', '));

    try {
      const fixed = await callAI({
        system: SYSTEM_PROMPT,
        user:
          `아래 글의 문체를 고쳐 다시 쓰세요. 내용과 해석은 그대로 두고 문장만 손봅니다.\n\n` +
          `## 지적된 문제\n${notes}\n\n` +
          `## 고칠 때 지킬 것\n` +
          `- 문장이 뚝뚝 끊기지 않게 연결어미(~는데/~라/~어서/~기 때문에)로 이어 쓰세요.\n` +
          `- 같은 어미를 두 번 연속 쓰지 마세요.\n` +
          `- 짧은 구 뒤에는 쉼표를 찍지 마세요.\n` +
          `- 분량은 줄이지 마세요.\n\n` +
          `## 고칠 글 (JSON)\n` +
          JSON.stringify(Object.fromEntries(bad.map((k) => [k, parsed[k]])), null, 1) +
          `\n\n같은 키를 가진 JSON 으로만 답하세요.`,
        openaiKey,
        model,
        maxTokens: 3000,
      });

      const rewritten = JSON.parse(String(fixed).replace(/```json|```/g, '').trim());
      bad.forEach((k) => { if (rewritten[k]) parsed[k] = rewritten[k]; });
    } catch (e) {
      console.error('[문체] 무료사주 재작성 실패 (원문 유지):', e.message);
    }
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

const { OUTLINES, titles, outlineWithQuestion, QUESTION_CHAPTER, isSpecialist } = require('./outlines');

const PDF_TYPES = ['신년운세', '종합사주', '연애운', '결혼운', '재물운', '건강운', '연인궁합', '재회운', '취업·직장운', '이직운', '자녀운', '합격운', '이동·이사운', '인간관계운', '무료사주'];

// 하위 호환 (기존 코드가 PDF_OUTLINES를 참조)
const PDF_OUTLINES = {};
PDF_TYPES.forEach((t) => { PDF_OUTLINES[t] = titles(t); });

const PDF_SYSTEM = `당신은 30년 경력의 사주 명리학 상담가입니다. 손님 앞에 앉아 직접 풀이해주듯 씁니다.

## 문체 — 반드시 지킬 것

### 이름 사용 — ⭐ 매우 중요
- **이름은 되도록 쓰지 마세요.** 안 써도 누구 이야기인지 다 압니다.
- **첫 문장부터 바로 본론으로.** "○○님은" 으로 시작하지 마세요.
- 이름을 꼭 써야 하면 **한 챕터에 1번**, 그것도 반드시 **"님"을 붙여서** 씁니다.
- **절대 금지: 이름 뒤에 "은/는/이/가"를 붙인 반말** ("김형희는", "김형희가")
  → 손님을 반말로 부르는 것이라 크게 실례입니다.
- 대부분은 주어를 생략하거나 "타고난 성정이", "이 사주는" 처럼 씁니다.
- 나쁜 예: "김형희는 맡은 일을 끝까지 해냅니다. 김형희는 소통 능력도 뛰어납니다."
- 좋은 예: "맡은 일을 끝까지 해내는 사람입니다. 남들이 지칠 때 오히려 더 집중합니다."

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

${STYLE_RULES}
## ⭐⭐ 가장 중요 — 쉬운 말로, 그러나 구체적으로

내담자는 명리학을 모릅니다. **전문용어를 그대로 쓰면 서너 장 만에 읽기를 포기합니다.**
그렇다고 "성실한 편입니다" 처럼 두루뭉술하게 쓰면 **"누구에게나 해당되는 말"** 이 됩니다.

**답은 하나입니다. 명식은 당신 머릿속에서만 보고, 글에는 그 결과를 쉬운 말로 씁니다.**

### 용어 번역표 (반드시 이렇게 바꿔 쓰세요)
| 명식 | 리포트에 쓸 말 |
|---|---|
| 비견이 강하다 | 혼자 판단하고 직접 결정하려는 힘이 강합니다 |
| 겁재가 강하다 | 경쟁 상황에서 쉽게 물러서지 않고, 사람이나 돈 문제에서 주도권을 잡으려 합니다 |
| 식상이 발달했다 | 생각과 재능을 말이나 행동으로 드러내는 힘이 좋습니다 |
| 재성이 강하다 | 돈과 눈에 보이는 성과를 중요하게 여기고, 결과를 직접 만들어냅니다 |
| 관성이 약하다 | 엄격한 규칙이나 통제를 답답해합니다 |
| 인성이 부족하다 | 충분히 쉬거나 생각을 정리하기 전에 몸이 먼저 움직입니다 |
| 목 기운이 강하다 | 목표가 생기면 방향을 정하고 꾸준히 밀고 나갑니다 |
| 일지에 편재를 두어 | 돈이 눈에 보이면 몸이 먼저 움직입니다 |

**용어를 쓰지 마세요. 결과만 쓰세요.**
꼭 필요하면 처음 한 번만 괄호로 뜻을 적고, 그 다음부터는 쉬운 말로 받습니다.

### 구체적으로 쓴다는 것 — 이게 핵심입니다
"성실합니다" 는 아무한테나 붙는 말입니다. **언제·어떤 상황에서·어떻게 행동하는지**를 쓰세요.

❌ "책임감이 강하고 성실한 편입니다. 주변의 신뢰를 얻습니다."
   → 이건 누구에게나 해당됩니다. 돈 내고 받은 리포트에서 이런 문장이 나오면 안 됩니다.

⭕ "맡은 일을 놓지 못합니다.
   남들이 대충 넘기는 것도 혼자 붙들고 앉아 있어서, 결국 일이 몰립니다.
   그러다 어느 순간 '왜 나만 하지' 싶어지는데, 그때도 입 밖으로 꺼내지는 않습니다."

### 각 소제목의 첫 문장은 결론부터, 용어 없이
❌ "정관이 월지에 뿌리내려 12운성 건록에 놓였습니다."   ← 첫 줄부터 벽
⭕ "책임을 맡으면 끝까지 해내는 사람입니다."           ← 결론부터

## 내용 — 반드시 지킬 것
- 좋은 말만 하지 마세요. 약점·모순·주의점을 구체적으로 짚습니다.
- 단정적 예언("반드시 ~한다", "~하게 된다")은 피하고 경향으로 씁니다.
- 본문에 한자를 쓰지 마세요.
- **추상적인 조언으로 끝내지 마세요.**
  ❌ "타인의 의견을 받아들이는 유연함이 필요합니다."
  ⭕ "상대가 다른 의견을 냈을 때 바로 반박하기보다, 먼저 이유를 물어본 다음
     내 생각을 설명하면 같은 싸움이 줄어듭니다."

## 다른 챕터와 같은 말을 하지 마세요
아래에 리포트 전체 목차를 드립니다. **당신이 맡은 챕터의 소제목에만 집중하세요.**
다른 챕터가 다룰 내용을 미리 요약하거나 앞질러 말하지 마세요. 그게 "반복된다"는 느낌의 원인입니다.

## 언어
- **한국어로만 쓰세요.** 사람 이름을 영어로 바꿔 쓰지 마세요. (예: 김경태 → kim경태 금지)

## 분량
- **각 소제목마다 700~900자.** 짧게 끝내지 마세요.
- 소제목당 3~4문단. 문단 구분은 \n\n 입니다.
- 분량을 채우려고 같은 말을 표현만 바꿔 반복하지 마세요.
  분량이 필요하면 **구체적인 생활 사례**를 넣으세요.

## 출력 형식
반드시 아래 JSON으로만 출력합니다. 다른 텍스트는 넣지 마세요.
{ "blocks": [ { "sub": "소제목", "body": "본문 (700~900자)" }, ... ] }`;

/** 사주 정보 블록 (프롬프트용) */
function sajuBlock(client, saju, partner, partnerSaju, type) {
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
${yearBlock}${partner && partnerSaju ? `

════════════════════════════════════
[상대방 정보] — 궁합을 볼 상대
이름: ${partner.name || '상대방'}
성별: ${partner.gender || '미입력'}
생년월일: ${partner.birthDate} (${partner.calendar})
태어난 시간: ${partnerSaju.timeKnown ? partner.birthTime : '모름'}

[상대방 사주 원국]
${(() => {
  const pd = partnerSaju.detail;
  const pl = (key, label) => {
    const x = pd[key];
    if (!x || !x.stem) return `${label}: (시간 모름)`;
    const jj = (x.jijanggan || []).map((g) => g.ko).join('');
    return `${label}: ${x.stem.ko}(${x.stem.el}, ${x.stem.god}) / ${x.branch.ko}(${x.branch.el}, ${x.branch.god}) · 12운성 ${x.unseong || '-'} · 지장간 ${jj || '-'}`;
  };
  return [pl('year','년주'), pl('month','월주'), pl('day','일주'), pl('hour','시주')].join('\\n');
})()}

[상대방 중심 기운]
일간: ${partnerSaju.dayMasterKo} (${partnerSaju.dayMasterElement})

[상대방 오행 분포]
목 ${partnerSaju.elements.목} · 화 ${partnerSaju.elements.화} · 토 ${partnerSaju.elements.토} · 금 ${partnerSaju.elements.금} · 수 ${partnerSaju.elements.수}
강한 기운: ${partnerSaju.strong.join(', ')} / 부족한 기운: ${partnerSaju.weak.join(', ')}

→ 이 리포트는 두 사람의 '궁합'입니다. 각자의 사주를 길게 풀지 말고,
  두 사람이 만났을 때 나타나는 상호작용·차이·조화에 집중해서 작성하세요.` : (
  type === '연인궁합' || type === '재회운' ? `

════════════════════════════════════
[상대방 정보 없음]
상대방의 생년월일이 입력되지 않았습니다.

⚠️ 상대방의 사주를 아는 것처럼 쓰지 마세요.
   "상대방의 일간은", "상대방 사주를 보면", "상대의 오행이" 같은 표현 금지.
⚠️ 상대의 현재 마음을 사실처럼 단정하지 마세요.
→ 신청자 본인 사주에 나타나는 인연운·관계운을 중심으로 쓰세요.
→ 상대에 대해서는 "이런 성향의 상대와 잘 맞습니다" 처럼 가능성으로 표현하세요.
→ 첫 장에서 "상대방 정보가 없어 본인 사주를 중심으로 살펴본다"고
   한 번만 자연스럽게 알려주세요.` : '')}`;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** OpenAI 호출 (JSON) — 실패하면 몇 번 다시 시도한다.
 *
 *  예전에는 한 번 실패하면 그대로 빈 챕터({})가 되어
 *  "소제목만 있고 내용이 없는" 리포트가 나갔다.
 *  레이트리밋(429)·일시적 서버 오류·JSON 깨짐은 다시 부르면 대부분 성공한다. */
async function callAI({ system, user, openaiKey, model, maxTokens, _tries = 4 }) {
  let lastErr = null;

  for (let attempt = 1; attempt <= _tries; attempt++) {
    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${openaiKey}` },
        body: JSON.stringify({
          model: model || MODEL,
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

      if (!res.ok) {
        const msg = data.error?.message || 'OpenAI 호출 실패';
        // 429(요청 과다) · 5xx(서버 문제)는 잠시 쉬었다가 다시 시도
        if ((res.status === 429 || res.status >= 500) && attempt < _tries) {
          // 429(사용량 초과)는 '분당 한도'라서 몇 초 기다려서는 다시 걸린다.
          //   OpenAI가 알려주는 대기 시간이 있으면 그걸 쓰고, 없으면 넉넉히 기다린다.
          //   새로 만든 API 키는 분당 한도가 낮아 이 경우가 자주 생긴다.
          let wait;
          if (res.status === 429) {
            const hdr = Number(res.headers?.get?.('retry-after')) || 0;
            wait = hdr > 0 ? (hdr + 2) * 1000 : [20000, 35000, 50000][attempt - 1] || 50000;
          } else {
            wait = 3000 * attempt;
          }
          console.error(`[AI] ${res.status} 사용량 초과 — ${Math.round(wait / 1000)}초 후 재시도 (${attempt}/${_tries})`);
          await sleep(wait);
          lastErr = new Error(msg);
          continue;
        }
        throw new Error(msg);
      }

      if (data.choices?.[0]?.finish_reason === 'length') {
        console.error('[AI] 응답이 토큰 한도에서 잘렸습니다.');
      }

      const text = data.choices?.[0]?.message?.content || '';
      try {
        const parsed = JSON.parse(text);
        if (parsed && typeof parsed === 'object') return parsed;
        throw new Error('빈 응답');
      } catch (e) {
        // JSON 이 깨졌으면 다시 시도 (토큰 한도로 잘린 경우가 대부분)
        if (attempt < _tries) {
          console.error(`[AI] 응답 형식 오류 — 재시도 (${attempt}/${_tries})`);
          await sleep(1500 * attempt);
          lastErr = e;
          continue;
        }
        return {};
      }
    } catch (e) {
      lastErr = e;
      // 네트워크 오류 등도 재시도
      if (attempt < _tries) {
        console.error(`[AI] ${e.message} — 재시도 (${attempt}/${_tries})`);
        await sleep(2000 * attempt);
        continue;
      }
      throw e;
    }
  }

  throw lastErr || new Error('OpenAI 호출 실패');
}

/* ============================================================
 * 문체 검사 — AI 티 나는 표현을 잡아낸다
 * ============================================================ */

/* ============================================================
 * 내용 검사 — "용어를 썼나"가 아니라 "구체적인가"를 본다
 *
 * ★ 이 파일에서 가장 중요한 부분이다.
 *
 * 두 개의 상반된 피드백이 있었다.
 *   ① "누구에게나 적용될 것 같다" (바넘)  → 구체적으로 쓰라
 *   ② "어려운 용어에 지쳐서 못 읽겠다"    → 용어를 빼라
 *
 * 둘 다 만족하는 길은 하나뿐이다.
 *   → 구체성은 유지하되, 용어를 쉬운 말로 번역한다.
 *
 *   "비견이 강하다"                                  ❌ 어렵다
 *   "책임감이 강한 편입니다"                          ❌ 누구에게나 해당
 *   "혼자 판단하고 직접 결정하려는 힘이 강합니다.
 *    남이 대신 정해주면 답답해서 결국 다시 뒤집습니다"  ⭕ 쉽고 구체적
 *
 * 그래서 검사기는 용어 개수를 세지 않는다.
 * "이 문장이 그 사람 이야기인가, 아무한테나 붙는 말인가"를 본다.
 * ============================================================ */

/** 명식 전문용어 — 최종 리포트에서는 되도록 안 보여야 한다 */
const JARGON = [
  '일간', '일지', '월간', '월지', '연간', '연지', '년지', '시간지', '시지',
  '연주', '년주', '월주', '일주', '시주', '원국', '명식', '배우자궁',
  '비견', '겁재', '식신', '상관', '정재', '편재', '정관', '편관', '정인', '편인',
  '비겁', '식상', '재성', '관성', '인성', '십성', '관살', '식상생재',
  '십이운성', '12운성', '장생', '건록', '제왕', '지장간',
  '대운', '세운', '월운', '신강', '신약', '용신', '기신', '합충',
];

/** 오행 이름만 따로 (건강운 등에서 어쩔 수 없이 쓰이지만 최소화) */
const ELEMENT_WORDS = ['목의 기운', '화의 기운', '토의 기운', '금의 기운', '수의 기운',
  '목 기운', '화 기운', '토 기운', '금 기운', '수 기운', '오행'];

function jargonHits(body) {
  const t = String(body);
  let total = 0;
  const found = [];
  JARGON.concat(ELEMENT_WORDS).forEach((w) => {
    const m = t.match(new RegExp(w, 'g'));
    if (m && m.length) { total += m.length; found.push(w); }
  });
  return { total, found };
}

/* ── ① 바넘 문장 — 아무한테나 붙는 말 ──
 *
 * 이 표현들이 나오면 그 문단은 그 사람 이야기가 아니다.
 * 교육생이 직접 지목한 문장들을 그대로 넣었다. */
const BARNUM = [
  // 추상적인 조언
  /균형이 (중요|필요)/, /유연(함|성)이 (필요|중요)/, /조화를 이루/,
  /자신을 돌아보는 시간/, /긍정적인 (영향|마음|자세|태도)/,
  /다양한 가능성/, /삶의 방향을 설정/, /사주 전체의 상호작용/,
  /노력하면/, /최선을 다하면/, /꾸준히 노력/,
  /소통이 (중요|필요|도움)/, /열린 마음/, /자기 자신을 믿/,

  // 누구에게나 해당되는 성격 서술 (그 자체로 끝나면 바넘)
  /책임감이 강한 편입니다/, /성실한 편입니다/, /신뢰를 주는/,
  /주변 사람들에게 인정받/, /리더십이 있/, /자신감을 가지/,
];

function barnumHits(body) {
  const t = String(body);
  const hit = [];
  BARNUM.forEach((re) => {
    const m = t.match(re);
    if (m) hit.push(m[0]);
  });
  return hit;
}

function isBarnum(body) {
  const hit = barnumHits(body);
  if (hit.length >= 2) {
    return `누구에게나 해당되는 말 ${hit.length}개 ("${hit.slice(0, 3).join('", "')}") — 이 사람만의 구체적인 상황과 행동으로 바꾸세요`;
  }
  if (hit.length === 1) {
    return `누구에게나 해당되는 말 ("${hit[0]}") — 구체적인 행동 방법을 함께 적으세요`;
  }
  return null;
}

/* ── ② 구체성 — 실제 장면이 그려지는가 ──
 *
 * 구체적인 글에는 반드시 나온다.
 *   · 상황을 그리는 말   ("~할 때", "~하면", "~인 경우", "~앞에서")
 *   · 시기               ("30대 중반", "2027년", "상반기")
 *
 * 형용사만 나열하면 그 사람 이야기가 아니라 아무한테나 붙는 말이 된다. */
function noSpecifics(body) {
  const t = String(body);

  const scene = (t.match(/(면[\s,.]|때|경우|순간|상황|앞에서|입장|사이에|일수록|는데도)/g) || []).length;
  const timing = (t.match(/\d{2,4}\s*(년|세|월|대)|상반기|하반기|초반|중반|후반|어릴|젊을|나이가/g) || []).length;

  if (scene < 3 && timing === 0) {
    return '구체적인 장면이 없음 — "언제·어떤 상황에서·어떻게 행동하는지"를 넣으세요 (형용사 나열만으로는 그 사람 이야기가 되지 않습니다)';
  }
  return null;
}




/* ── 과거 추측 잡기 ──
 *
 *   우리는 이 사람이 무슨 일을 겪었는지 모른다.
 *   그런데 "2026년 9월은 조화를 이루는 시기였습니다",
 *   "고집을 조금만 풀어 주었다면 좋은 결과를 이끌어낼 가능성이 높았습니다" 처럼
 *   지난 일을 짐작해 쓰는 일이 있었다. 앞으로 올 달까지 과거형으로 쓰기도 했다.
 *   내담자가 질문에 적어준 것이 아니면 과거 이야기는 아예 쓰지 않는다. */
function pastGuess(body, opts) {
  const t = String(body);
  const asked = String((opts && opts.question) || '');

  // 질문에 적힌 내용이면 언급해도 된다
  const inQuestion = (frag) => {
    const key = frag.replace(/[^가-힣0-9]/g, '').slice(0, 6);
    return key.length >= 3 && asked.replace(/[^가-힣0-9]/g, '').includes(key);
  };

  const hits = [];

  // ① 연·월 + 과거형 단정
  const dated = /(\d{4}\s*년\s*\d{1,2}\s*월|\d{1,2}\s*월)[^.!?]{0,60}?(였습니다|이었습니다|했습니다|있었습니다|높았습니다|좋았습니다|됐습니다|되었습니다)/g;
  let m;
  while ((m = dated.exec(t))) hits.push(m[0].trim());

  // ② 가정형 과거 — "~했다면 ~했을 것입니다"
  const ifPast = /[^.!?\n]{0,45}(했다면|주었다면|였다면|갔다면|했더라면)[^.!?\n]{0,45}(습니다|것입니다|텐데)/g;
  while ((m = ifPast.exec(t))) hits.push(m[0].trim());

  // ③ 겪은 일 단정
  const claim = /[^.!?\n]{0,40}(한 일이 있었습니다|경험이 있었습니다|적이 있었습니다|일을 겪었습니다)/g;
  while ((m = claim.exec(t))) hits.push(m[0].trim());

  const real = hits.filter((h) => !inQuestion(h));
  if (!real.length) return null;

  return '지난 일을 짐작해서 썼습니다 — "' + real[0].slice(0, 34) + '..." '
       + '(내담자가 질문에 적은 것이 아니면 과거 이야기는 쓰지 않습니다. '
       + '현재형이나 앞으로의 흐름으로 바꾸세요)';
}


/* ── ③ 용어 노출 — 최종 리포트에 전문용어가 그대로 나오는가 ── */
function jargonExposed(body, opts) {
  const t = String(body);
  const { total, found } = jargonHits(t);
  if (total === 0) return null;

  const limit = (opts && opts.allowJargon) ? 8 : 3;   // 종합사주는 조금 허용

  if (total > limit) {
    return `전문용어가 그대로 노출됨 (${total}회: ${found.slice(0, 4).join('·')}) — 쉬운 말로 바꿔 쓰세요. 예: "비견이 강하다" → "혼자 판단하고 직접 결정하려는 힘이 강한 편입니다"`;
  }

  // 조금 나왔어도 풀이가 없으면 문제
  const explains = (t.match(/[(（][^)）]{2,40}[)）]/g) || []).length;
  if (total >= 2 && explains === 0) {
    return `전문용어 ${total}회를 풀이 없이 사용 — 쉬운 말로 바꾸거나, 처음 한 번만 괄호로 뜻을 적으세요`;
  }
  return null;
}

/* ── ④ 첫 문장 — 결론부터 쉬운 말로 ── */
function hardOpening(body) {
  const first = splitSents(String(body))[0] || '';
  const hit = JARGON.filter((w) => first.indexOf(w) >= 0);
  if (hit.length >= 1) {
    return `첫 문장에 전문용어(${hit.slice(0, 2).join('·')}) — 첫 문장은 용어 없이 결론부터 쓰세요`;
  }
  return null;
}

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

  // 짧은 구 뒤 쉼표 (긴 절 사이의 쉼표는 정상이므로 잡지 않는다)
  { re: /(탓에|때문에|덕분에|에는|에서는|이로 인해|그러나|또한|즉)\s*,/g, label: '불필요한 쉼표' },
  { re: /중요한 역할을 할 것입니다|긍정적인 마음가짐|균형이 중요합니다|노력하면|최선을 다하면/g, label: '바넘 문장' },
];

/** 이름 반복 횟수 */
function countName(text, name) {
  if (!name) return 0;
  const m = String(text).match(new RegExp(name, 'g'));
  return m ? m.length : 0;
}

/** 이름 뒤에 "님" 없이 조사가 붙은 반말 호칭 ("김형희는", "김형희가") */
function rawName(text, name) {
  if (!name) return 0;
  const re = new RegExp(name + '(?!님)(은|는|이|가|의|를|을|도|와|과|에게|한테)', 'g');
  const m = String(text).match(re);
  return m ? m.length : 0;
}

/** 같은 어미가 연속으로 반복되는지 검사 */
function sameEnding(body) {
  const sents = String(body).split(/(?<=[다요][.!?])\s+/).map((x) => x.trim()).filter(Boolean);
  if (sents.length < 3) return null;

  const tail = (x) => {
    const m = x.match(/(\S{2,6})[.!?]$/);
    return m ? m[1] : '';
  };

  let run = 1, worst = 1, which = '';
  for (let i = 1; i < sents.length; i++) {
    if (tail(sents[i]) && tail(sents[i]) === tail(sents[i - 1])) {
      run++;
      if (run > worst) { worst = run; which = tail(sents[i]); }
    } else run = 1;
  }
  return worst >= 3 ? `같은 어미 "${which}" ${worst}회 연속 (어미를 바꿔 쓰세요)` : null;
}

/** 문장이 뚝뚝 끊기는지 검사
 *
 * 예전엔 '연결어미가 있나' 로 봤는데, "다양하고" 의 '하고' 까지 연결어미로 세는 바람에
 * 정작 끊긴 글이 다 통과했다. 이제 문단 단위로 잰다.
 *
 * 목표 문체: 한 문단 2~3문장. 첫 문장은 짧게 치고 뒤는 길게 이어 붙인다.
 *   → 문단에 문장이 4개 이상이면 나열이다.
 *   → 평균 문장 길이가 35자 미만이면 토막글이다.
 */
function splitSents(t) {
  return String(t).split(/(?<=[다요][.!?])\s+/).map((x) => x.trim()).filter(Boolean);
}

function choppy(body) {
  const paras = String(body).split(/\n{2,}|\n/).map((x) => x.trim()).filter(Boolean);
  const bad = [];

  paras.forEach((p, i) => {
    const sents = splitSents(p);
    if (sents.length < 2) return;

    const avg = sents.reduce((a, x) => a + x.length, 0) / sents.length;

    // 프롬프트가 "한 문단 3~4문장"을 요구하므로 4문장은 정상이다.
    // 예전에는 4문장부터 걸러서, 시킨 대로 쓴 글도 매번 재작성에 들어갔다.
    // (그 바람에 장마다 AI 를 3번씩 불러 분당 한도를 넘겼다)
    if (sents.length >= 6) {
      bad.push(`${i + 1}번째 문단이 ${sents.length}문장 (3~4문장으로 줄이고 이어 쓰세요)`);
    } else if (avg < 35) {
      bad.push(`${i + 1}번째 문단이 토막글 (평균 ${Math.round(avg)}자, 문장을 물려 이으세요)`);
    }
  });

  if (!bad.length) return null;
  return bad.slice(0, 3).join(' / ');
}

/** 블록 하나 검사 → 문제 목록 반환
 *
 *  opts.allowJargon : 종합사주는 용어를 조금 더 허용한다 (용어 풀이 페이지가 있으므로)
 */
function checkStyle(body, name, opts) {
  const issues = [];

  // ── 내용 ──
  const b = isBarnum(body);
  if (b) issues.push(`[내용] ${b}`);

  const s = noSpecifics(body);
  if (s) issues.push(`[내용] ${s}`);

  const pg = pastGuess(body, opts);
  if (pg) issues.push(`[내용] ${pg}`);

  const j = jargonExposed(body, opts);
  if (j) issues.push(`[내용] ${j}`);

  const o = hardOpening(body);
  if (o) issues.push(`[내용] ${o}`);

  // ── 문체 ──
  BAD_PATTERNS.forEach((p) => {
    const m = String(body).match(p.re);
    if (m && m.length) issues.push(`${p.label} ${m.length}회`);
  });
  const c = choppy(body);
  if (c) issues.push(c);
  const e = sameEnding(body);
  if (e) issues.push(e);
  const raw = rawName(body, name);
  if (raw > 0) issues.push(`이름 반말 호칭 ${raw}회 ("${name}은/는") — "${name}님은"으로 고치거나, 이름을 뺄 거면 조사까지 같이 빼고 문장을 다시 쓰세요 (조사만 남기면 안 됩니다)`);
  const n = countName(body, name);
  if (n > 1) issues.push(`이름 ${n}회 반복 (챕터당 1번 이하, 나머지는 주어 생략)`);

  return issues;
}

/**
 * 챕터 하나 생성
 */

/* ══════════════════════════════════════════════
 * 오늘이 며칠인지 알려주고, 지나간 달을 추천하지 않게 한다.
 *
 *   예전에는 연도만 넘겨서 2026년 7월에 "2월이 좋다"는 글이 나왔다.
 *   달을 말할 때는 반드시 연도를 붙이게 하고,
 *   앞일을 봐주는 리포트는 이번 달부터만 고르게 한다.
 * ══════════════════════════════════════════════ */

// 일생·대운을 다루므로 달 단위로 말하지 않는 리포트
const LIFE_LONG  = ['종합사주'];

function timeBlock(type) {
  // 한국 시간 기준
  const now = new Date(Date.now() + 9 * 3600 * 1000);
  const y = now.getUTCFullYear();
  const m = now.getUTCMonth() + 1;

  const head = `[오늘]\n${y}년 ${m}월 ${d0(now)}일 (한국 시간)`;

  // 모든 리포트 공통 — 지난 일은 아예 꺼내지 않는다
  const noPast = `
⚠️ **지나간 시기는 이야기하지 마세요.** 무슨 일이 있었는지 우리는 모릅니다.
- 지난 일을 짐작해서 쓰지 마세요. "~였습니다", "~했을 것입니다", "~했다면 좋았을 텐데" 모두 금지입니다.
- 내담자가 남긴 질문에 지난 일이 적혀 있을 때만, 그 내용에 한해 언급할 수 있습니다.
- 그 밖의 모든 시기는 **지금부터 앞으로**만 씁니다.`;

  if (LIFE_LONG.indexOf(type) >= 0) {
    return `${head}
- 이 리포트는 **일생의 큰 흐름**을 다룹니다. 특정 달을 짚지 마세요.
  ⭕ "30대 중반으로 넘어가면서 이런 면이 드러납니다"
  ⭕ "지금 대운이 바뀌는 무렵이라 방향이 달라지는 시기입니다"
- 시기는 **나이·연도·대운**으로 말하세요. 달이 궁금한 분에게는 신년운세가 따로 있습니다.
- 성향과 기질은 시기와 무관하니 **현재형**으로 씁니다.${noPast}`;
  }

  const left = 12 - m;
  const nextHint = left === 0
    ? `올해는 이번 달이 마지막이니 ${y + 1}년 상반기를 중심으로 보세요.`
    : left <= 3
      ? `올해 남은 달이 ${left}개월뿐이니 ${y + 1}년 상반기까지 함께 보세요.`
      : `필요하면 ${y + 1}년 초까지 넘어가도 됩니다.`;

  const lastY = left <= 3 ? y + 1 : y;
  const lastM = left <= 3 ? 6 : 12;

  return `${head}
[다룰 기간] ${y}년 ${m}월 ~ ${lastY}년 ${lastM}월 — **이 범위 밖은 쓰지 마세요.**
- 시기는 **${y}년 ${m}월부터** 고르세요. ${m > 1 ? `${y}년 1~${m - 1}월은 이미 지났습니다.` : ''}
- ${nextHint}
- 달을 말할 때는 반드시 "${m + 1 > 12 ? (y + 1) + '년 1월' : y + '년 ' + (m + 1) + '월'}" 처럼 **연도를 붙여** 쓰세요.
- 앞으로 올 달은 **앞일 어투**로 씁니다.
  ❌ "${y}년 ${m + 1 > 12 ? 1 : m + 1}월은 조화를 이루는 시기였습니다"  ← 아직 오지 않은 달입니다
  ⭕ "${y}년 ${m + 1 > 12 ? 1 : m + 1}월은 조화를 이루기 쉬운 시기입니다"
- 이번 달(${y}년 ${m}월) 안에 할 수 있는 일이 있으면 그것부터 짚어주세요.${noPast}`;
}

function d0(dt) { return dt.getUTCDate(); }

async function generateChapter({ type, chapter, index, total, client, saju, partner, partnerSaju, openaiKey, model, allChapters }) {
  const info = sajuBlock(client, saju, partner, partnerSaju, type);
  const subs = chapter.sub || [];

  /* ── 종합사주 vs 전문 리포트 — 역할을 분명히 나눈다 ──
   *
   * 교육생 피드백: "리포트마다 똑같은 성격 얘기가 반복된다"
   * 원인: 전문 리포트에서도 종합사주식 성격 분석을 길게 늘어놓았다. */
  const spec = isSpecialist(type);

  const roleBlock = spec ? `

[⚠️ 이 리포트는 "${type}" 전문 리포트입니다 — 종합사주가 아닙니다]

**타고난 성격을 길게 설명하지 마세요.** 그건 종합사주에서 다룹니다.
이 리포트는 **"${type}"이라는 분야에서 실제로 어떻게 행동하고 어떤 흐름을 겪는가**만 씁니다.

❌ 이런 문장을 쓰지 마세요 (종합사주에서 이미 다룹니다):
   "독립적인 성향입니다" / "자기주장이 강합니다" / "추진력이 좋습니다"
   "감정을 쌓아두는 편입니다" / "유연함이 필요합니다"

⭕ 대신 이렇게 쓰세요 — 그 성향이 "${type}"에서 **어떤 장면으로 나타나는지**:
   "연애에서도 상대와 충분히 의논하기 전에 혼자 결론을 내립니다.
    연락이 줄거나 서운한 일이 생기면 바로 말하기보다 혼자 생각을 정리하려 합니다."

기본 성향이 꼭 필요하면 **한두 문장으로만** 연결하고, 곧바로 "${type}" 이야기로 넘어가세요.` : `

[이 리포트는 종합사주입니다]
"이 사람이 기본적으로 어떤 사람인가"를 설명합니다.
연애·결혼·재물·건강·특정 연도의 운세를 전문 리포트처럼 깊게 파고들지 마세요.
각 분야의 기본 성향만 짚고, 전체적으로 어떤 사람인지 이해시키는 데 집중합니다.`;

  const isQuestion = chapter.title === QUESTION_CHAPTER.title;

  /* 첫 요약 챕터("한눈에 보는 나의 사주" 등)는 예외.
     여기서는 사주 용어를 살짝 곁들여 "내 사주가 이렇게 생겼구나"를 보여준다.
     (용어 풀이 페이지가 앞에 있으므로 찾아볼 수 있다) */
  const summaryTitles = ['한눈에 보는 나의 사주', '내 사주 핵심 요약', '나의 사주 핵심 요약'];
  const isSummary = index === 0 && summaryTitles.indexOf(chapter.title) >= 0;

  const summaryBlock = isSummary ? `

[이 챕터는 "요약" 챕터입니다 — 여기서만 사주 용어를 살짝 씁니다]
다른 챕터와 달리, 여기서는 이 사람의 명식이 어떻게 생겼는지 뼈대를 보여줍니다.
- 일간·오행 분포·가장 강한 십성 정도는 **용어를 그대로 써도 됩니다.**
  예: "일간은 경금(庚金)입니다. 오행 중 금이 강하고 화가 약한 편입니다."
- 단, 용어를 처음 쓸 때는 **괄호로 짧게 뜻을 곁들여** 주세요.
  예: "비견(자기 힘·주체성을 뜻하는 기운)이 두드러집니다."
- 용어만 나열하지 말고, 그것이 성격으로 어떻게 드러나는지 쉬운 말로 이어서 설명합니다.
- 이 챕터에서만 허용됩니다. 나머지 챕터는 여전히 쉬운 말로 씁니다.` : '';

  /* 리포트 전체 목차 — 다른 챕터 영역을 침범하지 않게 한다.
     챕터를 병렬로 생성하다 보니 서로 뭘 썼는지 모른 채
     비슷한 얘기를 반복하는 문제가 있었다. */
  const mapBlock = (Array.isArray(allChapters) && allChapters.length > 1)
    ? `\n[리포트 전체 목차 — 남의 챕터를 침범하지 마세요]\n` +
      allChapters.map((c, i) => {
        const mine = i === index ? '  ⬅ 당신이 맡은 챕터' : '';
        return `${i + 1}. ${c.title}${mine}\n` +
               (c.sub || []).map((s) => `     · ${s}`).join('\n');
      }).join('\n') +
      `\n\n⚠️ 위 목록에서 "당신이 맡은 챕터"의 소제목만 씁니다.\n` +
      `다른 챕터가 다룰 내용은 미리 요약하지도, 앞질러 말하지도 마세요.`
    : '';

  // 질문 답변 챕터는 전용 지시를 준다
  const questionGuide = isQuestion ? `

⚠️ 이 챕터는 **내담자가 직접 남긴 질문에 답하는 챕터**입니다.
돈을 내고 물어본 것이고, 리포트 전체에서 **가장 궁금해하는 부분**입니다.

[내담자의 질문]
"${client.question}"

### 첫 번째 소제목 "먼저, 물어보신 것에 대한 답"
- **첫 문단에서 질문에 대한 답을 직접 말합니다.** 뜸 들이지 마세요.
- 명식 설명으로 시작하지 마세요. 답부터 하고, 근거는 두 번째 소제목에서 댑니다.
- 예: 질문이 "올해 이직해도 될까요?" 라면
  → "지금 자리를 옮기는 것 자체는 나쁘지 않습니다. 다만 시기가 문제입니다. 상반기보다는…"
- 애매하게 얼버무리지 마세요. 물어본 것에 대해 답을 하세요.

### 네 소제목은 각각 다른 각도입니다 — 같은 말을 네 번 하지 마세요
1. **먼저, 물어보신 것에 대한 답** → 결론. 직답.
2. **명식에서 이 답이 나온 근거** → 왜 그런지. 어느 글자를 보고 그렇게 말하는지.
3. **흐름이 바뀌는 시기** → 언제. 대운·세운을 근거로 구체적인 나이/연도.
4. **지금 할 수 있는 것 / 하지 말아야 할 것** → 행동. 실제로 뭘 하라는 건지.

- 질문에 나온 주제를 명식에서 직접 찾아 근거로 삼으세요.
  (예: 결혼 질문 → 일지·배우자성·대운 / 이직 질문 → 관성·재성·현재 대운)
- 다른 챕터에서 이미 다룬 내용을 반복하지 마세요.
- 단정("~하게 됩니다")은 피하고 흐름과 경향으로 씁니다.
- 답을 회피하지 마세요. 물어본 것에 대해 최선을 다해 답하세요.` : '';

  const user = `${info}

${fieldBlock(type)}
${roleBlock}${summaryBlock}
${mapBlock}

${timeBlock(type)}

[작성할 챕터]
리포트 종류: ${type}
챕터 ${index + 1}/${total}: ${chapter.title}
${questionGuide}
${chapter.note ? `\n[이 장에서 특히 지킬 것]\n${chapter.note}\n` : ''}
아래 소제목 ${subs.length}개를 각각 **700~900자**로 작성해주세요.
blocks 배열에 소제목 순서대로 담아주세요. sub는 아래 소제목 그대로 쓰세요.

${subs.map((x, i) => `${i + 1}. ${x}`).join('\n')}

⚠️ 각 소제목마다 반드시 700자 이상 써주세요.
⚠️ **전문용어를 쓰지 마세요.** 명식은 당신 머릿속에서만 보고, 글에는 결과만 쉬운 말로 씁니다.
⚠️ **구체적으로 쓰세요.** "어떤 상황에서·어떻게 행동하는지"가 없으면 누구에게나 해당되는 말이 됩니다.
⚠️ **없는 일을 지어내지 마세요.** 이 사람이 무슨 일을 겪었는지 우리는 모릅니다.
   직업·회사·가족·연애 상황도 모릅니다. 알려준 것은 생년월일과 남긴 질문뿐입니다.
   ❌ "2026년 6월 성과평가가 기대에 미치지 못했을 때"   ← 지어낸 사건
   ❌ "팀 프로젝트에서 의견을 고집하다 갈등을 빚었습니다"  ← 직장인인지도 모릅니다
   ⭕ "결정을 미루다 기회를 놓치는 일이 반복되기 쉽습니다"  ← 성향과 패턴
   ⭕ "그런 상황이 오면 먼저 나서기보다 지켜보는 편입니다"  ← 어떻게 행동하는지
   구체성은 **어떤 사람인지**에서 나옵니다. **무슨 일이 있었는지**를 지어내서 만드는 게 아닙니다.
⚠️ 각 소제목의 첫 문장은 결론부터. 용어 없이.`;

  let out = await callAI({
    system: PDF_SYSTEM,
    user,
    openaiKey,
    model,
    maxTokens: 6000,
  });

  let blocks = Array.isArray(out.blocks) ? out.blocks : [];

  // 내용이 통째로 비어 오면(모델이 형식을 놓친 경우) 한 번 더 부른다.
  //   이걸 안 하면 "소제목만 있고 내용이 없는 장"이 그대로 리포트에 실린다.
  const hasBody = (arr) => arr.some((b) => String(b && b.body || '').trim().length > 30);
  if (!blocks.length || !hasBody(blocks)) {
    console.error(`[PDF] "${chapter.title}" 내용이 비어 다시 생성합니다.`);
    out = await callAI({
      system: PDF_SYSTEM,
      user: user + '\n\n⚠️ 반드시 blocks 배열의 각 항목에 sub(소제목)와 body(본문 700~900자)를 모두 채워 JSON으로만 답하세요. body를 비우지 마세요.',
      openaiKey,
      model,
      maxTokens: 6000,
    });
    const retry = Array.isArray(out.blocks) ? out.blocks : [];
    if (retry.length && hasBody(retry)) blocks = retry;
  }

  // 문체 검사 → 문제 있으면 1회 재작성
  const problems = [];
  blocks.forEach((b, i) => {
    const issues = checkStyle(b.body || '', client.name, { allowJargon: !spec || isSummary, question: client.question || '' });
    if (issues.length) problems.push(`- "${b.sub}": ${issues.join(', ')}`);
  });

  /* 통과할 때까지 다시 쓴다 (최대 2회).
     예전에는 한 번 고치고 끝이라, 고친 글이 또 끊겨도 그대로 저장됐다. */
  for (let attempt = 1; attempt <= 2; attempt++) {
    const probs = [];
    blocks.forEach((b) => {
      const issues = checkStyle(b.body || '', client.name, { allowJargon: !spec || isSummary, question: client.question || '' });
      if (issues.length) probs.push(`- "${b.sub}": ${issues.join(', ')}`);
    });
    if (!probs.length) break;

    /* 내용 문제([내용] 표시)가 섞여 있으면 "문장만 고치라"고 하면 안 된다.
       그러면 근거 없는 글이 문체만 다듬어진 채로 통과한다. */
    const hasContent = probs.some((p) => p.includes('[내용]'));

    console.log(
      `[검사] ${chapter.title} — ${probs.length}개 블록 재작성 (${attempt}차)` +
      (hasContent ? ' ⚠️ 내용 문제 포함' : '')
    );

    const contentFix = hasContent ? `

[⚠️ 내용 문제 — 문장만 다듬어서는 해결되지 않습니다. 다시 생각해서 쓰세요]

**"누구에게나 해당되는 말"** 이라고 나왔다면:
  이 사람의 사주를 안 보고 아무한테나 붙는 말을 썼다는 뜻입니다.
  위에 드린 [사주 원국]·[오행 분포]·[대운] 을 다시 보고,
  그 결과를 **이 사람만의 구체적인 행동과 성향**으로 바꿔 쓰세요.
  단, 겪은 일을 지어내면 안 됩니다. 직업·회사·가족 상황을 우리는 모릅니다.
  단, 명식은 머릿속에서만 보고 **글에는 용어를 쓰지 마세요.**

  ❌ "책임감이 강하고 성실한 편입니다. 주변의 신뢰를 얻습니다."
  ⭕ "맡은 일을 놓지 못합니다.
     남들이 대충 넘기는 것도 혼자 붙들고 앉아 있어서 결국 일이 몰립니다.
     그러다 '왜 나만 하지' 싶어지는데, 그때도 입 밖으로 꺼내지는 않습니다."

**"구체적인 장면이 없음"** 이라고 나왔다면:
  형용사만 나열했다는 뜻입니다. **어떤 상황에서·어떻게 행동하는지**를 넣으세요.
  ⚠️ 없던 사건을 만들어 채우지 마세요. 성향과 반복되는 패턴으로 구체화합니다.
  "~할 때", "~하면", "~인 경우" 같은 상황과, 실제로 무엇을 하는지를 씁니다.

**"전문용어가 그대로 노출됨"** 이라고 나왔다면:
  용어를 쉬운 말로 **번역**하세요. 괄호로 풀어주는 것으로는 부족합니다. 아예 바꿔 쓰세요.
  · 비견이 강하다 → 혼자 판단하고 직접 결정하려는 힘이 강합니다
  · 식상이 발달했다 → 생각과 재능을 말이나 행동으로 드러내는 힘이 좋습니다
  · 관성이 약하다 → 엄격한 규칙이나 통제를 답답해합니다
  · 일지에 편재를 두어 → 돈이 눈에 보이면 몸이 먼저 움직입니다

**"첫 문장에 전문용어"** 라고 나왔다면:
  첫 문장은 용어 없이 결론부터 씁니다.
  ❌ "정관이 월지에 뿌리내려 건록에 놓였습니다."
  ⭕ "책임을 맡으면 끝까지 해내는 사람입니다."

- 분량(700~900자)은 그대로 유지하세요. 줄이지 마세요.` : `

⚠️ 방금 쓴 글의 문체가 어색합니다. 해석과 내용은 그대로 두고 문장만 고쳐 다시 쓰세요.`;

    try {
      const fix = await callAI({
        system: PDF_SYSTEM,
        user: `${user}
${contentFix}

[발견된 문제]
${probs.join('\n')}

[문체 — 이것도 같이 지키세요]
짧은 문장을 하나씩 툭툭 떨어뜨리지 마세요. 아래처럼 물려서 이으세요.

❌ "일주가 병화입니다. 이 기운은 밝고 화사한 성격을 나타냅니다.
    자유롭고 긍정적인 성정이 타인에게 좋은 영향을 미칩니다."

✅ "일주가 병화입니다.
    한낮의 해처럼 밝고 뜨거운 기운이라 어디에 있든 눈에 띄고, 사람들이 먼저 다가옵니다.
    스스로도 그 분위기를 알고 있어서 자리를 만들거나 사람을 모으는 일이 어렵지 않습니다."

- 한 문단은 2~3문장. 첫 문장은 짧게 치고, 뒷문장은 길게 이어 붙이세요.
- 연결어미(~라 / ~는데 / ~어서 / ~기 때문에 / ~되니)로 물리세요.
- 같은 어미를 두 번 연속 쓰지 마세요.
- 짧은 구 뒤에는 쉼표를 찍지 마세요.
- 이름("${client.name}")은 소제목당 2번 이하. **한글 그대로** 쓰고 영어 표기 금지.
- "또한 / 따라서 / 즉 / 이러한" 으로 문장을 시작하지 마세요.
- 분량은 줄이지 마세요.

⚠️ 이름은 반드시 한글 "${client.name}" 그대로 쓰세요. 영어 표기 금지.
⚠️ 한국어로만 쓰고 영어 단어를 섞지 마세요.

[방금 쓴 글]
${JSON.stringify({ blocks: blocks.map((b) => ({ sub: b.sub, body: b.body })) })}`,
        openaiKey,
        model,
        maxTokens: 6000,
      });
      const fixed = Array.isArray(fix.blocks) ? fix.blocks : [];
      if (fixed.length === blocks.length) {
        // 재작성 결과를 그대로 덮어쓰면 안 된다.
        //   응답이 잘리거나 본문이 빈 채로 오는 경우가 있는데, 그대로 교체하면
        //   멀쩡하던 내용까지 사라져 "소제목만 남는" 리포트가 된다.
        let replaced = 0;
        blocks = blocks.map((orig, bi) => {
          const nb = fixed[bi] || {};
          const nbody = String(nb.body || '').trim();
          const obody = String(orig.body || '').trim();
          if (!nbody || (obody && nbody.length < obody.length * 0.5)) return orig;
          replaced++;
          return { sub: nb.sub || orig.sub, body: nb.body };
        });
        if (!replaced) break;
      }
      else break;
    } catch (e) {
      console.error('[검사] 재작성 실패:', e.message);
      break;
    }
  }

  return {
    title: chapter.title,
    blocks: blocks.map((b) => ({ sub: b.sub || '', body: tidyName(b.body || '', client.name) })),
  };
}

/** 최종 안전장치 — AI가 실수로 넣은 반말 호칭·이름 과다 반복을 정리한다.
 *  방침: 이름은 거의 다 뺀다. 소유격만 "님의"로 존대 보존. */
function tidyName(body, name) {
  if (!name) return body;
  let t = String(body);

  // 1) 소유격만 존대로: "김형희의 강점" → "김형희님의 강점"
  t = t.replace(new RegExp(name + '(?!님)의', 'g'), name + '님의');

  // 2) 나머지 "이름+조사"는 통째로 제거 → 주어 생략
  t = t.replace(new RegExp('\\s*' + name + '(?!님)(은|는|이|가|를|을|도|와|과|에게|한테)\\s*', 'g'),
    function (m, josa, off, str) {
      const prev = str[off - 1] || '';
      return /[.!?\n]/.test(prev) || off === 0 ? '' : ' ';
    });

  // 3) 이름만 지워지고 조사가 남은 문장 머리를 정리한다
  //    ("는 다양한 환경에서…" → "다양한 환경에서…")
  //    AI 가 재작성할 때 이름 글자만 지우는 일이 있어 뒤처리로 막는다
  //    ⚠️ '이·도·와·과' 는 뺐다. "이 사람은", "와 정말" 처럼 멀쩡한 말이 잘려나간다
  t = t.replace(/(^|[.!?]\s+|\n\s*)(?:은|는|를|을|가|에게|한테)\s+/g, '$1');

  return t.replace(/([.!?])([가-힣A-Za-z0-9])/g, '$1 $2')   // 마침표 뒤 띄어쓰기 복구
          .replace(/[ \t]{2,}/g, ' ').replace(/\n{3,}/g, '\n\n')
          .replace(/\s+([.,])/g, '$1').trim();
}

/**
 * PDF 리포트 전체 생성 (챕터별 순차 호출)
 * @param onProgress (done, total, title) => void
 */
const CONCURRENCY = 2;   // 동시에 굴릴 챕터 수 (올릴수록 빠르지만 OpenAI 레이트리밋에 걸린다)

async function generatePdfReport({ type, client, saju, partner, partnerSaju, openaiKey, model, onProgress }) {
  // 내담자가 질문을 남겼으면 '질문 답변' 챕터를 마지막 조언 앞에 끼워 넣는다
  const chapters = outlineWithQuestion(type, client.question);
  const q = String(client.question || '').trim();
  console.log(q
    ? `[PDF] "${type}" — 남긴 질문 있음, '질문 답변' 장을 추가합니다 (총 ${chapters.length}장)`
    : `[PDF] "${type}" — 남긴 질문 없음 (총 ${chapters.length}장)`);
  const out = new Array(chapters.length);

  let cursor = 0;
  let done = 0;

  // 순차로 하나씩 돌리면 16챕터 × 30초 = 8분. 동시에 여러 개 굴린다.
  async function worker() {
    for (;;) {
      const i = cursor++;
      if (i >= chapters.length) return;
      const ch = chapters[i];

      const args = {
        type, chapter: ch, index: i, total: chapters.length,
        client, saju, partner, partnerSaju, openaiKey, model,
        allChapters: chapters,   // 챕터끼리 내용이 겹치지 않게 전체 목차를 보여준다
      };

      try {
        out[i] = await generateChapter(args);
      } catch (e) {
        // 한 챕터가 실패해도 포기하지 않고 한 번 더 시도한다.
        //   (실패한 채로 두면 "소제목만 있고 내용 없는 장"이 리포트에 남는다)
        console.error(`[PDF] 챕터 ${i + 1} (${ch.title}) 실패 — 다시 시도합니다:`, e.message);
        await sleep(3000);
        try {
          out[i] = await generateChapter(args);
        } catch (e2) {
          console.error(`[PDF] 챕터 ${i + 1} (${ch.title}) 최종 실패:`, e2.message);
          out[i] = { title: ch.title, blocks: [], error: e2.message };
        }
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
      model: model || MODEL,
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
- 3~5문단, 문단당 2~3문장.
- 단정하지 말고 흐름과 경향으로 말합니다. "반드시", "무조건" 같은 말은 쓰지 않습니다.
- 좋은 말로만 포장하지 않습니다. 짚어야 할 것은 짚되 겁주지 않습니다.
- 사주로 답할 수 없는 질문(의료 진단, 법률, 투자 종목 등)은 솔직히 그렇다고 말하고,
  대신 사주로 볼 수 있는 결(성향·시기의 흐름)만 짚어줍니다.
- 건강은 진단·치료를 말하지 않고 생활 관리 경향만 이야기합니다.
- ${client.name}님이라고 부르되 매 문단 반복하지는 마세요.
- 마크다운 기호(#, *, -)를 쓰지 말고 그냥 문단으로 씁니다.

${STYLE_RULES}`;

  const messages = [];
  (history || []).slice(-6).forEach((h) => {
    messages.push({ role: 'user', content: h.question });
    messages.push({ role: 'assistant', content: h.answer });
  });
  messages.push({ role: 'user', content: question });

  let answer = await callAIText({ system, messages, openaiKey, model, maxTokens: 1400 });

  /* 문체 검사 — 걸리면 한 번 다시 쓴다. 내담자에게 바로 가는 글이라 더 엄격하게. */
  const issues = checkStyle(answer, client.name);
  if (issues.length) {
    console.log('[문체] 추가질문 재작성:', issues.join(', '));
    try {
      const fixed = await callAIText({
        system,
        messages: [
          ...messages,
          { role: 'assistant', content: answer },
          {
            role: 'user',
            content:
              `방금 답변의 문체가 어색합니다. 내용과 해석은 그대로 두고 문장만 고쳐 다시 써주세요.\n\n` +
              `## 지적된 문제\n${issues.map((x) => '- ' + x).join('\n')}\n\n` +
              `## 고칠 때 지킬 것\n` +
              `- 문장이 뚝뚝 끊기지 않게 연결어미(~는데/~라/~어서/~기 때문에)로 이어 쓰세요.\n` +
              `- 같은 어미를 두 번 연속 쓰지 마세요.\n` +
              `- 짧은 구 뒤에는 쉼표를 찍지 마세요.\n` +
              `- 분량은 줄이지 마세요.\n\n` +
              `고친 답변만 쓰세요. 다른 말은 붙이지 마세요.`,
          },
        ],
        openaiKey,
        model,
        maxTokens: 1400,
      });
      if (fixed && fixed.length > 50) answer = fixed;
    } catch (e) {
      console.error('[문체] 추가질문 재작성 실패 (원문 유지):', e.message);
    }
  }

  return answer;
}

module.exports.answerFollowUp = answerFollowUp;
module.exports.reportContext = reportContext;


/* ============================================================
 * 블록 하나만 다시 쓰기 (미리보기의 "AI 다시 쓰기")
 * ============================================================ */
async function rewriteBlock({ type, chapterTitle, sub, body, note, client, saju, openaiKey, model }) {
  const info = sajuBlock(client, saju);

  const user = `## 이 사람의 사주
${info}

## 지금 쓰고 있는 리포트
${type} — "${chapterTitle}" 챕터의 "${sub || '본문'}" 부분

## 지금 글
${body}

## 요청
${note ? note : '내용은 유지하되 문체만 다듬어주세요.'}

같은 자리에 들어갈 글을 다시 써주세요.
분량은 지금과 비슷하게 유지하세요. 제목이나 소제목은 쓰지 말고 본문만 쓰세요.
JSON 으로 답하세요: { "body": "다시 쓴 글" }`;

  const out = await callAI({
    system: PDF_SYSTEM,
    user,
    openaiKey,
    model,
    maxTokens: 3000,
  });

  let text = String(out.body || '').trim();
  if (!text) throw new Error('다시 쓴 글을 받지 못했습니다.');

  // 문체 검사 — 걸리면 한 번 더
  const issues = checkStyle(text, client.name);
  if (issues.length) {
    console.log('[문체] 다시쓰기 재작성:', issues.join(', '));
    try {
      const fix = await callAI({
        system: PDF_SYSTEM,
        user: `${user}

⚠️ 방금 쓴 글의 문체가 어색합니다. 아래 문제를 고쳐 다시 쓰세요.
${issues.map((x) => '- ' + x).join('\n')}

- 짧은 문장을 툭툭 떨어뜨리지 말고 연결어미(~는데/~라/~어서/~기 때문에)로 물려 쓰세요.
- 같은 어미를 두 번 연속 쓰지 마세요.
- 한 문단은 2~3문장.

[방금 쓴 글]
${text}

JSON 으로 답하세요: { "body": "다시 쓴 글" }`,
        openaiKey,
        model,
        maxTokens: 3000,
      });
      if (fix.body && String(fix.body).trim().length > 50) text = String(fix.body).trim();
    } catch (e) {
      console.error('[문체] 다시쓰기 재작성 실패:', e.message);
    }
  }

  return text;
}

module.exports.rewriteBlock = rewriteBlock;
