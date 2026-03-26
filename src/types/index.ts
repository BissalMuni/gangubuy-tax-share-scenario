/** 시나리오 상태 */
export type ScenarioStatus = 'draft' | 'revision' | 'production' | 'complete';

/** 시나리오 */
export interface Scenario {
  id: string;
  title: string;
  status: ScenarioStatus;
  law_basis: string | null;
  effective_date: string | null;
  video_duration: number | null;
  script_content: string | null;
  scene_data: SceneData[] | null;
  pdf_path: string | null;
  created_at: string;
  updated_at: string;
}

/** 시나리오 목록용 (대용량 컬럼 제외) */
export type ScenarioListItem = Omit<Scenario, 'script_content' | 'scene_data' | 'pdf_path'>;

/** 장면 데이터 */
export interface SceneData {
  scene_number: number;
  title: string;
  visual: string;
  narration: string;
  text_overlay?: string;
  duration?: number;
}

/** 트리 분류 체계 */
export interface Tree {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  created_at: string;
}

/** 트리 노드 (flat) */
export interface TreeNode {
  id: string;
  tree_id: string;
  parent_id: string | null;
  label: string;
  sort_order: number;
  scenario_id: string | null;
  depth: number;
  created_at: string;
}

/** 콘티(스토리보드) */
export interface Storyboard {
  id: string;
  scenario_id: string;
  uploader_name: string;
  file_path: string;
  file_type: 'image' | 'pdf';
  description: string | null;
  created_at: string;
}

/** 수정 이력 */
export interface ScenarioRevision {
  id: string;
  scenario_id: string;
  field: string;
  old_value: string | null;
  new_value: string | null;
  created_at: string;
}
