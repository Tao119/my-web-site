// src/app/api/getUserData.ts
import { MySQL } from 'src/lib/mysql'

export async function GET(request) {
  try {
    const mysql = new MySQL()
    const data = await mysql.Get('SELECT * FROM user;')
    return new Response(JSON.stringify(data), { status: 200 })
  } catch (error) {
    console.error('Error fetching user data:', error)
    return new Response(JSON.stringify({ error: error }), { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    console.log('POST request', body.name)
    return new Response(JSON.stringify({ message: 'Hello Worldy' }), { status: 200 })
  } catch (error) {
    console.error('Error processing POST request:', error)
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 })
  }
}
