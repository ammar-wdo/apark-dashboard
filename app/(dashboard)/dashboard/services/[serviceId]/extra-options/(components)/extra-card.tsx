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
    <div className='max-w-[375px] w-full text-xs border transition flex flex-col separate'>
        <div className='relative w-full aspect-video'>
            {extraOption.image ?<Image fill alt='option image'  src={extraOption.image} className='object-contain'/> : <div className='w-full h-full bg-gray-50' />}
        </div>
        <div className='p-4 flex flex-col gap-1 flex-1'>
            <h3 className='font-semibold text-xl first-letter:capitalize'>{extraOption.label}</h3>
            <p className='line-clamp-1'>{extraOption.description}</p>
          
           
            <div className='flex items-center justify-between mt-6 mb-4'>
            {!extraOption.isActive && <Badge className='bg-yellow-500/20 text-yellow-500 rounded-full w-fit hover:bg-yellow-500/50 '>In behandeling</Badge>}
            <p className='p-1 border rounded-md w-fit ml-auto'>{extraOption.available ? "Beschikbaar" : "Niet Beschikbaar"}</p>
            </div>
            <p className='font-bold mt-auto'>€ {extraOption.price}</p>

        </div>
       

        <div className='p-4 flex items-center gap-2 '>
            <Button className='flex-1 text-xs' onClick={()=>setOpen('extra-option',{extraOption})}>bewerken <Edit  className='ml-3 w-3 h-3'/></Button>
            <Button onClick={()=>setOpen('delete-modal',{url:`/api/service/${extraOption.serviceId}/extra-option/${extraOption.id}`})} className='flex-1 text-xs' variant={'destructive'}>verwijderen <Trash  className='ml-3 w-3 h-3'/></Button>
        </div>
    </div>
  )
}

export default ExtraCard