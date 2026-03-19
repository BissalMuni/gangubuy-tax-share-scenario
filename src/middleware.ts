import { NextRequest, NextResponse } from 'next/server';

/** 사이트 전체 비밀번호 보호 미들웨어 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 로그인 페이지, 인증 API, 정적 파일은 통과
  if (
    pathname.startsWith('/login') ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next();
  }

  const auth = request.cookies.get('site_auth');

  if (auth?.value !== 'authenticated') {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
