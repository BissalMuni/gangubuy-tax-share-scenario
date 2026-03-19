import type { StatusCount } from '../lib/dashboard';
import { statusLabel } from '@/lib/utils';

interface StatusOverviewProps {
  counts: StatusCount[];
}

const colorMap: Record<string, { card: string; number: string }> = {
  draft: { card: 'bg-gray-50 border-gray-300', number: 'text-gray-800' },
  revision: { card: 'bg-yellow-50 border-yellow-300', number: 'text-yellow-800' },
  production: { card: 'bg-blue-50 border-blue-300', number: 'text-blue-800' },
  complete: { card: 'bg-green-50 border-green-300', number: 'text-green-800' },
};

/** 상태별 통계 카드 4개 */
export function StatusOverview({ counts }: StatusOverviewProps) {
  const total = counts.reduce((sum, c) => sum + c.count, 0);

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-4 gap-4">
        {counts.map(({ status, count }) => {
          const colors = colorMap[status] ?? { card: 'bg-gray-50', number: 'text-gray-800' };
          return (
            <div
              key={status}
              className={`rounded-lg border p-4 ${colors.card}`}
            >
              <p className="text-sm font-semibold text-gray-700">{statusLabel(status)}</p>
              <p className={`text-3xl font-bold mt-1 ${colors.number}`}>{count}</p>
            </div>
          );
        })}
      </div>
      <p className="text-sm text-gray-600 text-right">전체: {total}개</p>
    </div>
  );
}
