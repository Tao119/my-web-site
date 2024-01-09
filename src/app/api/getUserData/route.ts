// src/app/api/getUserData.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { MySQL } from 'src/lib/mysql';


export async function GET(_: Request, res: NextApiResponse) {
  try {
    const mysql = new MySQL();
    const data = await mysql.Get('SELECT * FROM user;');
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching user data:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function POST(req: Request, res: NextApiResponse) {
  try {
    const body = await req.json();
    console.log('POST request', body.name);
    return res.status(200).json({ message: 'Hello Worldy' });
  } catch (error) {
    console.error('Error processing POST request:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
