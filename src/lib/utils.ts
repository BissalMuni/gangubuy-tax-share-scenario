/** 조건부 클래스명 병합 */
export function cn(...inputs: (string | undefined | null | false)[]) {
  return inputs.filter(Boolean).join(' ');
}

/** 날짜 포맷 (YYYY-MM-DD) */
export function formatDate(dateStr: string | null): string {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('ko-KR');
}

/** 초 → mm:ss 변환 */
export function formatDuration(seconds: number | null): string {
  if (!seconds) return '-';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

/** 상태 한국어 라벨 */
export function statusLabel(status: string): string {
  const labels: Record<string, string> = {
    draft: '초안',
    revision: '수정중',
    production: '제작중',
    complete: '완료',
  };
  return labels[status] ?? status;
}
