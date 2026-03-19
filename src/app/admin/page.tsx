import Link from 'next/link';

/** 관리자 홈 — Import/Trees 링크 카드 */
export default function AdminPage() {
  const cards = [
    {
      title: '데이터 Import',
      description: 'revised/ 폴더 데이터를 Supabase에 동기화합니다.',
      href: '/admin/import',
    },
    {
      title: '트리 분류 관리',
      description: '트리 구조를 편집하고 시나리오를 매핑합니다.',
      href: '/admin/trees',
    },
    {
      title: '상태 일괄 갱신',
      description: '모든 시나리오의 상태를 데이터 기반으로 자동 판별·갱신합니다.',
      href: '/admin/sync-status',
    },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-bold text-gray-900 mb-6">관리자 메뉴</h2>
      <div className="grid gap-4">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="block bg-white rounded-lg border p-6 hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-lg text-gray-900">{card.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{card.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
