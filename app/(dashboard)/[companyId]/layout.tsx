import prisma from '@/lib/db'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {
    children:React.ReactNode,
    params:{companyId:string}
}

const layout = async({children,params}: Props) => {

    const company = await prisma.company.findUnique({
        where:{
id:params.companyId
        }
      
    })


    if(!company) return redirect('/')
  return (
    <div>{children}</div>
  )
}

export default layout