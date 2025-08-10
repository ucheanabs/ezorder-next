import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isProtected = pathname.startsWith('/admin') || pathname.startsWith('/caterer');
  const isLogin = pathname.startsWith('/admin/login');

  if (!isProtected) return NextResponse.next();
  if (isLogin) return NextResponse.next();

  const authed = req.cookies.get('ez_admin')?.value === '1';
  if (authed) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = '/admin/login';
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/admin/:path*','/caterer/:path*'],
};
