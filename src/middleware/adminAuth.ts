import { NextRequest, NextResponse } from 'next/server'

export function adminAuthMiddleware(request: NextRequest) {
    // 管理画面のパスをチェック
    if (request.nextUrl.pathname.startsWith('/api/admin')) {
        // 簡単な認証チェック（実際にはJWTトークンなどを使用）
        const authHeader = request.headers.get('authorization')
        const adminPassword = process.env.ADMIN_PASSWORD

        if (!authHeader || !adminPassword) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        // Basic認証またはトークン認証をここで実装
        // 現在は簡単なパスワードチェックのみ
        const token = authHeader.replace('Bearer ', '')
        if (token !== adminPassword) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }
    }

    return NextResponse.next()
}