// app/middleware.js

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function middleware(req) {
  const session = await getServerSession(authOptions);

  const isProtectedPath = req.nextUrl.pathname.startsWith('/dashboard') || req.nextUrl.pathname === '/register';

  if (isProtectedPath && !session) {
    // Redirect to login page if user is not logged in
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next(); // Allow the request to continue if session exists
}

// Specify the paths where the middleware should run
export const config = {
  matcher: ['/dashboard/:path*', '/register'], // Match all dashboard paths and the /register path
};
