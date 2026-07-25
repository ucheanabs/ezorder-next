import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  // The live command overview is intentionally demo-accessible. Mutating
  // event-management routes remain protected.
  const protectedAdminRoute =
    pathname.startsWith('/admin/create') || pathname.startsWith('/admin/events/');
  if (protectedAdminRoute) {
    const ok = req.cookies.get('ez_admin_ok')?.value === '1';
    if (!ok) {
      const url = req.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};

