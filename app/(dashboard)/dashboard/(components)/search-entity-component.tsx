import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import prisma from '@/lib/db'
import { getCurrentCompany } from '@/lib/helpers'
import React from 'react'
import SearchDropdown from './search-dropdown'
import { getServerSession } from 'next-auth'
import SearchEntityDropdown from './search-entity-drop-down'

type Props = {
    
    searchParams:string
}

const SearchEntity = async({searchParams}: Props) => {
    let entities

    const session = await getServerSession(authOptions)



    const company = await getCurrentCompany()


  entities = await prisma.entity.findMany({
            where:{
                companyId:company?.id as string,
             
                
            },
            select:{
                id:true,
                entityName:true
            }
        })
    


  return (
    <div>
    <h3 className='pb-1 text-sm text-neutral-500'>Kies een entiteit</h3>
    
   <SearchEntityDropdown entities={entities}  searchParams={searchParams}/>
   </div>
  )
}

export default SearchEntity