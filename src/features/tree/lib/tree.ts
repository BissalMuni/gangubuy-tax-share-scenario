import { createClient } from '@/lib/supabase/server';
import type { Tree } from '@/types';
import type { TreeWithNodes } from '../types';
import { flatToNested } from './tree-utils';

// 서버 전용 함수 — re-export는 하지 않음
export { flatToNested } from './tree-utils';

/** 모든 트리 분류 목록 조회 */
export async function fetchTrees(): Promise<Tree[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('trees')
    .select('*')
    .order('created_at');

  if (error) throw error;
  return data ?? [];
}

/** 특정 트리의 노드를 중첩 구조로 조회 */
export async function fetchTreeWithNodes(treeSlug: string): Promise<TreeWithNodes | null> {
  const supabase = await createClient();

  // 트리 조회
  const { data: tree, error: treeError } = await supabase
    .from('trees')
    .select('*')
    .eq('slug', treeSlug)
    .single();

  if (treeError || !tree) return null;

  // 해당 트리의 모든 노드 + 시나리오 상태 조회
  const { data: nodes, error: nodesError } = await supabase
    .from('tree_nodes')
    .select('*, scenarios(status)')
    .eq('tree_id', tree.id)
    .order('sort_order');

  if (nodesError) throw nodesError;

  const nested = flatToNested(nodes ?? []);

  return { ...tree, nodes: nested };
}
