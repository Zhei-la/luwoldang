/* ============================================================
 * services/threads/dailyshape.js — 오늘의 운세 틀 지키기
 *
 * 운세는 매일 나가는 글이라 **모양이 고정일수록 좋다.** 매일 오던 사람이
 * 어디를 봐야 할지 알아야 한다. 그래서 본인이 쓰던 글을 하나 받아두고
 * 날짜와 운세만 갈아끼운다.
 *
 * ⚠️ 그런데 「짜임새를 그대로 두세요」라고 적어두는 것만으로는 안 지켜진다.
 *    모델은 눈앞에 틀이 있어도 살을 붙인다 —
 *      틀:   🐑 양띠
 *      결과: 🐵 원숭이띠 — 오늘은 흐름이 자연스럽게 연결됩니다
 *    말투도 「~있음」에서 「~입니다」로 슬그머니 바뀐다.
 *
 * 그래서 틀을 **줄 단위로 뜯어** 프롬프트에 박아 넣고,
 * 나온 글이 그 모양인지 **기계로 확인**한다. 어긋나면 한 번 다시 시킨다.
 * ============================================================ */

const NL = String.fromCharCode(10);

/* 이모지로 시작하는 줄인지. 「🐑 양띠」처럼 앞에 붙여 쓰는 사람이 많다.
   Extended_Pictographic 이 없는 환경도 있어 흔한 대역만 본다. */
const LEAD_EMOJI = /^[\s]*(?:[←-⇿⌀-➿⬀-⯿️‍]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|\uD83E[\uDD00-\uDFFF])+/;

/** 한국어 종결 말투 — 「~있음」과 「~입니다」는 아주 다른 글로 보인다. */
function tone(text) {
  const t = String(text || '');
  const um = (t.match(/(음|함|됨|임)\s*$/gm) || []).length;
  const nida = (t.match(/(입니다|습니다|합니다|됩니다)\s*$/gm) || []).length;
  const yo = (t.match(/요\s*$/gm) || []).length;
  /* 딱 하나가 앞설 때만 말투를 단정한다.
     비슷하면 아무 말도 안 한다 — 어중간한 판정으로 멀쩡한 글을
     다시 시키면 요금만 나간다. 못 미더울 땐 안 잡는 편이 낫다. */
  const top = Math.max(um, nida, yo);
  if (!top) return '';
  if (um === top && nida < top && yo < top) return '음슴체';
  if (nida === top && um < top && yo < top) return '합니다체';
  if (yo === top && um < top && nida < top) return '해요체';
  return '';
}

/**
 * 틀 한 편을 줄 단위로 뜯는다.
 *
 * 반환 { lines, blanks, emoji, dash, longest, tone }
 *   lines   빈 줄까지 센 전체 줄 수
 *   emoji   이모지로 시작하는 줄 수
 *   dash    「A — B」처럼 한 줄에 이름과 설명을 같이 쓴 줄 수
 *   longest 가장 긴 줄의 글자 수 (설명을 붙였는지 가늠하는 값)
 */
function outline(text) {
  const raw = String(text == null ? '' : text).trim().split(NL);
  const filled = raw.filter((l) => l.trim());
  return {
    lines: raw.length,
    filled: filled.length,
    blanks: raw.length - filled.length,
    emoji: filled.filter((l) => LEAD_EMOJI.test(l)).length,
    dash: filled.filter((l) => /\s[—–-]\s/.test(l)).length,
    longest: filled.reduce((m, l) => Math.max(m, l.trim().length), 0),
    tone: tone(text),
  };
}

/* 간지 — 「계미일」·「을유일」처럼 적힌 자리를 찾는다 */
const STEMS = '갑을병정무기경신임계';
const BRANCHES = '자축인묘진사오미신유술해';
const GANJI_RE = new RegExp('[' + STEMS + '][' + BRANCHES + ']\\s*일');

/** 이 글에 일진이 적혀 있나 */
function hasGanji(text) { return GANJI_RE.test(String(text || '')); }

/** 앞뒤 빈 줄을 뺀 첫 줄 */
function firstLine(text) {
  const ls = String(text == null ? '' : text).trim().split(NL);
  return (ls[0] || '').trim();
}

/**
 * 틀을 **줄 번호가 붙은 차례표**로 바꾼다.
 *
 * ⚠️ 줄 수만 알려주면 순서가 바뀐다. 첫 줄이 후킹인데 모델이 거기에
 *    일진을 밀어넣어 「오늘은 을유일」로 시작한 적이 있다. 그렇게 시작하면
 *    아무도 안 읽는다 — 첫 줄은 걸어야 하는 자리다.
 *    몇 번째 줄이 무엇인지 하나씩 못 박아야 순서가 지켜진다.
 */
function skeleton(text, note) {
  /* 첫 줄에 붙일 주의. 틀마다 어긋나는 자리가 달라서 부르는 쪽이 정한다.
     운세는 「일진으로 바꾸지 마세요」, 인사글은 「이름·경력만 갈아끼우세요」. */
  const first = note || '걸어야 하는 자리입니다. 여기를 함부로 바꾸지 마세요';
  const raw = String(text == null ? '' : text).trim().split(NL);
  return raw.map((line, i) => {
    const t = line.trim();
    const n = (i + 1) + '줄';
    if (!t) return '  ' + n + ': (빈 줄)';
    if (LEAD_EMOJI.test(t)) {
      return '  ' + n + ': 이모지로 시작 — 「' + t + '」';
    }
    if (/\d+\s*월\s*\d+\s*일/.test(t)) {
      return '  ' + n + ': 날짜 줄 — 「' + t + '」 (날짜만 이 날 것으로 바꿉니다)';
    }
    if (hasGanji(t)) return '  ' + n + ': 일진 줄 — 「' + t + '」';
    if (i === 0) return '  ' + n + ': **후킹** — 「' + t + '」 (' + first + ')';
    return '  ' + n + ': 글 — 「' + t + '」';
  }).join(NL);
}

/**
 * 틀을 프롬프트에 넣을 「설계도」로 바꾼다.
 *
 * 모델에게 원문만 보여주면 「참고」로 읽는다. 줄 번호를 매겨
 * **몇 줄짜리 글인지, 어느 줄이 무엇인지** 못 박아야 지킨다.
 */
function blueprint(body) {
  const o = outline(body);
  const out = [
    '이 틀은 **빈 줄까지 합쳐 ' + o.lines + '줄**입니다. 줄 수를 맞추세요.',
  ];
  if (o.emoji) {
    out.push('이모지로 시작하는 줄이 ' + o.emoji + '개 있습니다. ' +
      '**그 개수 그대로**, 같은 자리에 둡니다.');
  }
  /* 여기가 제일 많이 어긋난다 — 이름만 있는 줄에 설명을 붙여버린다 */
  if (!o.dash && o.longest <= 22) {
    out.push('⚠️ 이 틀은 **한 줄에 한 가지만** 적습니다. ' +
      '가장 긴 줄이 ' + o.longest + '자입니다.');
    out.push('   「양띠 — 오늘은 …」처럼 설명을 덧붙이지 마세요. ' +
      '이름만 적던 자리에는 이름만 적습니다.');
  } else if (o.dash) {
    out.push('「이름 — 설명」꼴로 쓴 줄이 ' + o.dash + '개 있습니다. 그 꼴을 지키세요.');
  }
  if (o.tone) {
    out.push('말투는 **' + o.tone + '**입니다. ' +
      (o.tone === '음슴체'
        ? '「~있음」·「~함」으로 끝냅니다. 「~입니다」로 바꾸지 마세요.'
        : '끝맺음을 바꾸지 마세요.'));
  }
  /* ⚠️ 틀에 일진이 없는데 모델이 첫 줄에 넣어버린 적이 있다.
        없으면 없다고 못 박아야 안 넣는다. */
  if (!hasGanji(body)) {
    out.push('⚠️ 이 틀에는 **일진(계미일 같은 것)이 없습니다.** 넣지 마세요.');
  }
  return out;
}

/**
 * 나온 글이 틀대로인지 본다.
 *
 * 딱 맞기를 바라는 게 아니다. 날짜와 운세가 바뀌니 줄 길이는 달라진다.
 * **눈에 띄게 딴 글로 보이는 것**만 잡는다.
 *
 * 반환 { ok, why }  — why 는 다시 시킬 때 그대로 붙일 한 줄
 */
function check(templateBody, madeBody) {
  const a = outline(templateBody);
  const b = outline(madeBody);
  if (!a.filled) return { ok: true };

  /* 줄 수 — 절반이 되거나 갑절이 되면 딴 글이다 */
  const room = Math.max(2, Math.round(a.lines * 0.4));
  if (Math.abs(b.lines - a.lines) > room) {
    return {
      ok: false,
      why: '틀은 ' + a.lines + '줄인데 ' + b.lines + '줄로 나왔습니다. ' +
        '줄 수를 틀에 맞추세요.',
    };
  }
  /* 이모지 줄 개수 — 「띠 셋」이 「띠 다섯」이 되면 딴 글이다 */
  if (a.emoji && Math.abs(b.emoji - a.emoji) > 1) {
    return {
      ok: false,
      why: '틀은 이모지 줄이 ' + a.emoji + '개인데 ' + b.emoji + '개로 나왔습니다. ' +
        '개수를 맞추세요.',
    };
  }
  /* 이름만 적던 자리에 설명을 붙였다 — 가장 자주 어긋나는 곳 */
  if (!a.dash && b.dash > 1) {
    return {
      ok: false,
      why: '틀에는 없는 「이름 — 설명」꼴이 ' + b.dash + '줄 생겼습니다. ' +
        '이름만 적던 자리에는 이름만 적으세요.',
    };
  }
  if (a.longest <= 22 && b.longest > a.longest + 14) {
    return {
      ok: false,
      why: '틀은 가장 긴 줄이 ' + a.longest + '자인데 ' + b.longest + '자까지 늘어났습니다. ' +
        '설명을 덧붙이지 말고 틀만큼만 적으세요.',
    };
  }
  /* ⚠️ 첫 줄은 걸어야 하는 자리다.
        「일진을 그대로 쓰라」고 일러줬더니 모델이 **첫 줄을 일진으로 바꿔**
        「오늘은 을유일」로 시작한 적이 있다. 그렇게 시작하면 아무도 안 읽는다. */
  if (!hasGanji(firstLine(templateBody)) && hasGanji(firstLine(madeBody))) {
    return {
      ok: false,
      why: '첫 줄이 일진(「' + firstLine(madeBody) + '」)으로 바뀌었습니다. ' +
        '틀의 첫 줄은 후킹입니다 — 「' + firstLine(templateBody) + '」 자리입니다. ' +
        '일진으로 글을 시작하지 마세요.',
    };
  }
  /* 틀에 아예 없는 일진을 넣어버린 경우 */
  if (!hasGanji(templateBody) && hasGanji(madeBody)) {
    return {
      ok: false,
      why: '틀에 없는 일진이 들어갔습니다. 이 틀은 일진을 적지 않습니다.',
    };
  }

  /* 말투 */
  if (a.tone && b.tone && a.tone !== b.tone) {
    return {
      ok: false,
      why: '틀은 ' + a.tone + '인데 ' + b.tone + '로 나왔습니다. 말투를 그대로 두세요.',
    };
  }
  return { ok: true };
}

/**
 * 두 편짜리 틀인데 한 편만 왔는지.
 *
 * 「짧아도 두 편으로 나눠 올린다」가 이 계정의 모양인데,
 * 모델은 길이를 보고 멋대로 합친다.
 */
function needsTwo(daily) {
  const d = daily || {};
  return d.mode === 'chain' && !!String(d.tail || '').trim();
}

module.exports = { outline, blueprint, skeleton, check, needsTwo, tone, hasGanji, firstLine };
