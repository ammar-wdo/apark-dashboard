import prisma from '@/lib/db'
import { getCurrentCompany } from '@/lib/helpers'
import React from 'react'

import Heading from '@/components/heading'

import { redirect } from 'next/navigation'
import ExtraButton from './(components)/extra-button'
import ExtraFeed from './(components)/extra-feed'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'

type Props = {
    params:{serviceId:string}
}

const page = async({params}: Props) => {
    const currentCompany = await getCurrentCompany()
    const session = await getServerSession(authOptions)



    const service = await prisma.service.findUnique({where:{
        id:params.serviceId,
        
        ...(session?.user?.name==='Company' &&{entity:{companyId:currentCompany?.id}} ),
        ...(session?.user?.name==='Entity' &&{entityId:currentCompany?.id} )
     
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