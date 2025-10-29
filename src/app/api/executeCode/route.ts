// pages/api/execute-code.ts
import { NextResponse } from 'next/server';
import { runInNewContext } from 'vm';

export async function POST(request: Request) {
  try {
    // const { code } = body;
    const sandbox = { console };

    // const output = runInNewContext(code, sandbox);

    // return NextResponse.json({ output });
  } catch (error) {
    // エラーログを無効化
    // return NextResponse.json({ error: body }, { status: 50 });
  }
}
