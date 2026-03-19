import { cookies } from 'next/headers';
import { PasswordGate } from '@/features/admin/components/PasswordGate';
import Link from 'next/link';

/** /admin 경로 보호 레이아웃 — ADMIN_PASSWORD 쿠키 검증 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const auth = cookieStore.get('admin_auth');

  if (auth?.value !== 'authenticated') {
    return <PasswordGate />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-lg font-bold">관리자</h1>
            <nav className="flex gap-4 text-sm text-gray-700">
              <Link href="/admin" className="hover:text-blue-600">홈</Link>
              <Link href="/admin/import" className="hover:text-blue-600">Import</Link>
              <Link href="/admin/trees" className="hover:text-blue-600">트리 관리</Link>
            </nav>
          </div>
          <Link href="/dashboard" className="text-sm text-gray-700 hover:text-blue-600">
            대시보드로
          </Link>
        </div>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}
