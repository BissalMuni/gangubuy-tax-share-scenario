'use client';

import { useEffect, useState } from 'react';
import type { Tree } from '@/types';
import type { TreeWithNodes } from '../types';
import { TreeSelector } from './TreeSelector';
import { TreeNodeItem } from './TreeNode';
import { useTreeState } from '../hooks/useTreeState';
import { createClient } from '@/lib/supabase/client';
import { flatToNested } from '../lib/tree-utils';

interface TreeNavProps {
  trees: Tree[];
  initialTree: TreeWithNodes | null;
}

/** 전체 트리 네비게이션 (드롭다운 + 중첩 노드 목록) */
export function TreeNav({ trees, initialTree }: TreeNavProps) {
  const { selectedSlug } = useTreeState();
  const [treeData, setTreeData] = useState<TreeWithNodes | null>(initialTree);
  const [loading, setLoading] = useState(false);

  // 분류 기준 변경 시 해당 트리 데이터 클라이언트에서 패칭
  useEffect(() => {
    if (initialTree && selectedSlug === initialTree.slug) {
      setTreeData(initialTree);
      return;
    }

    async function loadTree() {
      setLoading(true);
      const supabase = createClient();

      const { data: tree } = await supabase
        .from('trees')
        .select('*')
        .eq('slug', selectedSlug)
        .single();

      if (!tree) {
        setTreeData(null);
        setLoading(false);
        return;
      }

      const { data: nodes } = await supabase
        .from('tree_nodes')
        .select('*, scenarios(status)')
        .eq('tree_id', tree.id)
        .order('sort_order');

      const nested = flatToNested(nodes ?? []);
      setTreeData({ ...tree, nodes: nested });
      setLoading(false);
    }

    loadTree();
  }, [selectedSlug, initialTree]);

  return (
    <nav className="w-full">
      <TreeSelector trees={trees} />

      {loading ? (
        <div className="py-4 text-center text-sm text-gray-500">로딩 중...</div>
      ) : treeData && treeData.nodes.length > 0 ? (
        <ul className="space-y-0.5">
          {treeData.nodes.map((node) => (
            <TreeNodeItem key={node.id} node={node} />
          ))}
        </ul>
      ) : (
        <div className="py-4 text-center text-sm text-gray-500">
          트리 데이터가 없습니다.
        </div>
      )}
    </nav>
  );
}
