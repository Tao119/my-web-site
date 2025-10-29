import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    // Only apply middleware to admin routes (except login page)
    if (request.nextUrl.pathname.startsWith('/portfolio/admin') &&
        !request.nextUrl.pathname.endsWith('/portfolio/admin')) {

        const sessionToken = request.cookies.get('admin-session')?.value;

        if (!sessionToken) {
            return NextResponse.redirect(new URL('/portfolio/admin', request.url));
        }

        // Simple token validation (same logic as in auth.ts)
        try {
            const decoded = Buffer.from(sessionToken, 'base64').toString();
            const parts = decoded.split('-');

            if (parts.length !== 3) {
                return NextResponse.redirect(new URL('/portfolio/admin', request.url));
            }

            const timestamp = parseInt(parts[0]);
            const now = Date.now();
            const twentyFourHours = 24 * 60 * 60 * 1000;

            // Check if token is expired
            if (now - timestamp > twentyFourHours) {
                return NextResponse.redirect(new URL('/portfolio/admin', request.url));
            }

            // Check if secret matches
            const sessionSecret = process.env.SESSION_SECRET || 'your-secret-key';
            if (parts[2] !== sessionSecret) {
                return NextResponse.redirect(new URL('/portfolio/admin', request.url));
            }
        } catch {
            return NextResponse.redirect(new URL('/portfolio/admin', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/portfolio/admin/:path*',
};