'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { syncScenarioStatus } from '@/lib/update-scenario-status';

interface UpdateScenarioInput {
  id: string;
  title?: string;
  law_basis?: string | null;
  effective_date?: string | null;
  video_duration?: number | null;
  script_content?: string | null;
  scene_data?: unknown[] | null;
}

/** 시나리오 저장 + 수정 이력 기록 */
export async function updateScenario(input: UpdateScenarioInput) {
  const supabase = await createClient();

  // 기존 데이터 조회
  const { data: existing, error: fetchError } = await supabase
    .from('scenarios')
    .select('*')
    .eq('id', input.id)
    .single();

  if (fetchError || !existing) {
    return { error: '시나리오를 찾을 수 없습니다.' };
  }

  // 변경된 필드 감지 및 이력 저장
  const fieldsToCheck = ['title', 'law_basis', 'effective_date', 'video_duration', 'script_content', 'scene_data'] as const;
  const revisions: { scenario_id: string; field: string; old_value: string | null; new_value: string | null }[] = [];

  for (const field of fieldsToCheck) {
    if (field in input) {
      const oldVal = existing[field];
      const newVal = input[field as keyof UpdateScenarioInput];
      const oldStr = oldVal != null ? String(typeof oldVal === 'object' ? JSON.stringify(oldVal) : oldVal) : null;
      const newStr = newVal != null ? String(typeof newVal === 'object' ? JSON.stringify(newVal) : newVal) : null;

      if (oldStr !== newStr) {
        revisions.push({
          scenario_id: input.id,
          field,
          old_value: oldStr,
          new_value: newStr,
        });
      }
    }
  }

  // 시나리오 업데이트
  const updateData: Record<string, unknown> = {};
  for (const field of fieldsToCheck) {
    if (field in input) {
      updateData[field] = input[field as keyof UpdateScenarioInput];
    }
  }

  const { error: updateError } = await supabase
    .from('scenarios')
    .update(updateData)
    .eq('id', input.id);

  if (updateError) {
    return { error: '저장에 실패했습니다.' };
  }

  // 수정 이력 저장
  if (revisions.length > 0) {
    await supabase.from('scenario_revisions').insert(revisions);
  }

  // 상태 자동 갱신
  await syncScenarioStatus(supabase, input.id);

  revalidatePath(`/scenarios/${input.id}`);
  revalidatePath('/dashboard');
  return { success: true };
}
