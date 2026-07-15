/**
 * coverStore.js — PDF 표지 저장·조회
 *
 * 표지 우선순위 (앞이 이긴다):
 *   1) 교육생 본인이 올린 표지 (teacher_covers)   ← 본인만
 *   2) 관리자가 올린 기본 표지 (cover_presets)     ← 전 교육생 공용
 *   3) 코드 기본값 (pdfDoc.js 의 COVERS)           ← coverStore 는 관여 안 함
 *
 * 이미지는 data URI 로 DB에 저장한다.
 * (Railway는 컨테이너 재배포 때 디스크가 초기화되므로 파일로 두면 사라진다)
 */

const { pool } = require('../db');

const MAX_BYTES = 3 * 1024 * 1024;   // data URI 기준 약 3MB

/** 이 리포트 종류에 쓸 표지를 고른다. 없으면 null (→ pdfDoc 기본값 사용) */
async function pickCover(teacherId, type) {
  // 1) 내 표지
  try {
    const mine = await pool.query(
      `SELECT img, style, brand_top FROM teacher_covers
       WHERE teacher_id = $1 AND type = $2
       ORDER BY created_at DESC LIMIT 1`,
      [teacherId, type]
    );
    if (mine.rows[0]) {
      const r = mine.rows[0];
      return { img: r.img, style: r.style || 'circle', brandTop: r.brand_top, source: 'mine' };
    }
  } catch (e) { /* 테이블이 아직 없을 수 있음 (첫 배포) */ }

  // 2) 관리자 기본 표지
  try {
    const preset = await pool.query(
      `SELECT img, style, brand_top FROM cover_presets
       WHERE type = $1 AND active
       ORDER BY sort ASC, created_at DESC LIMIT 1`,
      [type]
    );
    if (preset.rows[0]) {
      const r = preset.rows[0];
      return { img: r.img, style: r.style || 'circle', brandTop: r.brand_top, source: 'preset' };
    }
  } catch (e) { /* noop */ }

  return null;   // → pdfDoc.js 의 COVERS 기본값으로
}

/** 리포트 만들기 전에 표지를 미리 조회해서 buildReportHtml 에 넘긴다 */
async function resolveCover(teacherId, type) {
  try {
    return await pickCover(teacherId, type);
  } catch (e) {
    console.error('[COVER] 조회 실패:', e.message);
    return null;
  }
}

/* ── 교육생: 내 표지 ── */

async function saveMyCover(teacherId, { type, img, style, brandTop }) {
  if (!type || !img) throw new Error('종류와 이미지가 필요합니다.');
  if (img.length > MAX_BYTES) throw new Error('이미지가 너무 큽니다. 3MB 이하로 올려주세요.');
  if (!/^data:image\//.test(img)) throw new Error('이미지 파일만 올릴 수 있습니다.');

  // 종류별로 최신 하나만 남긴다 (기존 것 지우고 새로 넣기)
  await pool.query('DELETE FROM teacher_covers WHERE teacher_id = $1 AND type = $2', [teacherId, type]);
  await pool.query(
    `INSERT INTO teacher_covers (teacher_id, type, img, style, brand_top)
     VALUES ($1, $2, $3, $4, $5)`,
    [teacherId, type, img, style || 'circle', brandTop == null ? 18.2 : brandTop]
  );
}

async function deleteMyCover(teacherId, type) {
  await pool.query('DELETE FROM teacher_covers WHERE teacher_id = $1 AND type = $2', [teacherId, type]);
}

async function listMyCovers(teacherId) {
  const { rows } = await pool.query(
    'SELECT type, style, brand_top, created_at FROM teacher_covers WHERE teacher_id = $1',
    [teacherId]
  );
  const map = {};
  rows.forEach((r) => { map[r.type] = r; });
  return map;   // { 종합사주: {...}, 연애운: {...} }
}

/* ── 관리자: 기본 표지 ── */

async function addPreset({ type, name, img, style, brandTop }) {
  if (!type || !img) throw new Error('종류와 이미지가 필요합니다.');
  if (img.length > MAX_BYTES) throw new Error('이미지가 너무 큽니다. 3MB 이하로 올려주세요.');
  if (!/^data:image\//.test(img)) throw new Error('이미지 파일만 올릴 수 있습니다.');

  await pool.query(
    `INSERT INTO cover_presets (type, name, img, style, brand_top)
     VALUES ($1, $2, $3, $4, $5)`,
    [type, name || '', img, style || 'circle', brandTop == null ? 18.2 : brandTop]
  );
}

async function deletePreset(id) {
  await pool.query('DELETE FROM cover_presets WHERE id = $1', [id]);
}

async function listPresets() {
  const { rows } = await pool.query(
    `SELECT id, type, name, style, brand_top, active, created_at
     FROM cover_presets ORDER BY type, sort, created_at DESC`
  );
  return rows;   // 목록엔 무거운 img 를 안 싣는다 (화면 로딩 빠르게)
}

async function getPresetImg(id) {
  const { rows } = await pool.query('SELECT img, type FROM cover_presets WHERE id = $1', [id]);
  return rows[0] || null;
}

module.exports = {
  resolveCover,
  saveMyCover, deleteMyCover, listMyCovers,
  addPreset, deletePreset, listPresets, getPresetImg,
};
