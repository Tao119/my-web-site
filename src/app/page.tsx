import Link from 'next/link'
import { Dispatch, SetStateAction, useContext } from 'react'

const Page = () => {
  

  return (
    <div className="p-home" style={{padding:"100px"}}>
      <Link
        href="molkky"
        style={{fontSize:"30px"}}
      >
       MOLKKY
      </Link>
      
    </div>
  )
}
export default Page;