
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {
    children:React.ReactNode,
    params:{companyId:string}
}

const layout = async({children,params}: Props) => {

   
  return (
    <div>{children}</div>
  )
}

export default layout