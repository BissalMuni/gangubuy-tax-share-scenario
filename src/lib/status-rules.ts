import type { ScenarioStatus } from '@/types';

interface StatusInput {
  script_content: string | null;
  scene_data: unknown[] | null;
  pdf_path: string | null;
  has_storyboard: boolean;
}

/**
 * 시나리오 상태 자동 판별
 * - draft: 내용 없음
 * - revision: 스크립트 또는 장면 데이터 존재
 * - production: 콘티(스토리보드) 업로드됨
 * - complete: 스크립트 + 장면 + 콘티 + PDF 모두 존재
 */
export function deriveStatus(input: StatusInput): ScenarioStatus {
  const hasScript = !!input.script_content?.trim();
  const hasScenes = Array.isArray(input.scene_data) && input.scene_data.length > 0;
  const hasPdf = !!input.pdf_path;
  const hasStoryboard = input.has_storyboard;

  // 모두 충족 → 완료
  if (hasScript && hasScenes && hasStoryboard && hasPdf) {
    return 'complete';
  }

  // 콘티 업로드됨 → 제작중
  if (hasStoryboard) {
    return 'production';
  }

  // 스크립트 또는 장면 존재 → 수정중
  if (hasScript || hasScenes) {
    return 'revision';
  }

  return 'draft';
}
