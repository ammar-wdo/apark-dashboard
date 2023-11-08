import prisma from '@/lib/db'
import { getCurrentCompany } from '@/lib/helpers'
import React from 'react'
import PricingForm from './(components)/pricing-form'
import Heading from '@/components/heading'

type Props = {
    params:{serviceId:string}
}

const page = async({params}: Props) => {
    const currentCompany = await getCurrentCompany()

    const service = await prisma.service.findUnique({where:{
        id:params.serviceId,
        companyId:currentCompany?.id as string
    }})

    console.log(service?.pricings.length)
  return (
    <div className=''>
      <Heading title='Pricing table' description={`Check Pricing for ${service?.title} `} />
      <PricingForm pricings={service?.pricings! } />
    </div>
  )
}

export default page