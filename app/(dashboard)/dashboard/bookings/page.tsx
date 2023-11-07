import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import prisma from '@/lib/db'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import React from 'react'

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
    <div className='p-4 '>
        <h3 className='text-4xl uppercase'>bookings</h3>
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12'>{bookings.map((booking)=><Link href={`/dashboard/bookings/${booking.bookingCode}`}><div className='p-6 text-xs overflow-hidden hover:shadow-md transition border rounded-md cursor-pointer'>

        {JSON.stringify(booking)}
    </div></Link>)}</div>
    </div>
  )
}

export default page