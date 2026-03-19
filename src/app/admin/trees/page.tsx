import { createClient } from '@/lib/supabase/server';
import { TreeEditor } from '@/features/admin/components/TreeEditor';
import { createTree } from './actions';
import type { Tree, TreeNode, Scenario } from '@/types';

/** 트리 관리 페이지 */
export default async function TreesAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ tree?: string }>;
}) {
  const { tree: selectedTreeSlug } = await searchParams;
  const supabase = await createClient();

  // 트리 목록 조회
  const { data: trees } = await supabase
    .from('trees')
    .select('*')
    .order('created_at');

  const treeList = trees ?? [];
  const currentTree = selectedTreeSlug
    ? treeList.find((t) => t.slug === selectedTreeSlug) ?? treeList[0]
    : treeList[0];

  // 현재 선택된 트리의 노드 조회
  let nodes: TreeNode[] = [];
  if (currentTree) {
    const { data } = await supabase
      .from('tree_nodes')
      .select('*')
      .eq('tree_id', currentTree.id)
      .order('sort_order');
    nodes = data ?? [];
  }

  // 시나리오 목록 (매핑용)
  const { data: scenarios } = await supabase
    .from('scenarios')
    .select('*')
    .order('title');

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-xl font-bold text-gray-900 mb-6">트리 분류 관리</h2>

      {/* 트리 선택 + 새 트리 생성 */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex gap-2">
          {treeList.map((t) => (
            <a
              key={t.slug}
              href={`/admin/trees?tree=${t.slug}`}
              className={`px-3 py-1.5 text-sm rounded-md ${
                currentTree?.slug === t.slug
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {t.name}
            </a>
          ))}
        </div>
        <form
          action={async (formData: FormData) => {
            'use server';
            const slug = formData.get('slug') as string;
            const name = formData.get('name') as string;
            if (slug && name) {
              await createTree(slug, name);
            }
          }}
          className="flex gap-2 ml-auto"
        >
          <input name="slug" placeholder="slug" className="border rounded px-2 py-1 text-sm w-24 text-gray-800 placeholder:text-gray-400" />
          <input name="name" placeholder="이름" className="border rounded px-2 py-1 text-sm w-32 text-gray-800 placeholder:text-gray-400" />
          <button type="submit" className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">
            새 트리
          </button>
        </form>
      </div>

      {/* 트리 편집기 */}
      {currentTree ? (
        <TreeEditor
          tree={currentTree}
          nodes={nodes ?? []}
          scenarios={scenarios ?? []}
        />
      ) : (
        <div className="text-center py-8 text-gray-500">
          트리를 생성해주세요.
        </div>
      )}
    </div>
  );
}
