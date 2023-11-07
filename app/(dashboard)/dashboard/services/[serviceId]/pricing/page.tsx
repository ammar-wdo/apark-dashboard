import prisma from '@/lib/db'
import { getCurrentCompany } from '@/lib/helpers'
import React from 'react'
import PricingForm from './(components)/pricing-form'

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
    <div className='p-20'>
      <PricingForm pricings={service?.pricings! } />
    </div>
  )
}

export default page