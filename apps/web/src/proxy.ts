import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_ROUTES = ['/', '/login'];
const SESSION_COOKIE_NAME = 'tienda_jb_session';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for static files, api routes, and next internals
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
  const hasToken = request.cookies.has(SESSION_COOKIE_NAME);

  // Redirect unauthenticated users to login
  if (!isPublicRoute && !hasToken) {
    const loginUrl = new URL('/login', request.url);
    // Optionally preserve the intended destination
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from public routes (like login)
  if (isPublicRoute && hasToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Let the request proceed
  return NextResponse.next();
}

export const config = {
  // Apply middleware to all paths except static files and internals
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
