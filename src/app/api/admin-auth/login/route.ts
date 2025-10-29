import { NextRequest, NextResponse } from 'next/server';
import { verifyPassword, createSession, getAdminEmail } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        const { password } = await request.json();

        if (!password) {
            return NextResponse.json(
                { error: 'パスワードが入力されていません' },
                { status: 400 }
            );
        }

        const isValidPassword = await verifyPassword(password);
        if (!isValidPassword) {
            return NextResponse.json(
                { error: 'パスワードが正しくありません' },
                { status: 401 }
            );
        }

        // Create session
        await createSession();

        return NextResponse.json({
            success: true,
            message: 'ログインに成功しました',
            session: {
                email: getAdminEmail(),
                createdAt: new Date().toISOString(),
                expiresAt: new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)).toISOString(), // 7 days
            }
        });
    } catch (error) {
        // エラーログを無効化
        return NextResponse.json(
            { error: 'ログインに失敗しました' },
            { status: 500 }
        );
    }
}