
import { redirect } from 'next/navigation'
import React from 'react'
import MainAside from './(components)/main-aside'

import MainSheet from './(components)/main-sheet'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'

type Props = {
    children:React.ReactNode,
    params:{companyId:string}
}

const layout = async({children,params}: Props) => {

  const session = await getServerSession(authOptions)

   
  return (
    <div>
     <MainAside />
    <main className='lg:pl-[270px] '>
<MainSheet  isAdmin={session?.user?.name==="Company"} />
   <div className=' p-8 xl:p-20'>{children}</div> 
   </main>
    </div>
  )
}

export default layout