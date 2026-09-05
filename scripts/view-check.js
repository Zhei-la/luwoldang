/* ============================================================
 * scripts/view-check.js — 화면 안의 자바스크립트 문법 검사
 *
 * ⚠️ 왜 필요한가
 *    EJS 는 **렌더만 되면 통과**다. 그 안에 들어 있는 <script> 가
 *    깨져 있어도 서버는 200 을 준다. 화면만 조용히 죽는다.
 *
 *    실제로 그렇게 놓쳤다. 문자열 안에 진짜 줄바꿈이 들어가
 *    「올라갈 글」 목록이 통째로 안 그려졌는데, 렌더 검사는 다 통과했다.
 *
 *    그래서 렌더한 다음 <script> 를 뽑아 문법만 따로 본다.
 *
 *   node scripts/view-check.js
 * ============================================================ */

const ejs = require('ejs');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const { MODELS, DEFAULT_MODEL } = require('../services/threads/llm');
const { PRESETS } = require('../services/threads/voices');
const { HOT, ALL } = require('../services/threads/topics');
const { HOOKS } = require('../services/threads/hooks');
const FORMS = require('../services/threads/forms');
const rules = require('../services/threads/rules');
const voice = require('../services/threads/voice');

/* 화면이 기대하는 값을 최소로 채운다. 값이 빠지면 렌더가 먼저 터진다. */
const data = {
  user: { id: 1, name: '점검' }, active: 'threads', hasKey: true,
  accounts: [], account: null, allowPublish: true,
  settings: { ctaLink: '', dailyLine: '', ctaPerWeek: 2, model: '' },
  models: MODELS, defaultModel: DEFAULT_MODEL,
  voicePack: null, voiceMin: voice.MIN_SAMPLES, voiceLines: voice.MIN_LINES,
  voicePresets: PRESETS, voiceMode: '',
  intro: { name: '', career: '', sample: '' },
  daily: { body: '', tail: '', mode: 'single' },
  formList: FORMS.FORMS, formMax: FORMS.MAX_PICK,
  dayNames: rules.DAY_NAMES, autoRules: [],
  linksThisWeek: 0, posts: [], trashCount: 0,
  hookTotal: HOOKS.length, hookUsed: 0,
  topics: ALL, hotTopics: HOT, dailyLimit: 20, usedToday: 0,
};

const VIEWS = [
  { file: 'views/dash/threads-auto.ejs', data },
];

let bad = 0;
for (const v of VIEWS) {
  const full = path.join(ROOT, v.file);
  let html;
  try {
    html = ejs.render(fs.readFileSync(full, 'utf8'), v.data, { filename: full });
  } catch (e) {
    bad++;
    console.error('✗ ' + v.file + ' — 렌더 실패: ' + e.message);
    continue;
  }

  const blocks = [...html.matchAll(/<script(?![^>]*\ssrc=)[^>]*>([\s\S]*?)<\/script>/g)]
    .map((m) => m[1])
    .filter((b) => b.trim().length > 40);

  let broken = 0;
  blocks.forEach((b, i) => {
    try {
      /* new Function 은 파싱만 한다. 실행하지 않으므로 안전하다. */
      new Function(b);   // eslint-disable-line no-new-func
    } catch (e) {
      broken++;
      console.error('✗ ' + v.file + ' — ' + (i + 1) + '번째 <script> 문법 오류');
      console.error('    ' + e.message);
      /* 어디쯤인지 알려준다. 줄 번호가 없으면 못 찾는다. */
      const line = String(e.stack || '').match(/<anonymous>:(\d+)/);
      if (line) {
        const src = b.split('\n');
        const n = Number(line[1]) - 2;
        for (let j = Math.max(0, n - 2); j < Math.min(src.length, n + 2); j++) {
          console.error('    ' + (j + 1) + ': ' + src[j]);
        }
      }
    }
  });
  if (!broken) console.log('✓ ' + v.file + ' — <script> ' + blocks.length + '개 문법 OK');
  bad += broken;
}

console.log(bad ? '\n✗ 화면 스크립트 ' + bad + '개 깨짐' : '\n✓ 화면 스크립트 이상 없음');
process.exit(bad ? 1 : 0);
