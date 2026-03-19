/** 시나리오 목록 로딩 스켈레톤 */
export default function ScenariosLoading() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b px-6 py-4">
        <div className="h-7 w-32 bg-gray-200 rounded animate-pulse" />
      </header>
      <div className="flex">
        <aside className="w-80 border-r p-4">
          <div className="space-y-3">
            <div className="h-9 bg-gray-200 rounded animate-pulse" />
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-6 bg-gray-100 rounded animate-pulse" style={{ width: `${70 + Math.random() * 30}%` }} />
            ))}
          </div>
        </aside>
        <main className="flex-1 p-8">
          <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
        </main>
      </div>
    </div>
  );
}
