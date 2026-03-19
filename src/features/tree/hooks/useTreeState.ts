'use client';

import { create } from 'zustand';

interface TreeState {
  /** 현재 선택된 트리 slug */
  selectedSlug: string;
  /** 펼쳐진 노드 ID 집합 */
  expandedIds: Set<string>;
  setSelectedSlug: (slug: string) => void;
  toggleNode: (id: string) => void;
  expandNode: (id: string) => void;
  collapseNode: (id: string) => void;
}

export const useTreeState = create<TreeState>((set) => ({
  selectedSlug: 'by-law',
  expandedIds: new Set<string>(),
  setSelectedSlug: (slug) => set({ selectedSlug: slug, expandedIds: new Set() }),
  toggleNode: (id) =>
    set((state) => {
      const next = new Set(state.expandedIds);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return { expandedIds: next };
    }),
  expandNode: (id) =>
    set((state) => {
      const next = new Set(state.expandedIds);
      next.add(id);
      return { expandedIds: next };
    }),
  collapseNode: (id) =>
    set((state) => {
      const next = new Set(state.expandedIds);
      next.delete(id);
      return { expandedIds: next };
    }),
}));
