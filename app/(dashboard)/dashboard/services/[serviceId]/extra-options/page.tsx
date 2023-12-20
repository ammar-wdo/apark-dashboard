import prisma from '@/lib/db'
import { getCurrentCompany } from '@/lib/helpers'
import React from 'react'

import Heading from '@/components/heading'

import { redirect } from 'next/navigation'
import ExtraButton from './(components)/extra-button'
import ExtraFeed from './(components)/extra-feed'

type Props = {
    params:{serviceId:string}
}

const page = async({params}: Props) => {
    const currentCompany = await getCurrentCompany()

    const service = await prisma.service.findUnique({where:{
        id:params.serviceId,
     
    },include:{extraOptions:true}})

  

    if(!service) return redirect('/dashboard')
  return (
    <div className=''>
        <div className='flex justify-between items-center'>
        <Heading title='Extra options' description={`Manage extra options for ${service?.name} `} />
        <ExtraButton />
        </div>
        <div>
            <ExtraFeed serviceId={params.serviceId} />
        </div>

      


      
    </div>
  )
}

export default page