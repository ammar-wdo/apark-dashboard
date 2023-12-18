import React from 'react'
import { DataTable } from './data-table'
import { columnsService } from './columns'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/db'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { getCurrentCompany } from '@/lib/helpers'

type Props = {
  entityId:string | undefined | string[]
}

const ServicesWrapper = async({entityId}: Props) => {

  let services
  const currentCompany = await getCurrentCompany()
  if (!currentCompany) throw Error("Unauthenticated");

    const session = await getServerSession(authOptions)
    if(session?.user?.name === "Entity"){

    
     

        services = await prisma.service.findMany({
          where: {
            entityId:currentCompany?.id
            
          },
         orderBy:{
            createdAt:'desc'
          },include:{
            entity:{select:{airport:{select:{name:true}}}}
          }
        });
      


     
    }else{
      if(entityId){
        services = await prisma.service.findMany({
          where:{
            entityId:entityId as string
          },orderBy:{
            createdAt:'desc'
          },include:{
            entity:{select:{airport:{select:{name:true}}}}
          }
        })
      }else{
        services = await prisma.service.findMany({
          where:{
            entity:{
              companyId:currentCompany?.id
            }
          }
          ,orderBy:{
            createdAt:'desc'
          },include:{
            entity:{select:{airport:{select:{name:true}}}}
          }
        })
      }
     
    }



    
  
    
  return (
    <div className="">
    <DataTable
      columns={columnsService}
      data={services}
   
     
    />
  
  </div>
  )
}

export default ServicesWrapper