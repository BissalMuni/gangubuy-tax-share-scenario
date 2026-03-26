import { createClient } from '@/lib/supabase/server';
import type { ScenarioListItem, ScenarioStatus } from '@/types';

/** 상태별 시나리오 카운트 */
export interface StatusCount {
  status: ScenarioStatus;
  count: number;
}

/** 상태별 시나리오 카운트 쿼리 */
export async function fetchStatusCounts(): Promise<StatusCount[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('scenarios')
    .select('status');

  if (error) throw error;

  const counts: Record<string, number> = {
    draft: 0,
    revision: 0,
    production: 0,
    complete: 0,
  };

  for (const s of data ?? []) {
    counts[s.status] = (counts[s.status] || 0) + 1;
  }

  return Object.entries(counts).map(([status, count]) => ({
    status: status as ScenarioStatus,
    count,
  }));
}

/** 전체 시나리오 목록 (필터 옵션) */
export async function fetchScenarioList(
  statusFilter?: ScenarioStatus
): Promise<ScenarioListItem[]> {
  const supabase = await createClient();
  let query = supabase.from('scenarios')
    .select('id, title, status, law_basis, effective_date, video_duration, created_at, updated_at')
    .order('title');

  if (statusFilter) {
    query = query.eq('status', statusFilter);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}
