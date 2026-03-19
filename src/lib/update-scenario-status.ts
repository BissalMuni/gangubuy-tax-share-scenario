import { SupabaseClient } from '@supabase/supabase-js';
import { deriveStatus } from './status-rules';

/** 시나리오 상태를 현재 데이터 기반으로 자동 갱신 */
export async function syncScenarioStatus(supabase: SupabaseClient, scenarioId: string) {
  // 시나리오 데이터 조회
  const { data: scenario } = await supabase
    .from('scenarios')
    .select('script_content, scene_data, pdf_path, status')
    .eq('id', scenarioId)
    .single();

  if (!scenario) return;

  // 콘티 존재 여부 확인
  const { count } = await supabase
    .from('storyboards')
    .select('id', { count: 'exact', head: true })
    .eq('scenario_id', scenarioId);

  const newStatus = deriveStatus({
    script_content: scenario.script_content,
    scene_data: scenario.scene_data,
    pdf_path: scenario.pdf_path,
    has_storyboard: (count ?? 0) > 0,
  });

  // 상태가 달라진 경우에만 업데이트
  if (newStatus !== scenario.status) {
    await supabase
      .from('scenarios')
      .update({ status: newStatus })
      .eq('id', scenarioId);
  }

  return newStatus;
}
