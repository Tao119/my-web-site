import { NextRequest, NextResponse } from 'next/server';

// Simple session validation function
function validateSessionToken(token: string): boolean {
    try {
        const decoded = Buffer.from(token, 'base64').toString();
        const parts = decoded.split('-');
        if (parts.length !== 3) return false;

        const timestamp = parseInt(parts[0]);
        const now = Date.now();
        const sevenDays = 7 * 24 * 60 * 60 * 1000; // 7 days

        // Check if token is not expired (7 days)
        if (now - timestamp > sevenDays) return false;

        // Check if secret matches
        const SESSION_SECRET = process.env.SESSION_SECRET || 'your-secret-key-change-in-production';
        return parts[2] === SESSION_SECRET;
    } catch {
        return false;
    }
}

export async function GET(request: NextRequest) {
    try {
        // Get cookie directly from request
        const cookieHeader = request.headers.get('cookie');
        let token = null;

        if (cookieHeader) {
            const cookies = cookieHeader.split(';').map(c => c.trim());
            const sessionCookie = cookies.find(c => c.startsWith('admin-session='));
            if (sessionCookie) {
                token = decodeURIComponent(sessionCookie.split('=')[1]);
            }
        }

        if (!token || !validateSessionToken(token)) {
            return NextResponse.json(
                { authenticated: false, error: 'No valid session found' },
                { status: 401 }
            );
        }

        // Extract session info from token
        const decoded = Buffer.from(token, 'base64').toString();
        const parts = decoded.split('-');
        const timestamp = parseInt(parts[0]);
        const createdAt = new Date(timestamp);
        const expiresAt = new Date(timestamp + (7 * 24 * 60 * 60 * 1000)); // 7 days

        return NextResponse.json({
            authenticated: true,
            session: {
                email: 'tao.dama.art@gmail.com',
                createdAt: createdAt.toISOString(),
                expiresAt: expiresAt.toISOString(),
            }
        });
    } catch (error) {
        // エラーログを無効化
        return NextResponse.json(
            { authenticated: false, error: 'Server error' },
            { status: 500 }
        );
    }
}