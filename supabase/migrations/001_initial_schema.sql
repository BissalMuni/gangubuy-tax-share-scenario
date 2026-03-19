-- 시나리오 테이블
CREATE TABLE scenarios (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text NOT NULL,
  status      text DEFAULT 'draft' CHECK (status IN ('draft', 'revision', 'production', 'complete')),
  law_basis   text,
  effective_date date,
  video_duration integer,
  script_content text,
  scene_data  jsonb,
  pdf_path    text,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

-- 트리 분류 체계
CREATE TABLE trees (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        text UNIQUE NOT NULL,
  name        text NOT NULL,
  description text,
  created_at  timestamptz DEFAULT now()
);

-- 트리 노드
CREATE TABLE tree_nodes (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tree_id     uuid REFERENCES trees(id) ON DELETE CASCADE,
  parent_id   uuid REFERENCES tree_nodes(id) ON DELETE CASCADE,
  label       text NOT NULL,
  sort_order  integer DEFAULT 0,
  scenario_id uuid REFERENCES scenarios(id) ON DELETE SET NULL,
  depth       integer DEFAULT 0,
  created_at  timestamptz DEFAULT now()
);

-- 수정 이력
CREATE TABLE scenario_revisions (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scenario_id uuid REFERENCES scenarios(id) ON DELETE CASCADE,
  field       text NOT NULL,
  old_value   text,
  new_value   text,
  created_at  timestamptz DEFAULT now()
);

-- 콘티 (스토리보드)
CREATE TABLE storyboards (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scenario_id   uuid REFERENCES scenarios(id) ON DELETE CASCADE,
  uploader_name text NOT NULL,
  file_path     text NOT NULL,
  file_type     text NOT NULL CHECK (file_type IN ('image', 'pdf')),
  description   text,
  created_at    timestamptz DEFAULT now()
);

-- 인덱스
CREATE INDEX idx_tree_nodes_tree_id ON tree_nodes(tree_id);
CREATE INDEX idx_tree_nodes_parent_id ON tree_nodes(parent_id);
CREATE INDEX idx_tree_nodes_scenario_id ON tree_nodes(scenario_id);
CREATE INDEX idx_scenarios_status ON scenarios(status);
CREATE INDEX idx_storyboards_scenario_id ON storyboards(scenario_id);
CREATE INDEX idx_scenario_revisions_scenario_id ON scenario_revisions(scenario_id);

-- updated_at 자동 갱신 트리거
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER scenarios_updated_at
  BEFORE UPDATE ON scenarios
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
