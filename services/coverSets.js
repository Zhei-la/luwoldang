/**
 * coverSets.js — 기본 표지 세트 정의
 *
 * 세트 하나 = 8종 리포트 표지 한 묶음.
 * 이미지는 public/img/covers/<세트키>/<종류영문>.jpg 에 있다.
 *
 * 교육생이 세트를 고르면(users.cover_set), 8종 표지가 그 세트로 통일된다.
 * 관리자가 세트를 추가하면(cover_set_custom) 여기에 합쳐진다.
 */

// 종류 → 영문 파일명
const KIND_EN = {
  '종합사주': 'jonghap',
  '신년운세': 'sinnyeon',
  '무료사주': 'free',
  '연인궁합': 'gunghap',
  '연애운': 'yeonae',
  '결혼운': 'gyeolhon',
  '재물운': 'jaemul',
  '건강운': 'geongang',
};

// 기본 제공 세트 (코드 내장, 이미지는 public 에)
const BUILTIN_SETS = [
  {
    key: 'original',
    name: '기본 (원래 디자인)',
    style: null,                          // 원래 표지는 각자 style(ink/circle) 이 다름 → 특수 처리
    kinds: ['종합사주','신년운세','연애운','결혼운','연인궁합','재물운','건강운','무료사주'],
    original: true,                       // 원래 COVERS 를 그대로 쓰라는 표시
  },
  {
    key: 'hanji',
    name: '한지 · 원형',
    style: 'plain',                       // 표지에 이미 종류 글자가 있음
    brandPos: 'top',                      // 상호명: 위쪽 가로
    kinds: ['종합사주','신년운세','무료사주','연인궁합','연애운','결혼운','건강운'], // 재물운 없음
  },
  {
    key: 'maehwa',
    name: '매화 · 낡은 종이',
    style: 'plain',
    brandPos: 'left',                     // 상호명: 왼쪽 세로
    kinds: ['종합사주','신년운세','무료사주','연인궁합','연애운','결혼운','재물운','건강운'],
  },
  {
    key: 'sumuk',
    name: '수묵 · 까치',
    style: 'plain',
    brandPos: 'left',                     // 상호명: 왼쪽 세로
    kinds: ['종합사주','신년운세','무료사주','연인궁합','연애운','결혼운','재물운','건강운'],
  },
  {
    key: 'horang',
    name: '민화 · 호랑이',
    style: 'plain',
    brandPos: 'left',                     // 상호명: 왼쪽 세로
    kinds: ['종합사주','신년운세','무료사주','연인궁합','연애운','결혼운','재물운','건강운'],
  },
];

// 원래 디자인(COVERS)의 파일명·스타일
const ORIGINAL = {
  '종합사주':  { img: '/img/pdf/cover-jonghap.jpg',  style: 'ink',    brandTop: 6.5 },
  '신년운세':  { img: '/img/pdf/cover-sinnyeon.jpg', style: 'ink',    brandTop: 6.5 },
  '연애운':    { img: '/img/pdf/cover-yeonae.jpg',   style: 'circle', brandTop: 18.2 },
  '결혼운':    { img: '/img/pdf/cover-gyeolhon.jpg', style: 'circle', brandTop: 18.2 },
  '연인궁합':  { img: '/img/pdf/cover-gunghap.jpg',  style: 'circle', brandTop: 18.2 },
  '재물운':    { img: '/img/pdf/cover-jaemul.jpg',   style: 'circle', brandTop: 18.2 },
  '건강운':    { img: '/img/pdf/cover-geongang.jpg', style: 'circle', brandTop: 18.2 },
  '무료사주':  { img: '/img/pdf/cover-free.jpg',     style: 'circle', brandTop: 18.2 },
};

/** 세트+종류 → 이미지 경로 (없으면 null) */
function builtinCoverPath(setKey, type) {
  const set = BUILTIN_SETS.find((s) => s.key === setKey);
  if (!set) return null;
  if (set.kinds.indexOf(type) < 0) return null;   // 이 세트엔 이 종류가 없음
  // 원래 디자인 세트는 기존 COVERS 경로/스타일 그대로
  if (set.original) {
    const o = ORIGINAL[type];
    return o ? { img: o.img, style: o.style, brandTop: o.brandTop } : null;
  }
  const en = KIN_EN_SAFE(type);
  if (!en) return null;
  return { img: `/img/covers/${setKey}/${en}.jpg`, style: set.style, brandPos: set.brandPos || 'top' };
}

function KIN_EN_SAFE(type) { return KIND_EN[type]; }

function builtinSets() {
  return BUILTIN_SETS.map((s) => ({ key: s.key, name: s.name, kinds: s.kinds }));
}

module.exports = { BUILTIN_SETS, KIND_EN, builtinCoverPath, builtinSets };
