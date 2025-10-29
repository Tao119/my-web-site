// src/app/api/getUserData.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { MySQL } from 'src/lib/mysql';


export async function GET(req: Request, res: NextApiResponse) {
  try {
    const mysql = new MySQL();
    const data = await mysql.Get('SELECT * FROM user;');
    return new Response(JSON.stringify(data));
  } catch (error) {
    // エラーログを無効化
    return new Response(JSON.stringify({ error: 'Internal Server Error' }));
  }
}

export async function POST(req: Request, res: NextApiResponse) {
  try {
    const body = await req.json();
    // ログ出力を無効化
    return new Response(JSON.stringify({ message: 'Hello' }));
  } catch (error) {
    // エラーログを無効化
    return new Response(JSON.stringify({ error: 'Internal Server Error' }));
  }
}
