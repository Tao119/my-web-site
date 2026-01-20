import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // コンバージョンデータをログに記録
        console.log('[Conversion API] Received conversion data:', {
            timestamp: new Date().toISOString(),
            data: body,
        });

        // ここで実際のコンバージョン処理を行う
        // 例: データベースに保存、外部APIに送信、など

        // 成功レスポンスを返す
        return NextResponse.json({
            success: true,
            message: 'Conversion recorded successfully',
            timestamp: new Date().toISOString(),
        }, { status: 200 });

    } catch (error) {
        console.error('[Conversion API] Error processing conversion:', error);

        return NextResponse.json({
            success: false,
            message: 'Failed to record conversion',
            error: error instanceof Error ? error.message : 'Unknown error',
        }, { status: 500 });
    }
}

// OPTIONSメソッドをサポート（CORS対応）
export async function OPTIONS(request: NextRequest) {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
}
