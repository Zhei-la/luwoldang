/* ============================================================
 * bizInfo.js — 사업자 정보
 *
 * 전자상거래법 제10조에 따라, 통신판매를 하는 사이트는
 * 상호·대표자·사업자등록번호·통신판매업 신고번호·주소·연락처를
 * 손님이 쉽게 볼 수 있는 곳에 적어야 한다.
 *
 * 값은 코드에 박지 않고 환경변수로 둔다.
 *   · 사업자 정보가 바뀌어도 코드를 안 고쳐도 된다
 *   · 저장소에 사업장 주소·전화번호가 남지 않는다
 *
 * .env / Railway 변수
 *   BIZ_NAME             상호            예) 루월당
 *   BIZ_OWNER            대표자          예) 김가영
 *   BIZ_REG_NO           사업자등록번호   예) 123-45-67890
 *   BIZ_MAIL_ORDER_NO    통신판매업 신고번호
 *   BIZ_ADDRESS          사업장 주소
 *   BIZ_TEL              전화번호
 *   BIZ_EMAIL            이메일
 *   BIZ_PRIVACY_OFFICER  개인정보 보호책임자 (없으면 대표자로 본다)
 *
 * ⚠️ 하나도 안 채우면 화면에 아무것도 안 나온다.
 *    거짓 정보를 채워 넣느니 비워 두는 편이 낫다.
 * ============================================================ */

const V = (k) => {
  const s = String(process.env[k] || '').trim();
  return s || null;
};

/**
 * 화면에 뿌릴 사업자 정보.
 * 채워진 것만 rows 에 담아 돌려준다. 하나도 없으면 has=false.
 */
function bizInfo() {
  const name = V('BIZ_NAME');
  const owner = V('BIZ_OWNER');

  const rows = [];
  const add = (label, value) => { if (value) rows.push({ label, value }); };

  add('상호', name);
  add('대표자', owner);
  add('사업자등록번호', V('BIZ_REG_NO'));
  add('통신판매업 신고번호', V('BIZ_MAIL_ORDER_NO'));
  add('주소', V('BIZ_ADDRESS'));
  add('전화', V('BIZ_TEL'));
  add('이메일', V('BIZ_EMAIL'));
  add('개인정보 보호책임자', V('BIZ_PRIVACY_OFFICER') || owner);

  return { has: rows.length > 0, rows, name, owner };
}

module.exports = { bizInfo };
