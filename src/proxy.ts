import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
    const refreshToken = request.cookies.get('refreshToken');
    const { pathname } = request.nextUrl;

    // Define public paths
    const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup');
    const isPublicApi = pathname.startsWith('/api/v1/auth'); // If we have local API routes

    if (isAuthPage) {
        if (refreshToken) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
        return NextResponse.next();
    }

    // Protected routes check
    // For simplicity, everything except /login and /signup is protected in this internal app
    if (!refreshToken && !isPublicApi && pathname !== '/') {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

// Optional: config for matching paths
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
