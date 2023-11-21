import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import prisma from '@/lib/db'
import { getCurrentCompany } from '@/lib/helpers'
import React from 'react'
import SearchDropdown from './search-dropdown'
import { getServerSession } from 'next-auth'

type Props = {
    service:string ,
    searchParams:string
}

const SearchComponent = async({service,searchParams}: Props) => {
    let services

    const session = await getServerSession(authOptions)



    const company = await getCurrentCompany()


    if(session?.user?.name === "Entity")
       {  services = await prisma.service.findMany({
            where:{
                entityId:company?.id as string,
             
                
            },
            select:{
                id:true,
                name:true
            }
        })}else{
            services = await prisma.service.findMany({
                where:{
                    entity:{
                        companyId:company?.id 
                    }
                }
            })
        }
    


  return (
    <div>
    <h3 className='pb-1 text-sm text-neutral-500'>Choose a service</h3>
    
   <SearchDropdown searchParams={searchParams} services={services} />
   </div>
  )
}

export default SearchComponent