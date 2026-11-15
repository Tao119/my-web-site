'use client'
import { useEffect, useState } from 'react'

const Karuta = () => {
  const [userData, setUserData] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/getUserData', {method: 'GET'})
        
        const data = await response.json()
        console.log(data)
        setUserData(data)
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }

    fetchData()
  }, [])

  return (
    <main>
      {/* Render your component using userData */}
      {userData && (
        <div>
          <p>User Data:</p>
          <pre>{JSON.stringify(userData, null, 2)}</pre>
        </div>
      )}
    </main>
  )
}

export default Karuta
