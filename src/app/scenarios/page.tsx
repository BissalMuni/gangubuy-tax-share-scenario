import Link from 'next/link';
import { fetchTrees, fetchTreeWithNodes } from '@/features/tree/lib/tree';
import { TreeNav } from '@/features/tree/components/TreeNav';

/** 시나리오 목록 페이지 — 트리 네비게이션 */
export default async function ScenariosPage() {
  const trees = await fetchTrees();
  const defaultSlug = trees[0]?.slug ?? 'by-law';
  const initialTree = await fetchTreeWithNodes(defaultSlug);

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">시나리오 목록</h1>
        <Link
          href="/dashboard"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          대시보드
        </Link>
      </header>
      <div className="flex">
        {/* 사이드바: 트리 네비게이션 */}
        <aside className="w-80 border-r p-4 min-h-[calc(100vh-65px)] overflow-y-auto">
          <TreeNav trees={trees} initialTree={initialTree} />
        </aside>
        {/* 메인: 안내 텍스트 */}
        <main className="flex-1 p-8 flex items-center justify-center text-gray-500">
          왼쪽 트리에서 시나리오를 선택하세요.
        </main>
      </div>
    </div>
  );
}
