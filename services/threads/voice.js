/* ============================================================
 * services/threads/voice.js — 본인 말투 분석
 *
 * 교육생이 자기가 쓴 글을 붙여넣으면 말투 규칙서(voicePack)를 뽑는다.
 * 그 뒤로 글을 만들 때마다 이것이 프롬프트에 들어가 「내 말투」가 된다.
 *
 * ⚠️ 샘플이 적으면 모델이 말버릇을 지어낸다. 지어낸 말버릇은
 *    그 뒤로 만드는 모든 글에 박혀서 되돌리기가 어렵다.
 *    그래서 개수를 채우기 전에는 아예 돌리지 않는다.
 * ============================================================ */

const store = require('./store');
const { buildVoicePrompt } = require('./prompt');
const { runAi } = require('./llm');
const { parseLoose } = require('./parse');

const MIN_SAMPLES = 10;   // 이보다 적으면 말투가 안 잡힌다
const MAX_SAMPLES = 40;   // 넘으면 프롬프트만 길어지고 나아지지 않는다
const MIN_CHARS = 10;     // 한 줄짜리는 글로 치지 않는다

/**
 * 붙여넣은 덩어리를 글 여러 개로 가른다.
 * 「---」 로 나눴으면 그것으로, 아니면 빈 줄로 가른다.
 * 사람은 보통 글 사이를 한 줄 띄워서 붙여넣는다.
 */
function splitSamples(text) {
  const s = String(text == null ? '' : text).replace(/\r\n/g, '\n').trim();
  if (!s) return [];
  const chunks = /^\s*-{3,}\s*$/m.test(s)
    ? s.split(/^\s*-{3,}\s*$/m)
    : s.split(/\n\s*\n+/);
  return chunks.map((t) => t.trim()).filter((t) => t.length >= MIN_CHARS);
}

/** 받은 것이 무엇이든 글 목록으로 만든다 */
function toSamples(input) {
  if (Array.isArray(input)) {
    return input.map((t) => String(t == null ? '' : t).trim()).filter((t) => t.length >= MIN_CHARS);
  }
  return splitSamples(input);
}

/**
 * 말투 팩을 뽑아 저장한다.
 * 반환 { voicePack, used }  — used 는 실제로 쓴 글 개수
 */
async function analyze(userId, openaiKey, input) {
  const list = toSamples(input);

  if (list.length < MIN_SAMPLES) {
    const e = new Error(
      '글이 ' + list.length + '개뿐입니다. 최소 ' + MIN_SAMPLES + '개는 있어야 말투가 잡힙니다. ' +
      '글 사이를 한 줄 띄워서 붙여넣어주세요.'
    );
    e.code = 'TOO_FEW';
    throw e;
  }

  const settings = await store.getSettings(userId);
  const used = list.slice(0, MAX_SAMPLES);

  const { text } = await runAi(openaiKey, buildVoicePrompt(used), {
    model: settings.model,
    maxTokens: 8000,
    temperature: 0.2,          // 말투를 「뽑는」 일이다. 지어내면 안 된다.
  });

  const { data } = parseLoose(text);
  if (!data || typeof data !== 'object') {
    const e = new Error('말투를 읽어내지 못했습니다. 다시 한 번 눌러주세요.');
    e.code = 'EMPTY';
    throw e;
  }

  const prev = settings.voicePack;
  const pack = {
    version: (prev && prev.version ? prev.version : 0) + 1,
    endings: arr(data.endings),
    address: str(data.address),
    sentenceLen: {
      avg: num(data.sentenceLen && data.sentenceLen.avg, 22),
      max: num(data.sentenceLen && data.sentenceLen.max, 34),
    },
    lineBreakRhythm: str(data.lineBreakRhythm),
    signaturePhrases: arr(data.signaturePhrases),
    bannedWords: arr(data.bannedWords),
    symbols: {
      emoji: str(data.symbols && data.symbols.emoji) || '거의 안 씀',
      marks: arr(data.symbols && data.symbols.marks),
    },
    toneAxis: obj(data.toneAxis),
    ctaPatterns: arr(data.ctaPatterns),
    sampleExcerpts: arr(data.sampleExcerpts).length
      ? arr(data.sampleExcerpts).slice(0, 6)
      : used.slice(0, 6),
    sampleCount: used.length,
    createdAt: new Date().toISOString(),
  };

  /* 뽑았으면 그 말투로 갈아탄다.
     일부러 분석해놓고 고른 프리셋이 계속 쓰이면 「분석했는데 왜 그대로냐」가 된다.
     프리셋으로 돌아가고 싶으면 위에서 다시 고르면 된다. */
  await store.saveSettings(userId, { voicePack: pack, voiceMode: 'mine' });
  return { voicePack: pack, used: used.length };
}

/** 사람이 직접 고친 말투 팩을 저장한다. version 은 올리지 않는다. */
async function patch(userId, body) {
  const settings = await store.getSettings(userId);
  const cur = settings.voicePack;
  if (!cur) {
    const e = new Error('말투 팩이 아직 없습니다. 먼저 분석해주세요.');
    e.code = 'NO_PACK';
    throw e;
  }
  const next = Object.assign({}, cur, body || {}, { version: cur.version });
  await store.saveSettings(userId, { voicePack: next });
  return next;
}

/**
 * 말투 팩을 지운다. 지우면 지침의 기본 말투로 돌아간다.
 * 고른 것도 같이 푼다 — 팩이 없는데 「내 말투」가 골라져 있으면
 * 화면에는 잠긴 줄이 선택된 것처럼 보인다.
 */
async function clear(userId) {
  await store.saveSettings(userId, { voicePack: null, voiceMode: '' });
}

function str(v) { return typeof v === 'string' ? v.trim() : ''; }
function num(v, d) { const n = Number(v); return Number.isFinite(n) ? n : d; }
function arr(v) {
  return Array.isArray(v) ? v.map((x) => String(x == null ? '' : x).trim()).filter(Boolean) : [];
}
function obj(v) {
  if (!v || typeof v !== 'object' || Array.isArray(v)) return {};
  const out = {};
  Object.keys(v).forEach((k) => {
    const n = Number(v[k]);
    if (Number.isFinite(n)) out[String(k).trim()] = Math.max(0, Math.min(10, n));
  });
  return out;
}

/**
 * 설정을 보고 「이번 글을 무슨 말투로 쓸지」 하나로 정한다.
 *
 *   voiceMode = 'mine'      → 내 글에서 뽑은 팩 (없으면 기본 말투)
 *   voiceMode = 프리셋 이름  → 그 프리셋
 *   비어 있으면              → 뽑아둔 팩이 있으면 그걸, 없으면 기본 말투
 *
 * 마지막 줄이 중요하다. 예전에 쓰던 사람들은 voiceMode 가 없다.
 * 그 사람들이 뽑아둔 말투가 조용히 꺼지면 안 된다.
 */
function resolve(settings) {
  const s = settings || {};
  const mode = String(s.voiceMode || '').trim();

  if (mode === 'mine') return s.voicePack || null;
  if (mode) {
    const p = require('./voices').byId(mode);
    if (p) return { preset: p.id };
  }
  return s.voicePack || null;
}

module.exports = { analyze, patch, clear, resolve, splitSamples, MIN_SAMPLES, MAX_SAMPLES };
