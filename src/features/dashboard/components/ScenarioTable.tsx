'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Scenario, ScenarioStatus } from '@/types';
import { StatusBadge } from '@/features/scenario/components/StatusBadge';
import { formatDate, formatDuration, statusLabel } from '@/lib/utils';
import { updateScenarioStatus } from '@/app/dashboard/actions';

interface ScenarioTableProps {
  scenarios: Scenario[];
}

const ALL_STATUSES: ScenarioStatus[] = ['draft', 'revision', 'production', 'complete'];

/** 시나리오 목록 테이블 — 상태 필터, 상태 변경 드롭다운 */
export function ScenarioTable({ scenarios }: ScenarioTableProps) {
  const [filter, setFilter] = useState<ScenarioStatus | 'all'>('all');
  const [items, setItems] = useState(scenarios);

  const filtered = filter === 'all' ? items : items.filter((s) => s.status === filter);

  async function handleStatusChange(id: string, newStatus: ScenarioStatus) {
    const result = await updateScenarioStatus(id, newStatus);
    if (result.success) {
      setItems((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
      );
    } else {
      alert(result.error ?? '상태 변경에 실패했습니다.');
    }
  }

  return (
    <div>
      {/* 필터 */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 text-sm rounded-md ${
            filter === 'all' ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          전체
        </button>
        {ALL_STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 text-sm rounded-md ${
              filter === s ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {statusLabel(s)}
          </button>
        ))}
      </div>

      {/* 테이블 */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-gray-700">제목</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-700">법률근거</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-700">시행일</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-700">영상길이</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-700">상태</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-700">상태 변경</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((scenario) => (
              <tr key={scenario.id} className="border-b last:border-b-0 hover:bg-gray-50">
                <td className="px-4 py-3">
                  <Link href={`/scenarios/${scenario.id}`} className="text-blue-600 hover:underline">
                    {scenario.title}
                  </Link>
                </td>
                <td className="px-4 py-3 text-gray-700">{scenario.law_basis ?? '-'}</td>
                <td className="px-4 py-3 text-gray-700">{formatDate(scenario.effective_date)}</td>
                <td className="px-4 py-3 text-gray-700">{formatDuration(scenario.video_duration)}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={scenario.status} />
                </td>
                <td className="px-4 py-3">
                  <select
                    value={scenario.status}
                    onChange={(e) => handleStatusChange(scenario.id, e.target.value as ScenarioStatus)}
                    className="border rounded px-2 py-1 text-xs text-gray-800"
                  >
                    {ALL_STATUSES.map((s) => (
                      <option key={s} value={s}>{statusLabel(s)}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  시나리오가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
