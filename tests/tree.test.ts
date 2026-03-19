import { describe, it, expect } from 'vitest';
import { flatToNested } from '@/features/tree/lib/tree-utils';

describe('flatToNested', () => {
  it('빈 배열이면 빈 배열 반환', () => {
    expect(flatToNested([])).toEqual([]);
  });

  it('루트 노드만 있을 때 정상 변환', () => {
    const nodes = [
      {
        id: '1',
        tree_id: 't1',
        parent_id: null,
        label: '루트',
        sort_order: 0,
        scenario_id: null,
        depth: 0,
        created_at: '',
      },
    ];

    const result = flatToNested(nodes);
    expect(result).toHaveLength(1);
    expect(result[0].label).toBe('루트');
    expect(result[0].children).toHaveLength(0);
  });

  it('중첩 구조 올바르게 변환', () => {
    const nodes = [
      { id: '1', tree_id: 't1', parent_id: null, label: '법령1', sort_order: 0, scenario_id: null, depth: 0, created_at: '' },
      { id: '2', tree_id: 't1', parent_id: '1', label: '세목A', sort_order: 0, scenario_id: null, depth: 1, created_at: '' },
      { id: '3', tree_id: 't1', parent_id: '1', label: '세목B', sort_order: 1, scenario_id: null, depth: 1, created_at: '' },
      { id: '4', tree_id: 't1', parent_id: '2', label: '테마1', sort_order: 0, scenario_id: 's1', depth: 2, created_at: '', scenarios: { status: 'draft' } },
    ];

    const result = flatToNested(nodes);
    expect(result).toHaveLength(1);
    expect(result[0].children).toHaveLength(2);
    expect(result[0].children[0].children).toHaveLength(1);
    expect(result[0].children[0].children[0].scenario_id).toBe('s1');
    expect(result[0].children[0].children[0].scenario_status).toBe('draft');
  });

  it('여러 루트 노드 지원', () => {
    const nodes = [
      { id: '1', tree_id: 't1', parent_id: null, label: 'A', sort_order: 0, scenario_id: null, depth: 0, created_at: '' },
      { id: '2', tree_id: 't1', parent_id: null, label: 'B', sort_order: 1, scenario_id: null, depth: 0, created_at: '' },
    ];

    const result = flatToNested(nodes);
    expect(result).toHaveLength(2);
  });

  it('리프 노드에 시나리오 상태 매핑', () => {
    const nodes = [
      {
        id: '1', tree_id: 't1', parent_id: null, label: '완료 시나리오',
        sort_order: 0, scenario_id: 's1', depth: 0, created_at: '',
        scenarios: { status: 'complete' },
      },
    ];

    const result = flatToNested(nodes);
    expect(result[0].scenario_status).toBe('complete');
  });
});
