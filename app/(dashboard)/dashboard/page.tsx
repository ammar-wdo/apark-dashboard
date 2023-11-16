import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { Button } from '@/components/ui/button'
import prisma from '@/lib/db'

import { getServerSession } from 'next-auth'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React from 'react'
import SignoutButton from './(components)/signout-button'
import Heading from '@/components/heading'

type Props = {
    
}

const page = async() => {



const session = await getServerSession(authOptions)

const company = await prisma.company.findUnique({
  where:{
    email:session?.user?.email as string
  }
})



  return (
    <div>
   <Heading title='Dashboard' description='Manage your account'  />

    </div>
  )
}

export default page