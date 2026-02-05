import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// NOTE: avoid importing Node-only modules (pg, crypto, jose) in middleware
// to prevent edge-runtime errors during startup. Keep middleware lightweight
// and perform deep checks inside API routes instead.

const PROTECTED_PATHS = ['/admin', '/app/api/events', '/app/api/instructors', '/app/api/applications'];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only protect admin paths and protected API endpoints
  // Only protect admin routes except the login page itself to avoid redirect loops
  if (pathname.startsWith('/admin') && pathname !== '/admin/login' && !pathname.startsWith('/admin/login')) {
    const token = req.cookies.get('token')?.value;
    if (!token) return NextResponse.redirect(new URL('/admin/login', req.url));
    // Defer token verification and DB existence checks to server API routes.
    // This keeps middleware Edge-compatible and avoids importing node-only libs.
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/app/api/:path*']
};
