import type { TreeNode } from '@/types';
import type { NestedTreeNode } from '../types';

/** flat 노드 배열 → 중첩 트리 구조 변환 */
export function flatToNested(
  nodes: (TreeNode & { scenarios?: { status: string } | null })[]
): NestedTreeNode[] {
  const map = new Map<string, NestedTreeNode>();
  const roots: NestedTreeNode[] = [];

  // 먼저 모든 노드를 맵에 등록
  for (const node of nodes) {
    map.set(node.id, {
      id: node.id,
      label: node.label,
      sort_order: node.sort_order,
      depth: node.depth,
      scenario_id: node.scenario_id,
      scenario_status: (node.scenarios?.status as NestedTreeNode['scenario_status']) ?? undefined,
      children: [],
    });
  }

  // 부모-자식 관계 연결
  for (const node of nodes) {
    const nested = map.get(node.id)!;
    if (node.parent_id && map.has(node.parent_id)) {
      map.get(node.parent_id)!.children.push(nested);
    } else {
      roots.push(nested);
    }
  }

  return roots;
}
