-- 중복 시나리오 제거: 같은 title 중 가장 오래된 것만 유지
DELETE FROM scenarios
WHERE id NOT IN (
  SELECT DISTINCT ON (title) id
  FROM scenarios
  ORDER BY title, created_at ASC
);

-- title에 UNIQUE 제약 추가
ALTER TABLE scenarios ADD CONSTRAINT scenarios_title_unique UNIQUE (title);
