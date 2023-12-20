import prisma from '@/lib/db'
import React from 'react'
import ExtraCard from './extra-card'

type Props = {
    serviceId:string
}

const ExtraFeed = async({serviceId}: Props) => {


    const service = await prisma.service.findUnique({
        where:{
            id:serviceId
        },
        include:{
            extraOptions:true
        }
    })
  return (
    <div>
        {!service?.extraOptions.length && <p className='text-3xl font-bold text-neutral-500 capitalize text-center'>No extra services</p>}
        <div className='flex flex-wrap items-center gap-4'>
            {service?.extraOptions.map(extra=><ExtraCard key={extra.id} extraOption={extra} />)}
        </div>
    </div>
  )
}

export default ExtraFeed