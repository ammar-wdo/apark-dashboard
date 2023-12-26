import React from 'react'
import MainLinks from './main-links'
import Link from 'next/link'
import { LayoutDashboard } from 'lucide-react'
import MainlinksWrapper from './mainlinks-wrapper'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { getCurrentCompany } from '@/lib/helpers'
import { Company, Entity } from '@prisma/client'

type Props = {}

const MainAside = async(props: Props) => {

 
 

  return (
    <aside className='   flex-col w-full min-h-screen pb-12'>
     
     
     <MainlinksWrapper />

      </aside>
  )
}

export default MainAside