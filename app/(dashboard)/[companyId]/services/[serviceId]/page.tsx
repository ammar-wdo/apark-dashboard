import Heading from '@/components/heading'
import prisma from '@/lib/db'
import React from 'react'
import ServiceForm from './(components)/service-form'

type Props = {params:{companyId:string,serviceId:string}}

const page = async({params}: Props) => {

const service = await prisma.service.findUnique({
   where:{id:params.serviceId} 
})

  return (
    <div>
        <Heading title={service ? 'Edit your service' : 'Add a service'}  description={service ? 'Customize your service' :'Add your service informations'} />

        <ServiceForm service={service} />


    </div>
  )
}

export default page