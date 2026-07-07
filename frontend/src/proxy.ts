import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_TOKEN_COOKIE } from '@/lib/constants';

// Optimistic check only (cookie presence) — the backend independently verifies the JWT
// on every admin API request via requireAdmin middleware.
export default function proxy(req: NextRequest) {
  const isLoginPage = req.nextUrl.pathname === '/admin/login';
  const token = req.cookies.get(ADMIN_TOKEN_COOKIE)?.value;

  if (!isLoginPage && !token) {
    return NextResponse.redirect(new URL('/admin/login', req.nextUrl));
  }

  if (isLoginPage && token) {
    return NextResponse.redirect(new URL('/admin', req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
