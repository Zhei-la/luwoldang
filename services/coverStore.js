/**
 * coverStore.js — PDF 표지 저장·조회
 *
 * 표지 우선순위 (앞이 이긴다):
 *   1) 교육생 본인이 올린 낱개 표지 (teacher_covers)   ← 본인만, 특정 종류만
 *   2) 교육생이 고른 세트 (users.cover_set)            ← 8종 한 묶음
 *   3) 관리자 기본 표지 (cover_presets)                ← 전 교육생 공용
 *   4) 코드 기본값 (pdfDoc.js 의 COVERS)
 *
 * 이미지는 data URI 로 DB에 저장한다. (Railway 파일 휘발 방지)
 * 단, 기본 제공 세트는 public/img/covers/ 에 파일로 둔다 (배포에 포함).
 */

const { pool } = require('../db');
const { builtinCoverPath } = require('./coverSets');

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

  // 2) 교육생이 고른 세트 (users.cover_set)
  try {
    const u = await pool.query('SELECT cover_set FROM users WHERE id = $1', [teacherId]);
    const setKey = u.rows[0] && u.rows[0].cover_set;
    if (setKey) {
      // 2-a) 관리자가 만든 커스텀 세트 (DB)
      const custom = await pool.query(
        `SELECT img, style, brand_top FROM cover_set_items
         WHERE set_key = $1 AND type = $2 LIMIT 1`,
        [setKey, type]
      );
      if (custom.rows[0]) {
        const r = custom.rows[0];
        return { img: r.img, style: r.style || 'plain', brandTop: r.brand_top, source: 'set-custom' };
      }
      // 2-b) 코드 내장 기본 세트 (public 파일)
      const built = builtinCoverPath(setKey, type);
      if (built) return { img: built.img, style: built.style, source: 'set-builtin' };
    }
  } catch (e) { /* noop */ }

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
  // 세트
  chooseSet, myChosenSet,
  addCustomSet, addSetItem, listCustomSets, deleteCustomSet, getSetItemImg,
};

/* ── 교육생: 세트 선택 ── */

// 교육생이 세트를 고른다 (null = 세트 안 씀, 낱개/기본으로)
async function chooseSet(teacherId, setKey) {
  await pool.query('UPDATE users SET cover_set = $2 WHERE id = $1',
    [teacherId, setKey || null]);
}

async function myChosenSet(teacherId) {
  const { rows } = await pool.query('SELECT cover_set FROM users WHERE id = $1', [teacherId]);
  return rows[0] ? rows[0].cover_set : null;
}

/* ── 관리자: 커스텀 세트 ── */

async function addCustomSet(key, name) {
  if (!key || !name) throw new Error('세트 키와 이름이 필요합니다.');
  if (!/^[a-z0-9_-]+$/i.test(key)) throw new Error('세트 키는 영문·숫자만 됩니다.');
  await pool.query(
    `INSERT INTO cover_sets (set_key, name, builtin) VALUES ($1, $2, FALSE)
     ON CONFLICT (set_key) DO UPDATE SET name = $2`,
    [key, name]
  );
}

async function addSetItem(setKey, { type, img, style, brandTop }) {
  if (!setKey || !type || !img) throw new Error('세트·종류·이미지가 필요합니다.');
  if (img.length > MAX_BYTES) throw new Error('이미지가 너무 큽니다. 3MB 이하로.');
  if (!/^data:image\//.test(img)) throw new Error('이미지 파일만 됩니다.');
  // 세트 안에서 종류별 하나만 (교체)
  await pool.query('DELETE FROM cover_set_items WHERE set_key = $1 AND type = $2', [setKey, type]);
  await pool.query(
    `INSERT INTO cover_set_items (set_key, type, img, style, brand_top)
     VALUES ($1, $2, $3, $4, $5)`,
    [setKey, type, img, style || 'plain', brandTop == null ? 18.2 : brandTop]
  );
}

async function listCustomSets() {
  const { rows } = await pool.query(
    `SELECT s.set_key, s.name,
            (SELECT COUNT(*) FROM cover_set_items i WHERE i.set_key = s.set_key) AS cnt
     FROM cover_sets s WHERE s.builtin = FALSE ORDER BY s.created_at DESC`
  );
  return rows;
}

async function deleteCustomSet(setKey) {
  await pool.query('DELETE FROM cover_set_items WHERE set_key = $1', [setKey]);
  await pool.query('DELETE FROM cover_sets WHERE set_key = $1', [setKey]);
}

async function getSetItemImg(setKey, type) {
  const { rows } = await pool.query(
    'SELECT img FROM cover_set_items WHERE set_key = $1 AND type = $2 LIMIT 1', [setKey, type]);
  return rows[0] || null;
}
