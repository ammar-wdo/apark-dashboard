import prisma from '@/lib/db'
import { getCurrentCompany } from '@/lib/helpers'
import React, { Suspense } from 'react'
import PricingForm from './(components)/pricing-form'
import Heading from '@/components/heading'
import Control from './(components)/control'
import { notFound, redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import ErrorHolder from '../../../(components)/error-holder'
import ListFeed from './(components)/lists-feed'
import { Skeleton } from '@/components/ui/skeleton'

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

     
<div className='mt-12'>
  <Suspense fallback={<Skeleton className='h-[300px] w-full rounded-lg ' />}>
  <ListFeed serviceId={params.serviceId} />
  </Suspense>

</div>

<div className='mt-32'>
  <Heading title={'Base pricings list'} description='Default list as a fallback in case no specified lists added.' />
<PricingForm pricings={service?.pricings! } />
</div>
      
    </div>
  )
}

export default page