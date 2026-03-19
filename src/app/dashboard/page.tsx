import { fetchStatusCounts, fetchScenarioList } from '@/features/dashboard/lib/dashboard';
import { StatusOverview } from '@/features/dashboard/components/StatusOverview';
import { ScenarioTable } from '@/features/dashboard/components/ScenarioTable';
import Link from 'next/link';

/** 대시보드 페이지 — 전체 시나리오 진행 현황 */
export default async function DashboardPage() {
  const [counts, scenarios] = await Promise.all([
    fetchStatusCounts(),
    fetchScenarioList(),
  ]);

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b px-6 py-4">
        <nav className="flex items-center gap-6">
          <Link href="/dashboard" className="text-xl font-bold text-gray-900">
            대시보드
          </Link>
          <Link href="/scenarios" className="text-xl font-bold text-gray-900 hover:text-blue-600">
            시나리오 목록
          </Link>
          <Link href="/admin" className="text-xl font-bold text-gray-900 hover:text-blue-600">
            관리자
          </Link>
        </nav>
      </header>
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        <StatusOverview counts={counts} />
        <ScenarioTable scenarios={scenarios} />
      </div>
    </div>
  );
}
