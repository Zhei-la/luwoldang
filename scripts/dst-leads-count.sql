-- ============================================================
-- 서머타임 시기 출생 신청자 세기   ※ 조회만 합니다. 아무것도 바꾸지 않습니다.
--
-- 왜 세나
--   calcSaju 에서 서머타임(시계가 표준시보다 1시간 앞섰던 때)을 켜면서,
--   아래 구간에 태어난 분은 시주가 예전 계산과 달라질 수 있다.
--   이미 리포트를 보낸 분이 있으면 알고 있어야 한다.
--
-- 쓰는 법
--   Railway → Postgres → Data(Query) 에 붙여넣고, 쿼리를 하나씩 골라 실행한다.
--   ① 연도 기준      — 1948~1960년, 1987~1988년 출생 (요청한 기준)
--   ② 실제 해당자    — 태어난 시각이 서머타임 구간 안인 사람 (시주가 실제로 바뀔 수 있는 사람)
--   ③ 명단           — ② 에 걸린 사람과 음력이라 직접 봐야 하는 사람 (필요할 때만)
--
-- 읽는 방식은 앱과 같다 (services/birth.js 의 normalizeBirth · parseHour)
--   생년월일  1990-01-29 · 1990.1.29 · 19900129 · 1990년 1월 29일 → 숫자 세 덩이로 읽는다
--   시각      '14:00' 그대로 / '사시 巳 09:30~11:29' 같은 구간은 가운데 시각 / '모름'·'선택 안함' 은 시각 없음
-- 서머타임 구간은 services/manseryeok.js 의 DST_PERIODS 와 같다 (당시 벽시계 기준 [시작, 끝)).
--
-- ⚠️ 음력·윤달 생일은 SQL 로 양력 변환을 못 한다. ② 에서 따로 세어 두니 사람이 확인한다.
-- ⚠️ 시각을 모르는 분은 시주를 쓰지 않으므로 바뀌지 않는다.
-- ⚠️ 개인정보를 가린(masked) 신청자는 생년월일을 못 읽어 빠질 수 있다.
-- ============================================================


-- ① 연도 기준 ------------------------------------------------------------
SELECT
  count(*)                                                                      AS 전체_신청자,
  count(*) FILTER (WHERE y  BETWEEN 1948 AND 1960 OR y  BETWEEN 1987 AND 1988)  AS 본인_해당연도,
  count(*) FILTER (WHERE y  BETWEEN 1948 AND 1960)                              AS 본인_1948_1960,
  count(*) FILTER (WHERE y  BETWEEN 1987 AND 1988)                              AS 본인_1987_1988,
  count(*) FILTER (WHERE py BETWEEN 1948 AND 1960 OR py BETWEEN 1987 AND 1988)  AS 궁합상대_해당연도
FROM (
  SELECT (regexp_match(birth,         '(\d{4})'))[1]::int AS y,
         (regexp_match(partner_birth, '(\d{4})'))[1]::int AS py
  FROM leads
) s;


-- ② 실제 해당자 (본인 · 궁합상대 따로) -----------------------------------
WITH dst(시작, 끝) AS (VALUES
  ('1948-06-01 00:00', '1948-09-13 00:00'),
  ('1949-04-03 00:00', '1949-09-11 00:00'),
  ('1950-04-01 00:00', '1950-09-10 00:00'),
  ('1951-05-06 00:00', '1951-09-09 00:00'),
  ('1955-05-05 00:00', '1955-09-09 00:00'),
  ('1956-05-20 00:00', '1956-09-30 00:00'),
  ('1957-05-05 00:00', '1957-09-22 00:00'),
  ('1958-05-04 00:00', '1958-09-21 00:00'),
  ('1959-05-03 00:00', '1959-09-20 00:00'),
  ('1960-05-01 00:00', '1960-09-18 00:00'),
  ('1987-05-10 02:00', '1987-10-11 03:00'),
  ('1988-05-08 02:00', '1988-10-09 03:00')
),
사람 AS (
  SELECT l.id, '본인' AS 누구, l.birth AS b, l.hour AS h, l.calendar AS cal, l.delivered_at FROM leads l
  UNION ALL
  SELECT l.id, '궁합상대', l.partner_birth, l.partner_hour, l.partner_calendar, l.delivered_at FROM leads l
   WHERE l.partner_birth IS NOT NULL AND l.partner_birth <> ''
),
읽기 AS (
  SELECT p.*,
         regexp_match(p.b, '(\d{4})\D*(\d{1,2})\D*(\d{1,2})') AS dm,
         CASE WHEN p.h IS NULL OR p.h ~ '모름|선택 안함' THEN NULL
              ELSE regexp_match(p.h, '(\d{1,2}):(\d{2})\s*[~-]\s*(\d{1,2}):(\d{2})') END AS rm,
         CASE WHEN p.h IS NULL OR p.h ~ '모름|선택 안함' THEN NULL
              ELSE regexp_match(p.h, '(\d{1,2}):(\d{2})') END AS tm,
         COALESCE(p.cal, '') ~ '음력|윤달' AS 음력,
         (p.delivered_at IS NOT NULL
           OR EXISTS (SELECT 1 FROM pdfs x WHERE x.lead_id = p.id AND x.mail_sent)) AS 리포트_전달
  FROM 사람 p
),
분 AS (
  SELECT r.*,
         (r.dm[1])::int AS y,
         CASE
           WHEN r.rm IS NOT NULL THEN
             (round((
               (r.rm[1]::int * 60 + r.rm[2]::int)
               + CASE WHEN r.rm[3]::int * 60 + r.rm[4]::int < r.rm[1]::int * 60 + r.rm[2]::int
                      THEN r.rm[3]::int * 60 + r.rm[4]::int + 1440
                      ELSE r.rm[3]::int * 60 + r.rm[4]::int END
             ) / 2.0))::int % 1440
           WHEN r.tm IS NOT NULL THEN r.tm[1]::int * 60 + r.tm[2]::int
         END AS m
  FROM 읽기 r
),
판정 AS (
  SELECT q.*,
         (q.y BETWEEN 1948 AND 1960 OR q.y BETWEEN 1987 AND 1988) AS 해당연도,
         CASE WHEN q.dm IS NOT NULL AND q.m IS NOT NULL THEN
           lpad(q.dm[1], 4, '0') || '-' || lpad(q.dm[2], 2, '0') || '-' || lpad(q.dm[3], 2, '0') || ' ' ||
           lpad((q.m / 60)::text, 2, '0') || ':' || lpad((q.m % 60)::text, 2, '0')
         END AS 벽시계
  FROM 분 q
)
SELECT
  누구,
  count(*) FILTER (WHERE 해당연도)                                             AS 해당연도_전체,
  count(*) FILTER (WHERE NOT 음력 AND EXISTS (SELECT 1 FROM dst WHERE 벽시계 >= dst.시작 AND 벽시계 < dst.끝))
                                                                               AS 서머타임_시각_해당,
  count(*) FILTER (WHERE NOT 음력 AND 리포트_전달 AND EXISTS (SELECT 1 FROM dst WHERE 벽시계 >= dst.시작 AND 벽시계 < dst.끝))
                                                                               AS 그중_리포트_전달,
  count(*) FILTER (WHERE 음력 AND 해당연도 AND m IS NOT NULL)                   AS 음력이라_직접확인,
  count(*) FILTER (WHERE 해당연도 AND m IS NULL)                                AS 해당연도_시각모름_변화없음
FROM 판정
GROUP BY 누구
ORDER BY 누구;


-- ③ 명단 (필요할 때만) — ② 에 걸린 사람 + 음력이라 직접 봐야 하는 사람 ----
WITH dst(시작, 끝) AS (VALUES
  ('1948-06-01 00:00', '1948-09-13 00:00'),
  ('1949-04-03 00:00', '1949-09-11 00:00'),
  ('1950-04-01 00:00', '1950-09-10 00:00'),
  ('1951-05-06 00:00', '1951-09-09 00:00'),
  ('1955-05-05 00:00', '1955-09-09 00:00'),
  ('1956-05-20 00:00', '1956-09-30 00:00'),
  ('1957-05-05 00:00', '1957-09-22 00:00'),
  ('1958-05-04 00:00', '1958-09-21 00:00'),
  ('1959-05-03 00:00', '1959-09-20 00:00'),
  ('1960-05-01 00:00', '1960-09-18 00:00'),
  ('1987-05-10 02:00', '1987-10-11 03:00'),
  ('1988-05-08 02:00', '1988-10-09 03:00')
),
사람 AS (
  SELECT l.id, l.teacher_id, l.name, l.source, l.created_at, '본인' AS 누구, l.birth AS b, l.hour AS h, l.calendar AS cal, l.delivered_at FROM leads l
  UNION ALL
  SELECT l.id, l.teacher_id, l.name, l.source, l.created_at, '궁합상대', l.partner_birth, l.partner_hour, l.partner_calendar, l.delivered_at FROM leads l
   WHERE l.partner_birth IS NOT NULL AND l.partner_birth <> ''
),
읽기 AS (
  SELECT p.*,
         regexp_match(p.b, '(\d{4})\D*(\d{1,2})\D*(\d{1,2})') AS dm,
         CASE WHEN p.h IS NULL OR p.h ~ '모름|선택 안함' THEN NULL
              ELSE regexp_match(p.h, '(\d{1,2}):(\d{2})\s*[~-]\s*(\d{1,2}):(\d{2})') END AS rm,
         CASE WHEN p.h IS NULL OR p.h ~ '모름|선택 안함' THEN NULL
              ELSE regexp_match(p.h, '(\d{1,2}):(\d{2})') END AS tm,
         COALESCE(p.cal, '') ~ '음력|윤달' AS 음력,
         (p.delivered_at IS NOT NULL
           OR EXISTS (SELECT 1 FROM pdfs x WHERE x.lead_id = p.id AND x.mail_sent)) AS 리포트_전달
  FROM 사람 p
),
분 AS (
  SELECT r.*,
         (r.dm[1])::int AS y,
         CASE
           WHEN r.rm IS NOT NULL THEN
             (round((
               (r.rm[1]::int * 60 + r.rm[2]::int)
               + CASE WHEN r.rm[3]::int * 60 + r.rm[4]::int < r.rm[1]::int * 60 + r.rm[2]::int
                      THEN r.rm[3]::int * 60 + r.rm[4]::int + 1440
                      ELSE r.rm[3]::int * 60 + r.rm[4]::int END
             ) / 2.0))::int % 1440
           WHEN r.tm IS NOT NULL THEN r.tm[1]::int * 60 + r.tm[2]::int
         END AS m
  FROM 읽기 r
),
판정 AS (
  SELECT q.*,
         (q.y BETWEEN 1948 AND 1960 OR q.y BETWEEN 1987 AND 1988) AS 해당연도,
         CASE WHEN q.dm IS NOT NULL AND q.m IS NOT NULL THEN
           lpad(q.dm[1], 4, '0') || '-' || lpad(q.dm[2], 2, '0') || '-' || lpad(q.dm[3], 2, '0') || ' ' ||
           lpad((q.m / 60)::text, 2, '0') || ':' || lpad((q.m % 60)::text, 2, '0')
         END AS 벽시계
  FROM 분 q
)
SELECT
  f.id                AS 신청번호,
  u.name              AS 교육생,
  f.누구,
  f.name              AS 신청자,
  f.b                 AS 생년월일,
  f.h                 AS 시각,
  f.cal               AS 달력,
  f.source            AS 경로,
  f.리포트_전달,
  CASE WHEN f.음력 THEN '음력 — 양력으로 바꿔 직접 확인' ELSE '서머타임 시각 해당' END AS 구분,
  f.created_at        AS 신청일
FROM 판정 f
LEFT JOIN users u ON u.id = f.teacher_id
WHERE (NOT f.음력 AND EXISTS (SELECT 1 FROM dst WHERE f.벽시계 >= dst.시작 AND f.벽시계 < dst.끝))
   OR (f.음력 AND f.해당연도 AND f.m IS NOT NULL)
ORDER BY f.리포트_전달 DESC, f.created_at DESC;
