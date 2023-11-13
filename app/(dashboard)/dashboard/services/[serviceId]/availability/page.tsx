import Heading from '@/components/heading'
import prisma from '@/lib/db'
import React from 'react'
import AvailabilityForm from './(components)/availability-form'
import AvailabilityFeed from './(components)/availability-feed'

type Props = {
    params:{serviceId:string}
}

const page = async({params}: Props) => {

const availabilitys = await  prisma.availability.findMany({
    where:{
        serviceId:params.serviceId
    }
})

  return (
    <div>
        <Heading title='Availability'  description='Manage your availability times'/>
        <AvailabilityFeed availabilitys={availabilitys} />
        <AvailabilityForm serviceId={params.serviceId} />
        <div className='mt-20'>
          
        </div>
      

    </div>
  )
}

export default page