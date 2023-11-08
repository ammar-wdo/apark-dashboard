import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import Heading from '@/components/heading'
import prisma from '@/lib/db'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import React from 'react'
import { DataTable } from './(components)/data-table'
import { columns } from './(components)/columns'

type Props = {
    params:{companyId:string}
}

const page =async ({params}: Props) => {

    const session = await getServerSession(authOptions)

const company = await prisma.company.findUnique({
    where:{
       email:session?.user?.email as string
    },
    include:{
        services:{
            include:{bookings:true}
        },
        
    }
})

const bookings = company?.services.flatMap((service) => service.bookings) || [];



  return (
    <div className=' '>
        <Heading title="Bookings" description="Check your ookings" />
    <div className=''>
        <DataTable columns={columns} data={bookings} />

    </div>
    </div>
  )
}

export default page