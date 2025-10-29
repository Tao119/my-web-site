import { NextRequest, NextResponse } from 'next/server';

// Admin database API endpoint
export async function GET(request: NextRequest) {
    try {
        return NextResponse.json({
            message: "Admin DB API is working!",
            timestamp: new Date().toISOString(),
            status: "success"
        });
    } catch (error) {
        // エラーログを無効化
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        return NextResponse.json({
            message: "Admin DB POST API is working!",
            data: body,
            timestamp: new Date().toISOString(),
            status: "success"
        });
    } catch (error) {
        // エラーログを無効化
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// Test function
async function testFunction() {
    return {
        message: "Admin API is working!",
        timestamp: new Date().toISOString()
    };
}