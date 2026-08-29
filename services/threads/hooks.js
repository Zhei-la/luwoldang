/* ============================================================
 * services/threads/hooks.js — 후킹 26가지
 *
 * 지침에 적힌 후킹 목록이다. 이 목록이 곧 소재 재고다.
 * needsFacts 가 붙은 것은 실제 자료(수치·이벤트·소식)가 있어야 쓸 수 있다.
 * 자료 없이 쓰면 지어낸 글이 되므로 생성 단계에서 잠근다.
 * ============================================================ */

const HOOKS = [
  { id: 1,  name: '반드시' },
  { id: 2,  name: '솔직히' },
  { id: 3,  name: '~하면 큰일 남' },
  { id: 4,  name: '실제 금액이나 수치', needsFacts: true },
  { id: 5,  name: '요즘 핫한' },
  { id: 6,  name: '최근 유행하는' },
  { id: 7,  name: '진짜 고수들은' },
  { id: 8,  name: '비밀' },
  { id: 9,  name: '친해지면 좋은 N가지' },
  { id: 10, name: 'ㅇㅇ 보는 사람입니다' },
  { id: 11, name: '하트라도 부탁합니다' },
  { id: 12, name: 'A vs B' },
  { id: 13, name: '더블 바인드 심화' },
  { id: 14, name: 'N가지 정보 총정리' },
  { id: 15, name: '이벤트', needsFacts: true },
  { id: 16, name: '어때? 의견 묻기' },
  { id: 17, name: '신청이 무섭게 밀려든다', needsFacts: true },
  { id: 18, name: '하지 마세요' },
  { id: 19, name: '도와줘' },
  { id: 20, name: '데려가줘 / 닿게 해줘' },
  { id: 21, name: '나만 그래?' },
  { id: 22, name: '흔한 실수' },
  { id: 23, name: '축하해줘', needsFacts: true },
  { id: 24, name: '하소연' },
  { id: 25, name: '상담가랑' },
  { id: 26, name: '신기한 사주' },
];

function hookName(id) {
  const h = HOOKS.find((x) => x.id === Number(id));
  return h ? h.name : '#' + id;
}

module.exports = { HOOKS, hookName };
