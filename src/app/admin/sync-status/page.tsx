'use client';

import { useState } from 'react';
import { syncAllStatuses } from './actions';

/** 관리자: 시나리오 상태 일괄 갱신 페이지 */
export default function SyncStatusPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ total: number; updated: number } | null>(null);
  const [error, setError] = useState('');

  async function handleSync() {
    setLoading(true);
    setError('');
    setResult(null);

    const res = await syncAllStatuses();

    if (res.error) {
      setError(res.error);
    } else if (res.success) {
      setResult({ total: res.total!, updated: res.updated! });
    }

    setLoading(false);
  }

  return (
    <div className="max-w-lg mx-auto">
      <h2 className="text-xl font-bold text-gray-900 mb-2">상태 일괄 갱신</h2>
      <p className="text-sm text-gray-600 mb-6">
        모든 시나리오의 상태를 데이터 기반으로 자동 판별하여 갱신합니다.<br />
        (스크립트/장면 → 수정중, 콘티 → 제작중, 모두 완료 → 완료)
      </p>

      <button
        onClick={handleSync}
        disabled={loading}
        className="px-6 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm font-medium"
      >
        {loading ? '갱신 중...' : '일괄 갱신 실행'}
      </button>

      {result && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-sm">
          전체 {result.total}개 중 <strong>{result.updated}개</strong> 상태가 변경되었습니다.
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}
    </div>
  );
}
