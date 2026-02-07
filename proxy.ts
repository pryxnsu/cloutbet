import { NextResponse, type NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export default async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = request.nextUrl;

  const isAuthPage = pathname === '/login';
  const isProtectedRoute = ['/feed', '/leaderboard', '/feedback', '/settings'].some(route =>
    pathname.startsWith(route)
  );

  if (!token && isProtectedRoute) {
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  if (token && isAuthPage) {
    const callbackUrl = request.nextUrl.searchParams.get('callbackUrl');
    const redirectUrl = callbackUrl || '/feed';
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/feed/:path*', '/leaderboard/:path*', '/feedback/:path*', '/settings/:path*'],
};
