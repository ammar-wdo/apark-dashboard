import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import prisma from '@/lib/db'
import { getCurrentCompany } from '@/lib/helpers'
import React from 'react'
import SearchDropdown from './search-dropdown'

type Props = {
    service:string ,
    searchParams:string
}

const SearchComponent = async({service,searchParams}: Props) => {

    const company = await getCurrentCompany()


    
        const services = await prisma.service.findMany({
            where:{
                companyId:company?.id as string,
             
                
            },
            select:{
                id:true,
                name:true
            }
        })
    


  return (
    <div>
    <h3 className='pb-1 text-sm text-neutral-500'>Choose a service</h3>
    
   <SearchDropdown searchParams={searchParams} services={services} />
   </div>
  )
}

export default SearchComponent