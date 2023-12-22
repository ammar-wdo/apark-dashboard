import React from 'react'
import MainLinks from './main-links'
import Link from 'next/link'
import { LayoutDashboard } from 'lucide-react'
import MainlinksWrapper from './mainlinks-wrapper'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { getCurrentCompany } from '@/lib/helpers'

type Props = {}

const MainAside = async(props: Props) => {

  const session = await getServerSession(authOptions)
  const company = await getCurrentCompany()

  const theName = session?.user?.name ==='Company' ? company.name : company.entityName
 

  return (
    <aside className=' border-r fixed hidden lg:flex flex-col lg:w-[270px] min-h-screen pb-12'>
      <div className='p-6 py-4 border-b'>
    
        <h3 className='text-foreground font-bold capitalize'>
          {session?.user?.name}
        </h3>
   
    <p className='text-muted-foreground first-letter:capitalize text-xs font-semibold mt-1'>{theName}</p>
       
        <p className='text-muted-foreground text-xs'>
          {session?.user?.email}
        </p>

      </div>
     
     <MainlinksWrapper />

      </aside>
  )
}

export default MainAside