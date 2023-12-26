import React from 'react'
import MainLinks from './main-links'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { getCurrentCompany } from '@/lib/helpers'
import { Company, Entity } from '@prisma/client'

type Props = {}

const MainlinksWrapper = async(props: Props) => {

  const session = await getServerSession(authOptions)
  const company = await getCurrentCompany() as Company | Entity
  

  const theName = session?.user?.name ==='Company' ? (company as Company)?.name : (company as Entity)?.entityName


    
  return (
    <MainLinks isAdmin = {session?.user?.name==="Company"} theName={theName} email={company.email} name={session?.user?.name ||''} />
  )
}

export default MainlinksWrapper