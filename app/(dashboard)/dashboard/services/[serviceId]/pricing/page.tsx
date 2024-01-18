import prisma from '@/lib/db'
import { getCurrentCompany } from '@/lib/helpers'
import React from 'react'
import PricingForm from './(components)/pricing-form'
import Heading from '@/components/heading'
import Control from './(components)/control'
import { notFound, redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import ErrorHolder from '../../../(components)/error-holder'

type Props = {
    params:{serviceId:string}
}

const page = async({params}: Props) => {
  const session = await getServerSession(authOptions)
  const company = await getCurrentCompany()
  if(!company) return <ErrorHolder/>

    const service = await prisma.service.findUnique({where:{
        id:params.serviceId,
        ...(session?.user?.name === "Company" && {
          entity: { companyId: company?.id },
        }),
        ...(session?.user?.name === "Entity" && {
          entityId: company?.id,
        })
     
    }})

    console.log(service?.pricings.length)

    if(!service) return notFound()


  
  return (
    <div className=''>
      <Heading title='Prijzen' description={`Bekijk prijzen voor ${service?.name} `} />

      <PricingForm pricings={service?.pricings! } />

      
    </div>
  )
}

export default page