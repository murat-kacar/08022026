import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/jwt';

const PROTECTED_PATHS = ['/admin', '/app/api/events', '/app/api/instructors', '/app/api/applications'];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only protect admin paths and protected API endpoints
  if (PROTECTED_PATHS.some((p) => pathname.startsWith(p))) {
    const token = req.cookies.get('token')?.value;
    if (!token) return NextResponse.redirect(new URL('/admin/login', req.url));
    const valid = await verifyToken(token);
    if (!valid) return NextResponse.redirect(new URL('/admin/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/app/api/:path*']
};
