import { redirect } from 'next/navigation';

/** 루트 페이지 → /dashboard 리다이렉트 */
export default function Home() {
  redirect('/dashboard');
}
