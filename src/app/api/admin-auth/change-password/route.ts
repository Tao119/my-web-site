import { NextRequest, NextResponse } from 'next/server';
import { changePassword, verifySession } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        // Verify user is authenticated
        const isAuthenticated = await verifySession();
        if (!isAuthenticated) {
            return NextResponse.json(
                { error: '認証が必要です' },
                { status: 401 }
            );
        }

        const { currentPassword, newPassword } = await request.json();

        if (!currentPassword || !newPassword) {
            return NextResponse.json(
                { error: '現在のパスワードと新しいパスワードが必要です' },
                { status: 400 }
            );
        }

        const result = await changePassword(currentPassword, newPassword);

        if (result.success) {
            return NextResponse.json({ success: true, message: 'パスワードが正常に変更されました' });
        } else {
            return NextResponse.json(
                { error: result.error },
                { status: 400 }
            );
        }
    } catch (error) {
        // エラーログを無効化
        return NextResponse.json(
            { error: 'パスワードの変更に失敗しました' },
            { status: 500 }
        );
    }
}