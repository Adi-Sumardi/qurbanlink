import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-email'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public live dashboard
  if (pathname.startsWith('/live/')) {
    return NextResponse.next();
  }

  // Static files and API routes pass through
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
