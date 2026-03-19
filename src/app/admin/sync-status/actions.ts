'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { deriveStatus } from '@/lib/status-rules';

/** 모든 시나리오 상태를 데이터 기반으로 일괄 갱신 */
export async function syncAllStatuses() {
  const supabase = await createClient();

  // 전체 시나리오 조회
  const { data: scenarios, error } = await supabase
    .from('scenarios')
    .select('id, script_content, scene_data, pdf_path, status');

  if (error || !scenarios) {
    return { error: '시나리오 조회에 실패했습니다.' };
  }

  // 시나리오별 콘티 존재 여부 확인
  const { data: storyboardCounts } = await supabase
    .from('storyboards')
    .select('scenario_id');

  const storyboardSet = new Set(
    (storyboardCounts ?? []).map((s) => s.scenario_id)
  );

  let updated = 0;

  for (const scenario of scenarios) {
    const newStatus = deriveStatus({
      script_content: scenario.script_content,
      scene_data: scenario.scene_data,
      pdf_path: scenario.pdf_path,
      has_storyboard: storyboardSet.has(scenario.id),
    });

    if (newStatus !== scenario.status) {
      await supabase
        .from('scenarios')
        .update({ status: newStatus })
        .eq('id', scenario.id);
      updated++;
    }
  }

  revalidatePath('/dashboard');
  return { success: true, total: scenarios.length, updated };
}
