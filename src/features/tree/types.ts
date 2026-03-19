import type { Tree, TreeNode, ScenarioStatus } from '@/types';

/** 중첩 트리 노드 (UI 렌더링용) */
export interface NestedTreeNode {
  id: string;
  label: string;
  sort_order: number;
  depth: number;
  scenario_id: string | null;
  /** 리프 노드인 경우 시나리오 상태 */
  scenario_status?: ScenarioStatus;
  children: NestedTreeNode[];
}

/** 트리 + 노드 데이터 */
export interface TreeWithNodes extends Tree {
  nodes: NestedTreeNode[];
}
