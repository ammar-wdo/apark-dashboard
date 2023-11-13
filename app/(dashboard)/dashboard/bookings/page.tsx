import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import Heading from '@/components/heading'
import prisma from '@/lib/db'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import React from 'react'
import { DataTable } from './(components)/data-table'
import { columns } from './(components)/columns'
import { redirect } from 'next/navigation'

type Props = {
    params:{companyId:string}
    searchParams:{[key:string]:string | string[] | undefined}
}

const page =async ({params,searchParams}: Props) => {
    if(!searchParams.page){
        searchParams.page="0"
    }

    if(+searchParams.page < 0 ){
        redirect('/')
    }
    console.log(searchParams)

    const session = await getServerSession(authOptions)

const company = await prisma.company.findUnique({
    where:{
       email:session?.user?.email as string,
       
       
    },
    
    include:{
        services:{
            include:{bookings:{
                take:4,
                skip:4* +searchParams.page,
                orderBy:{
                    createdAt:"desc"
                },
                include:{service:true}
            }}
        },
        
        
    },
    
    
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