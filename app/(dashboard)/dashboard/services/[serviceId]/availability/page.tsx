import Heading from '@/components/heading'
import prisma from '@/lib/db'
import React from 'react'
import AvailabilityForm from './(components)/availability-form'
import AvailabilityFeed from './(components)/availability-feed'
import AvailabilityTriggerButton from './(components)/availability-trigger-button'
import Ranges from './(components)/ranges'
import { getCurrentCompany } from '@/lib/helpers'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'


type Props = {
    params:{serviceId:string}
}

const page = async({params}: Props) => {
    const currentCompany = await getCurrentCompany()
    if(!currentCompany) throw Error('not authenticated')

    const session = await getServerSession(authOptions)
    let availabilitys

    if(session?.user?.name === "Company"){
        availabilitys = await  prisma.availability.findMany({
            where:{
                service:{id:params.serviceId},
               
            },
            orderBy:{
                createdAt:'desc'
            }
        })
    }else{
        availabilitys = await prisma.availability.findMany({
            where:{
                service:{
                    id:params.serviceId,
                    entityId:currentCompany.id,
                }
            }
        })
    }



  return (
    <div>
        <div className='flex items-center justify-between'>
        <Heading title='Availability'  description='Manage your availability times'/>
        <AvailabilityTriggerButton />

        </div>
      
        
        <AvailabilityFeed availabilitys={availabilitys} />
        <div className='mt-20 '>
            <h3 className='text-center capitalize text-lg font-bold'>Calendar of blocked ranges</h3>
        <Ranges availabilitys={availabilitys} />
        </div>
       
   
      
      

    </div>
  )
}

export default page