import { NextApiRequest, NextApiResponse } from 'next'
// import { MySQL } from 'src/lib/mysql'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // console.log('sss')
  // const mysql = new MySQL()
  // const data = await mysql.Get('SELECT * FROM user;')
  //res.status(200).json(data)
  res.status(200).json({ name: 'John Doe' })
}
