import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/** 관리자 비밀번호 인증 API */
export async function POST(request: NextRequest) {
  const { password } = await request.json();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword || password !== adminPassword) {
    return NextResponse.json({ error: '인증 실패' }, { status: 401 });
  }

  // 쿠키에 인증 토큰 저장 (24시간)
  const cookieStore = await cookies();
  cookieStore.set('admin_auth', 'authenticated', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24,
    path: '/admin',
    sameSite: 'lax',
  });

  return NextResponse.json({ success: true });
}
