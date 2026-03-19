'use client';

import type { Tree } from '@/types';
import { useTreeState } from '../hooks/useTreeState';

interface TreeSelectorProps {
  trees: Tree[];
}

/** 분류 기준 드롭다운 */
export function TreeSelector({ trees }: TreeSelectorProps) {
  const { selectedSlug, setSelectedSlug } = useTreeState();

  return (
    <div className="mb-4">
      <label htmlFor="tree-select" className="block text-sm font-semibold text-gray-900 mb-1">
        분류 기준
      </label>
      <select
        id="tree-select"
        value={selectedSlug}
        onChange={(e) => setSelectedSlug(e.target.value)}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {trees.map((tree) => (
          <option key={tree.id} value={tree.slug}>
            {tree.name}
          </option>
        ))}
      </select>
    </div>
  );
}
