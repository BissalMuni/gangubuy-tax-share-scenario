/** 시나리오 상세 로딩 스켈레톤 */
export default function ScenarioDetailLoading() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b px-6 py-4">
        <div className="h-5 w-64 bg-gray-200 rounded animate-pulse" />
      </header>
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-96 bg-gray-100 rounded-lg animate-pulse" />
          <div className="space-y-4">
            <div className="h-8 w-3/4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-1/2 bg-gray-100 rounded animate-pulse" />
            <div className="h-64 bg-gray-50 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
