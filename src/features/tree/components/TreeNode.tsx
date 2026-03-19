'use client';

import Link from 'next/link';
import type { NestedTreeNode } from '../types';
import { useTreeState } from '../hooks/useTreeState';
import { StatusBadge } from '@/features/scenario/components/StatusBadge';

interface TreeNodeProps {
  node: NestedTreeNode;
}

/** 개별 트리 노드 (접기/펼치기, 상태 배지 표시) */
export function TreeNodeItem({ node }: TreeNodeProps) {
  const { expandedIds, toggleNode } = useTreeState();
  const isExpanded = expandedIds.has(node.id);
  const hasChildren = node.children.length > 0;
  const isLeaf = node.scenario_id !== null;

  return (
    <li>
      <div
        className="flex items-center gap-1 py-1 px-2 rounded hover:bg-gray-100 cursor-pointer text-sm text-gray-800"
        style={{ paddingLeft: `${node.depth * 16 + 8}px` }}
      >
        {/* 펼침/접힘 아이콘 */}
        {hasChildren ? (
          <button
            onClick={() => toggleNode(node.id)}
            className="w-5 h-5 flex items-center justify-center text-gray-600 hover:text-gray-800"
            aria-label={isExpanded ? '접기' : '펼치기'}
          >
            {isExpanded ? '▼' : '▶'}
          </button>
        ) : (
          <span className="w-5 h-5" />
        )}

        {/* 노드 라벨 */}
        {isLeaf ? (
          <Link
            href={`/scenarios/${node.scenario_id}`}
            className="flex-1 hover:text-blue-600 truncate"
          >
            {node.label}
          </Link>
        ) : (
          <span
            className="flex-1 font-semibold text-gray-900 truncate"
            onClick={() => hasChildren && toggleNode(node.id)}
          >
            {node.label}
          </span>
        )}

        {/* 상태 배지 */}
        {node.scenario_status && <StatusBadge status={node.scenario_status} />}
      </div>

      {/* 자식 노드 */}
      {hasChildren && isExpanded && (
        <ul>
          {node.children.map((child) => (
            <TreeNodeItem key={child.id} node={child} />
          ))}
        </ul>
      )}
    </li>
  );
}
