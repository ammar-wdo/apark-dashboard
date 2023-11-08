
import { redirect } from 'next/navigation'
import React from 'react'
import MainAside from './(components)/main-aside'
import MainNav from './(components)/main-nav'

type Props = {
    children:React.ReactNode,
    params:{companyId:string}
}

const layout = async({children,params}: Props) => {

   
  return (
    <div>
     <MainAside />
    <main className='2xl:pl-[400px] pl-[250px]'>
   <MainNav />
   <div className=' p-8 xl:p-20'>{children}</div> 
   </main>
    </div>
  )
}

export default layout