// src/app/api/getUserData.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { MySQL } from 'src/lib/mysql';


export async function GET(req: Request, res: NextApiResponse) {
  try {
    const mysql = new MySQL();
    const data = await mysql.Get('SELECT * FROM user;');
    return new Response(JSON.stringify(data));
  } catch (error) {
    console.error('Error fetching user data:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }));
  }
}

export async function POST(req: Request, res: NextApiResponse) {
  try {
    const body = await req.json();
    console.log('POST request', body.name);
    return new Response(JSON.stringify({ message: 'Hello' }));
  } catch (error) {
    console.error('Error processing POST request:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }));
  }
}
