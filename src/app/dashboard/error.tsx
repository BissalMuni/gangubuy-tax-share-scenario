'use client';

/** 대시보드 에러 바운더리 */
export default function DashboardError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <h2 className="text-xl font-bold text-red-600 mb-2">대시보드 로딩 실패</h2>
        <p className="text-gray-500 mb-4 text-sm">{error.message}</p>
        <button
          onClick={reset}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
        >
          다시 시도
        </button>
      </div>
    </div>
  );
}
