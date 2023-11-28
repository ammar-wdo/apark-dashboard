import prisma from '@/lib/db'
import { getCurrentCompany } from '@/lib/helpers'
import React from 'react'
import PricingForm from './(components)/pricing-form'
import Heading from '@/components/heading'
import Control from './(components)/control'
import { redirect } from 'next/navigation'

type Props = {
    params:{serviceId:string}
}

const page = async({params}: Props) => {
    const currentCompany = await getCurrentCompany()

    const service = await prisma.service.findUnique({where:{
        id:params.serviceId,
     
    }})

    console.log(service?.pricings.length)

    if(!service) return redirect('/dashboard')
  return (
    <div className=''>
      <Heading title='Pricing table' description={`Check Pricing for ${service?.name} `} />

      <PricingForm pricings={service?.pricings! } />

      
    </div>
  )
}

export default page