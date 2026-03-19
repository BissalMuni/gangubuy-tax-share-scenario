import { createClient } from '@/lib/supabase/server';

/** Import 현황 페이지 — 전체 시나리오 수, 상태별 통계 */
export default async function ImportPage() {
  const supabase = await createClient();

  // 전체 시나리오 수
  const { count: totalCount } = await supabase
    .from('scenarios')
    .select('*', { count: 'exact', head: true });

  // 상태별 카운트
  const { data: scenarios } = await supabase
    .from('scenarios')
    .select('status') as { data: { status: string }[] | null };

  const statusCounts = (scenarios ?? []).reduce(
    (acc, s) => {
      acc[s.status] = (acc[s.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  // 트리 수
  const { count: treeCount } = await supabase
    .from('trees')
    .select('*', { count: 'exact', head: true });

  // 트리 노드 수
  const { count: nodeCount } = await supabase
    .from('tree_nodes')
    .select('*', { count: 'exact', head: true });

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Import 현황</h2>

      <div className="bg-white rounded-lg border p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">전체 시나리오</p>
            <p className="text-3xl font-bold">{totalCount ?? 0}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">트리 분류</p>
            <p className="text-3xl font-bold">{treeCount ?? 0}</p>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">상태별 시나리오</h3>
          <div className="grid grid-cols-4 gap-2">
            {(['draft', 'revision', 'production', 'complete'] as const).map((status) => (
              <div key={status} className="text-center bg-gray-50 rounded p-2">
                <p className="text-xs text-gray-600">{status}</p>
                <p className="text-lg font-semibold">{statusCounts[status] ?? 0}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-600">
            트리 노드: {nodeCount ?? 0}개
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Import는 GitHub Actions 워크플로우로 자동 실행됩니다.
            <br />
            <code className="text-xs bg-gray-100 px-1 rounded">gangubuy-tax-revised/revised/</code> 폴더를 push하면 자동 동기화됩니다.
          </p>
        </div>
      </div>
    </div>
  );
}
