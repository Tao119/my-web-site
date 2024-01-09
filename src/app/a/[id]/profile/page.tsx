'use client'

import { useParams } from 'next/navigation'

const Home = () => {
  const params = useParams()
  return <div style={{ display: 'flex', flexDirection: 'row' }}>{`${params.id}'s profile`}</div>
}
export default Home
