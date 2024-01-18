import prisma from '@/lib/db'
import { getCurrentCompany } from '@/lib/helpers'
import React from 'react'

import Heading from '@/components/heading'

import { notFound, redirect } from 'next/navigation'
import ExtraButton from './(components)/extra-button'
import ExtraFeed from './(components)/extra-feed'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import ErrorHolder from '../../../(components)/error-holder'

type Props = {
    params:{serviceId:string}
}

const page = async({params}: Props) => {
    const company = await getCurrentCompany()
    if(!company) return <ErrorHolder />
    const session = await getServerSession(authOptions)



    const service = await prisma.service.findUnique({where:{
        id:params.serviceId,
        
        ...(session?.user?.name==='Company' &&{entity:{companyId:company?.id}} ),
        ...(session?.user?.name==='Entity' &&{entityId:company?.id} )
     
    },include:{extraOptions:true}})

  

    if(!service) return notFound()
  return (
    <div className=''>
        <div className='flex justify-between items-center'>
        <Heading title='Extra opies' description={`Beheer extra opties voor ${service?.name} `} />
        <ExtraButton />
        </div>
        <div>
            <ExtraFeed serviceId={params.serviceId} />
        </div>

      


      
    </div>
  )
}

export default page