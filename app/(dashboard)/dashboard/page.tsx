import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { Button } from '@/components/ui/button'
import prisma from '@/lib/db'

import { getServerSession } from 'next-auth'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React from 'react'
import SignoutButton from './(components)/signout-button'

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
    <div><SignoutButton />
    <div>{JSON.stringify(company)}</div>


   <Link className='block w-fit p-4 bg-red-500' href={`/dashboard/services`}>Add service</Link>

    </div>
  )
}

export default page