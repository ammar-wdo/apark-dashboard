import React from 'react'
import { DataTable } from './data-table'
import { columnsService } from './columns'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/db'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

type Props = {}

const ServicesWrapper = async(props: Props) => {

    const session = await getServerSession(authOptions)
    const company = await prisma.company.findUnique({
      where: {
        email: session?.user?.email as string,
      },
      include: {
        services: {
        
          orderBy:{
            createdAt:'desc'
          }
        },
        
      },
    });
  
    if (!company) return redirect("/");
  return (
    <div className="">
    <DataTable
      columns={columnsService}
      data={company.services}
   
     
    />
     <Link className="inline-block mt-20" href={`/dashboard/services/new`}><Button>Add service</Button></Link>
  </div>
  )
}

export default ServicesWrapper