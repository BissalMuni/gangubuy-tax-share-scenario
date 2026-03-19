import { createClient } from '@/lib/supabase/server';
import type { Scenario } from '@/types';
import type { ScenarioWithRevisions } from '../types';

/** 시나리오 단건 조회 */
export async function fetchScenario(id: string): Promise<Scenario | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('scenarios')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data;
}

/** 시나리오 + 수정 이력 조회 */
export async function fetchScenarioWithRevisions(id: string): Promise<ScenarioWithRevisions | null> {
  const supabase = await createClient();

  const { data: scenario, error } = await supabase
    .from('scenarios')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !scenario) return null;

  const { data: revisions } = await supabase
    .from('scenario_revisions')
    .select('*')
    .eq('scenario_id', id)
    .order('created_at', { ascending: false });

  return { ...scenario, revisions: revisions ?? [] };
}

/** 전체 시나리오 목록 조회 */
export async function fetchAllScenarios(): Promise<Scenario[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('scenarios')
    .select('*')
    .order('title');

  if (error) throw error;
  return data ?? [];
}
