'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

/** 새 트리 분류 생성 */
export async function createTree(slug: string, name: string, description?: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('trees')
    .insert({ slug, name, description: description || null })
    .select()
    .single();

  if (error) return { error: error.message };
  revalidatePath('/admin/trees');
  return { data };
}

/** 트리 노드 추가/수정 */
export async function upsertTreeNode(input: {
  id?: string;
  tree_id: string;
  parent_id?: string | null;
  label: string;
  sort_order?: number;
  scenario_id?: string | null;
  depth?: number;
}) {
  const supabase = await createClient();

  if (input.id) {
    const { error } = await supabase
      .from('tree_nodes')
      .update({
        label: input.label,
        parent_id: input.parent_id ?? null,
        sort_order: input.sort_order ?? 0,
        scenario_id: input.scenario_id ?? null,
        depth: input.depth ?? 0,
      })
      .eq('id', input.id);

    if (error) return { error: error.message };
  } else {
    const { error } = await supabase
      .from('tree_nodes')
      .insert({
        tree_id: input.tree_id,
        parent_id: input.parent_id ?? null,
        label: input.label,
        sort_order: input.sort_order ?? 0,
        scenario_id: input.scenario_id ?? null,
        depth: input.depth ?? 0,
      });

    if (error) return { error: error.message };
  }

  revalidatePath('/admin/trees');
  revalidatePath('/scenarios');
  return { success: true };
}

/** 트리 노드 삭제 */
export async function deleteTreeNode(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('tree_nodes')
    .delete()
    .eq('id', id);

  if (error) return { error: error.message };
  revalidatePath('/admin/trees');
  revalidatePath('/scenarios');
  return { success: true };
}

/** 시나리오를 노드에 매핑 */
export async function assignScenarioToNode(nodeId: string, scenarioId: string | null) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('tree_nodes')
    .update({ scenario_id: scenarioId })
    .eq('id', nodeId);

  if (error) return { error: error.message };
  revalidatePath('/admin/trees');
  revalidatePath('/scenarios');
  return { success: true };
}
