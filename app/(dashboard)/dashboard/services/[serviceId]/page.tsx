import Heading from '@/components/heading'
import prisma from '@/lib/db'
import React from 'react'
import ServiceForm from './(components)/service-form'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { getCurrentCompany } from '@/lib/helpers'

type Props = {params:{serviceId:string}}

const page = async({params}: Props) => {

  const session = await getServerSession(authOptions)
  const entity = await getCurrentCompany()

const service = await prisma.service.findUnique({
   where:{id:params.serviceId} 
})

const airports = await prisma.airport.findMany({select:{id:true,name:true}})
const entities  =await prisma.entity.findMany({select:{id:true,entityName:true}})

  return (
    <div>
        <Heading title={service ? 'Edit your service' : 'Add a service'}  description={service ? 'Customize your service' :'Add your service informations'} />

        <ServiceForm service={service}  airports={airports} entities={entities} isCompany={session?.user?.name === "Company"} entityId={entity?.id}/>


    </div>
  )
}

export default page