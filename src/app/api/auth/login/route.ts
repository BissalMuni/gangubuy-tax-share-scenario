import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/** 사이트 비밀번호 인증 API */
export async function POST(request: NextRequest) {
  const { password } = await request.json();
  const sitePassword = process.env.SITE_PASSWORD;

  if (!sitePassword || password !== sitePassword) {
    return NextResponse.json({ error: '비밀번호가 올바르지 않습니다.' }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set('site_auth', 'authenticated', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 7일
    path: '/',
    sameSite: 'lax',
  });

  return NextResponse.json({ success: true });
}
