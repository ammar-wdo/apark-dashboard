'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useModal } from '@/hooks/use-modal'
import { ExraOption } from '@prisma/client'
import { Edit, Trash } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

type Props = {
    extraOption:ExraOption
}

const ExtraCard = ({extraOption}: Props) => {
    const {setOpen} = useModal()

  return (
    <div className='max-w-[300px] w-full text-xs border shadow-md hover:shadow-lg transition'>
        <div className='relative w-full aspect-video'>
            <Image fill alt='option image'  src={extraOption.image} className='object-contain'/>
        </div>
        <div className='p-4 flex flex-col gap-1'>
            <h3>{extraOption.label}</h3>
            <p>{extraOption.description}</p>
          
            <p className='font-bold'>€ {extraOption.price}</p>
            <div className='flex items-center justify-between'>
            {!extraOption.isActive && <Badge className='bg-yellow-500/20 text-yellow-500 rounded-full w-fit hover:bg-yellow-500/50'>Pending</Badge>}
            <p className='p-1 border rounded-md w-fit ml-auto'>{extraOption.available ? "Available" : "Not available"}</p>
            </div>
          

        </div>

        <div className='p-4 flex items-center gap-2'>
            <Button className='flex-1 text-xs' onClick={()=>setOpen('extra-option',{extraOption})}>Edit <Edit  className='ml-3 w-3 h-3'/></Button>
            <Button onClick={()=>setOpen('delete-modal',{url:`/api/service/${extraOption.serviceId}/extra-option/${extraOption.id}`})} className='flex-1 text-xs' variant={'destructive'}>Delete <Trash  className='ml-3 w-3 h-3'/></Button>
        </div>
    </div>
  )
}

export default ExtraCard