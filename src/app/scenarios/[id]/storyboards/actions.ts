'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { syncScenarioStatus } from '@/lib/update-scenario-status';

/** 콘티 업로드 후 시나리오 상태 자동 갱신 */
export async function syncStatusAfterUpload(scenarioId: string) {
  const supabase = await createClient();
  await syncScenarioStatus(supabase, scenarioId);

  revalidatePath(`/scenarios/${scenarioId}/storyboards`);
  revalidatePath('/dashboard');
}
