/**
 * bgPapers.js — 본문 배경지 정의
 *
 * 표지(cover)와 별개. 리포트 "본문 페이지"에 깔리는 종이 무늬.
 * 교육생이 하나 고르면(users.bg_paper) 모든 본문 페이지 배경이 그것으로 바뀐다.
 *
 * 기본 제공 배경지는 public/img/bg/ 또는 기존 /img/pdf/frame.jpg.
 */

// 기본 제공 배경지 (코드 내장)
const BUILTIN_PAPERS = [
  { key: 'frame',  name: '기본 (테두리)',      img: '/img/pdf/frame.jpg' },
  { key: 'hanji',  name: '한지 (은은한 결)',    img: '/img/bg/hanji-paper.jpg' },
  { key: 'maehwa', name: '매화지 (낡은 종이)',  img: '/img/bg/maehwa-paper.jpg' },
  { key: 'cream',  name: '크림 (부드러운)',     img: '/img/bg/cream-paper.jpg' },
  { key: 'line',   name: '심플 (얇은 선)',      img: '/img/bg/line-paper.jpg' },
  { key: 'white',  name: '백지 (깔끔한)',       img: '/img/bg/white-paper.jpg' },
];

/** 배경지 키 → 이미지 경로. 없거나 'none'이면 null(=배경 없음, 흰 종이) */
function paperImg(key) {
  if (!key || key === 'none') return null;
  const p = BUILTIN_PAPERS.find((x) => x.key === key);
  return p ? p.img : null;
}

function builtinPapers() {
  return BUILTIN_PAPERS.slice();
}

module.exports = { BUILTIN_PAPERS, paperImg, builtinPapers };
