import { Button } from '@/components/ui/button'
import prisma from '@/lib/db'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

type Props = {
    serviceId:string,
    companyId:string
}

const ServiceCard = async({serviceId,companyId}: Props) => {


    const service = await prisma.service.findUnique({
        where:{
            id:serviceId,companyId:companyId
        }
    })






  return (
    <div key={serviceId} className='flex flex-col border rounded-md overflow-hidden group'>
        <div className='relative aspect-video overflow-hidden'>
            <Image fill src={service?.logo as string} alt='logo' className='object-cover group-hover:scale-110 group-hover:rotate-3 duration-300' />
        </div>
        <div className='p-2 space-y-1'>
        <p className='font-semibold text-2xl uppercase'>{service?.title}</p>
        <p className='text-muted-foreground text-sm line-clamp-1'> {service?.description}</p>
       
        <p className='text-muted-foreground text-sm line-clamp-1'> {service?.city}</p>
        <p className='text-muted-foreground text-sm line-clamp-1'> {service?.available}</p>
        <p className='text-muted-foreground text-sm line-clamp-1 flex items-center gap-x-1'>Active: {service?.isActive ? 'True' : 'False'}</p>
        <p className='text-muted-foreground text-sm line-clamp-1  flex items-center flex-wrap gap-x-1 '> {service?.facilities.map((facility=><span className='capitalize text-xs p-1 border rounded-md'>{facility}</span>))}</p>
       
        </div>
        <div className='flex items-center justify-end gap-2 mt-auto p-2  flex-col'>
            <Link href={`/dashboard/services/${service?.id}/pricing`}  className='w-full'><Button className="w-full" >Manage pricings</Button></Link>
            <Link href={`/dashboard/services/${service?.id}/availability`}  className='w-full'><Button variant={'secondary'} className="w-full" >Manage availability</Button></Link>
            <Link href={`/dashboard/services/${service?.id}/rules`}  className='w-full'><Button variant={"secondary"} className='w-full'>Manage rules</Button></Link>
            <Link href={`/dashboard/services/${service?.id}`}  className='w-full'><Button variant={"secondary"} className='w-full'>Edit</Button></Link>
        
        </div>
   
     
    </div>
  )
}

export default ServiceCard