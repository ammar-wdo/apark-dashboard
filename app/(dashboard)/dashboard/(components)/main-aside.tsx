import React from 'react'
import MainLinks from './main-links'
import Link from 'next/link'
import { LayoutDashboard } from 'lucide-react'
import MainlinksWrapper from './mainlinks-wrapper'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'

type Props = {}

const MainAside = async(props: Props) => {

  const session = await getServerSession(authOptions)
 

  return (
    <aside className=' border-r fixed hidden lg:flex flex-col lg:w-[270px] min-h-screen pb-12'>
      <div className='p-6 border-b'>
        <h3 className='text-foreground font-bold capitalize'>
          {session?.user?.name}
        </h3>
        <p className='text-sm text-muted-foreground '>
          {session?.user?.email}
        </p>

      </div>
     
     <MainlinksWrapper />

      </aside>
  )
}

export default MainAside