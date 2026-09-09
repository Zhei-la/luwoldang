/* ============================================================
 * services/threads/llm-claude.js — 글 만들기 (내 PC 의 Claude Code)
 *
 * OpenAI 대신 **내 컴퓨터에 깔린 Claude Code** 로 글을 쓴다.
 * 이미 Claude 를 쓰고 있는데 API 요금을 또 내는 게 아까워서 만들었다.
 *
 *   프롬프트 → (파이프) → claude -p → JSON
 *
 * API 열쇠가 필요 없다. 이미 로그인한 Claude Code 를 그대로 쓴다.
 * 그래서 **이건 서버에서 안 돈다.** 내 PC 에서 도는 로컬 자동화 전용이다.
 *   scripts/threads-local.js 가 이걸 쓴다.
 *
 * ⚠️ 프롬프트가 4만 자쯤 된다. 명령줄 인자로 넘기면 윈도우가 자른다.
 *    **반드시 표준입력(stdin)으로 흘려보낸다.**
 * ============================================================ */

const { spawn } = require('child_process');

/* 한 편에 30초 안팎. 다시 시키는 것까지 생각해 넉넉히 잡는다. */
const TIMEOUT_MS = Number(process.env.THREADS_CLAUDE_TIMEOUT_MS || 300000);

/* 윈도우에서는 claude.cmd 라 셸을 거쳐야 찾는다. */
const CMD = process.env.THREADS_CLAUDE_CMD || 'claude';

/**
 * Claude Code 를 한 번 부른다.
 *
 * 반환은 llm.js 의 runAi 와 **같은 모양**이다 — { text, usage }.
 * 그래야 파이프라인이 어느 쪽을 쓰는지 몰라도 된다.
 */
function ask(prompt, opts) {
  const o = opts || {};
  return new Promise((resolve, reject) => {
    /* 모델을 집어주면 그대로 쓴다. 안 집으면 Claude Code 기본값.
       ⚠️ 셸을 거치므로 이름에 이상한 글자가 있으면 안 된다.
          모델 이름은 영문·숫자·점·붙임표뿐이다. 그 밖은 버린다. */
    const model = String(o.model || '').trim();
    const safeModel = /^[A-Za-z0-9._-]+$/.test(model) ? model : '';
    /* ⚠️ 인자를 배열로 주면서 shell:true 를 켜면 노드가 경고를 낸다.
          한 줄짜리 명령으로 넘긴다. */
    const line = CMD + ' -p' + (safeModel ? ' --model ' + safeModel : '');

    let child;
    try {
      child = spawn(line, {
        shell: true,             // 윈도우의 claude.cmd 를 찾으려면 필요하다
        windowsHide: true,
        env: process.env,
      });
    } catch (e) {
      const err = new Error('Claude Code 를 실행하지 못했습니다: ' + e.message);
      err.code = 'NO_CLAUDE';
      return reject(err);
    }

    let out = '';
    let errOut = '';
    let done = false;

    const timer = setTimeout(() => {
      if (done) return;
      done = true;
      try { child.kill(); } catch (e) { /* 이미 죽었으면 그만 */ }
      const err = new Error('Claude Code 가 제때 답하지 않았습니다 (' +
        Math.round(TIMEOUT_MS / 1000) + '초). 다시 해보세요.');
      err.code = 'TIMEOUT';
      reject(err);
    }, TIMEOUT_MS);

    child.stdout.on('data', (b) => { out += b.toString('utf8'); });
    child.stderr.on('data', (b) => { errOut += b.toString('utf8'); });

    child.on('error', (e) => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      const err = new Error('Claude Code 를 실행하지 못했습니다: ' + e.message +
        '  (「claude --version」 이 되는지 확인해주세요)');
      err.code = 'NO_CLAUDE';
      reject(err);
    });

    child.on('close', (code) => {
      if (done) return;
      done = true;
      clearTimeout(timer);

      if (code !== 0 || !out.trim()) {
        const why = (errOut || out || '').trim().slice(0, 300);
        const err = new Error('Claude Code 가 글을 주지 않았습니다' +
          (why ? ' — ' + why : ' (빈 응답)'));
        err.code = 'EMPTY';
        return reject(err);
      }
      /* 요금이 안 나가므로 쓴 양은 셀 것이 없다. 모양만 맞춰 돌려준다. */
      resolve({ text: out, usage: { engine: 'claude' } });
    });

    /* ⚠️ 프롬프트는 stdin 으로. 인자로 넘기면 윈도우가 잘라버린다. */
    child.stdin.on('error', () => { /* 먼저 닫혔으면 close 에서 잡는다 */ });
    child.stdin.end(prompt, 'utf8');
  });
}

/**
 * llm.js 의 runAi 와 같은 자리에 끼울 수 있는 함수.
 * 첫 인자(열쇠)는 안 쓴다 — 자리만 맞춰 둔다.
 */
async function runAi(_apiKey, prompt, opts) {
  return ask(prompt, opts);
}

/** 이 PC 에서 Claude Code 를 쓸 수 있나 */
async function check() {
  try {
    const r = await ask('아래 JSON 하나만 출력하세요. 설명 금지.\n{"ok":true}',
      { });
    return { ok: /"ok"\s*:\s*true/.test(r.text), message: 'Claude Code 가 답했습니다.' };
  } catch (e) {
    return { ok: false, message: e.message };
  }
}

module.exports = { runAi, ask, check, TIMEOUT_MS };
