'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { ScenarioStatus } from '@/types';

/** 시나리오 상태 변경 */
export async function updateScenarioStatus(id: string, status: ScenarioStatus) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('scenarios')
    .update({ status })
    .eq('id', id)
    .select('id');

  if (error) {
    console.error('상태 변경 에러:', error);
    return { error: `상태 변경에 실패했습니다: ${error.message}` };
  }

  if (!data || data.length === 0) {
    return { error: '해당 시나리오를 찾을 수 없습니다.' };
  }

  revalidatePath('/dashboard');
  revalidatePath(`/scenarios/${id}`);
  return { success: true };
}
