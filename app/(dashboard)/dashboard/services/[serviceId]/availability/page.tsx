import Heading from '@/components/heading'
import prisma from '@/lib/db'
import React from 'react'
import AvailabilityForm from './(components)/availability-form'
import AvailabilityFeed from './(components)/availability-feed'
import AvailabilityTriggerButton from './(components)/availability-trigger-button'
import Ranges from './(components)/ranges'


type Props = {
    params:{serviceId:string}
}

const page = async({params}: Props) => {

const availabilitys = await  prisma.availability.findMany({
    where:{
        serviceId:params.serviceId
    },
    orderBy:{
        createdAt:'desc'
    }
})

  return (
    <div>
        <div className='flex items-center justify-between'>
        <Heading title='Availability'  description='Manage your availability times'/>
        <AvailabilityTriggerButton />

        </div>
      
        
        <AvailabilityFeed availabilitys={availabilitys} />
        <div className='mt-20'>
            <h3 className='text-center capitalize text-lg font-bold'>Calendar of blocked ranges</h3>
        <Ranges availabilitys={availabilitys} />
        </div>
       
   
      
      

    </div>
  )
}

export default page