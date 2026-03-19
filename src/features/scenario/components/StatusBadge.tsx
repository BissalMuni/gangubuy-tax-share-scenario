import type { ScenarioStatus } from '@/types';
import { statusLabel } from '@/lib/utils';

interface StatusBadgeProps {
  status: ScenarioStatus;
}

const colorMap: Record<ScenarioStatus, string> = {
  draft: 'bg-gray-200 text-gray-800',
  revision: 'bg-yellow-200 text-yellow-900',
  production: 'bg-blue-200 text-blue-900',
  complete: 'bg-green-200 text-green-900',
};

/** 시나리오 상태 색상 배지 */
export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colorMap[status]}`}
    >
      {statusLabel(status)}
    </span>
  );
}
