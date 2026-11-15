import { FC, ReactNode } from 'react'
import PortalBack from 'src/components/PortalBack'

type Props = {
  children?: ReactNode
}

const GuestLayout: FC<Props> = ({ children }) => {
  return (
    <>
      {children}
      <PortalBack />
    </>
  )
}

export default GuestLayout
