'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Tree, TreeNode, Scenario } from '@/types';
import {
  upsertTreeNode,
  deleteTreeNode,
  assignScenarioToNode,
} from '@/app/admin/trees/actions';

interface TreeEditorProps {
  tree: Tree;
  nodes: TreeNode[];
  scenarios: Scenario[];
}

/** 트리 구조 편집기 — 노드 추가/삭제/이동, 시나리오 매핑 */
export function TreeEditor({ tree, nodes, scenarios }: TreeEditorProps) {
  const router = useRouter();
  const [newLabel, setNewLabel] = useState('');
  const [parentId, setParentId] = useState<string>('');
  const [message, setMessage] = useState('');

  // 노드를 depth 기준으로 정렬하여 표시
  const sortedNodes = [...nodes].sort((a, b) => {
    if (a.depth !== b.depth) return a.depth - b.depth;
    return a.sort_order - b.sort_order;
  });

  async function handleAddNode() {
    if (!newLabel.trim()) return;
    setMessage('');

    const depth = parentId
      ? (nodes.find((n) => n.id === parentId)?.depth ?? 0) + 1
      : 0;

    const result = await upsertTreeNode({
      tree_id: tree.id,
      parent_id: parentId || null,
      label: newLabel.trim(),
      depth,
      sort_order: nodes.filter((n) => (n.parent_id ?? '') === (parentId || '')).length,
    });

    if (result.error) {
      setMessage(result.error);
    } else {
      setNewLabel('');
      router.refresh();
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('이 노드를 삭제하시겠습니까? 하위 노드도 함께 삭제됩니다.')) return;
    await deleteTreeNode(id);
    router.refresh();
  }

  async function handleScenarioAssign(nodeId: string, scenarioId: string) {
    await assignScenarioToNode(nodeId, scenarioId || null);
    router.refresh();
  }

  /** 노드의 들여쓰기를 위한 prefix */
  function getIndent(depth: number): string {
    return '　'.repeat(depth);
  }

  return (
    <div className="space-y-6">
      {/* 노드 추가 */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-3">노드 추가</h3>
        <div className="flex gap-2">
          <select
            value={parentId}
            onChange={(e) => setParentId(e.target.value)}
            className="border rounded px-3 py-2 text-sm text-gray-800"
          >
            <option value="">루트 노드</option>
            {sortedNodes.map((n) => (
              <option key={n.id} value={n.id}>
                {getIndent(n.depth)}{n.label}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder="노드 이름"
            className="flex-1 border rounded px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400"
            onKeyDown={(e) => e.key === 'Enter' && handleAddNode()}
          />
          <button
            onClick={handleAddNode}
            className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
          >
            추가
          </button>
        </div>
        {message && <p className="text-red-500 text-sm mt-2">{message}</p>}
      </div>

      {/* 노드 목록 */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-gray-700">노드</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-700">시나리오 매핑</th>
              <th className="text-right px-4 py-3 font-semibold text-gray-700">작업</th>
            </tr>
          </thead>
          <tbody>
            {sortedNodes.map((node) => (
              <tr key={node.id} className="border-b last:border-b-0 hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-800">
                  <span style={{ paddingLeft: `${node.depth * 20}px` }}>
                    {node.depth > 0 ? '└ ' : ''}{node.label}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <select
                    value={node.scenario_id ?? ''}
                    onChange={(e) => handleScenarioAssign(node.id, e.target.value)}
                    className="border rounded px-2 py-1 text-xs text-gray-800 w-full max-w-xs"
                  >
                    <option value="">매핑 없음</option>
                    {scenarios.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleDelete(node.id)}
                    className="text-red-600 hover:text-red-800 text-xs font-medium"
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
            {sortedNodes.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-gray-500">
                  노드가 없습니다. 위에서 추가해주세요.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
