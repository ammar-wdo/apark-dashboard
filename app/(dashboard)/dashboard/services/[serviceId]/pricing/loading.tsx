import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

type Props = {}

const loading = async(props: Props) => {


  
  return (
    <div className='space-y-8'>
         <div className='space-y-4'>
        <Skeleton className="w-[150px] h-[20px] rounded-full" />
        <Skeleton className="w-[150px] h-[20px] rounded-full" />
        </div>
  
        <div className='space-y-12 w-full max-w-[1600px] mx-auto border '>
        <Skeleton className="w-full h-[40px] rounded-sm" />
        <Skeleton className="w-full h-[40px] rounded-sm" />
        <Skeleton className="w-full h-[40px] rounded-sm" />
        <Skeleton className="w-full h-[40px] rounded-sm" />
        <Skeleton className="w-full h-[40px] rounded-sm" />
        <Skeleton className="w-full h-[40px] rounded-sm" />
        <Skeleton className="w-full h-[40px] rounded-sm" />
        <Skeleton className="w-full h-[40px] rounded-sm" />
        <Skeleton className="w-full h-[40px] rounded-sm" />
        <Skeleton className="w-full h-[40px] rounded-sm" />
        <Skeleton className="w-full h-[40px] rounded-sm" />
        <Skeleton className="w-full h-[40px] rounded-sm" />
        <Skeleton className="w-full h-[40px] rounded-sm" />
     
        </div>
       
       
      
       
  
    </div>
  )
}

export default loading