import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

type Props = {}

const ServiceCardSceleton = (props: Props) => {
  return (
    <div className='space-y-4 '>
    <Skeleton className=" aspect-square" />
    <div className='p-2 space-y-2'>
    <Skeleton className="w-[70px] py-2 " />
    <Skeleton className="w-[150px] py-2 " />
   
    <Skeleton className="w-[150px] py-2 " />
    <Skeleton className="w-[150px] py-2 " />
    <div className='flex items-center justify-end gap-2'>
      <Button variant={"secondary"} ></Button>
       <Button variant={"secondary"}></Button>
    
    </div>
    </div>

 
</div>
  )
}

export default ServiceCardSceleton