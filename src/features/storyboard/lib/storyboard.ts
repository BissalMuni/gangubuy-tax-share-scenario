import { createClient } from '@/lib/supabase/server';
import type { Storyboard } from '@/types';

/** 시나리오별 콘티 목록 조회 */
export async function fetchStoryboards(scenarioId: string): Promise<Storyboard[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('storyboards')
    .select('*')
    .eq('scenario_id', scenarioId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}
