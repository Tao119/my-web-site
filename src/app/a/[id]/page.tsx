'use client'

import { useParams } from 'next/navigation'

const Home = () => {
  const params = useParams()
  return <div style={{ display: 'flex', flexDirection: 'row' }}>{params.id}</div>
}
export default Home
