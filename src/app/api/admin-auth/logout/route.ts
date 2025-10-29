import { NextResponse } from 'next/server';
import { destroySession } from '@/lib/auth';

export async function POST() {
    try {
        await destroySession();
        return NextResponse.json({ success: true });
    } catch (error) {
        // エラーログを無効化
        return NextResponse.json(
            { error: 'ログアウトに失敗しました' },
            { status: 500 }
        );
    }
}