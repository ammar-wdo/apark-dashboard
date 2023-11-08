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
    <div className='space-y-8 md:space-y-0 flex flex-col md:flex-row justify-center gap-20'>
        <div className='space-y-12 w-full'>
        <Skeleton className="w-full h-[40px] rounded-full" />
        <Skeleton className="w-full h-[40px] rounded-full" />
        <Skeleton className="w-full h-[40px] rounded-full" />
        <Skeleton className="w-full h-[40px] rounded-full" />
        <Skeleton className="w-full h-[40px] rounded-full" />
        <Skeleton className="w-full h-[40px] rounded-full" />
        <Skeleton className="w-full h-[40px] rounded-full" />
        <Skeleton className="w-full h-[40px] rounded-full" />
        <Skeleton className="w-full h-[40px] rounded-full" />
     
        </div>
        <div className='space-y-12 w-full'>
        <Skeleton className="w-full h-[40px] rounded-full" />
        <Skeleton className="w-full h-[40px] rounded-full" />
        <Skeleton className="w-full h-[40px] rounded-full" />
        <Skeleton className="w-full h-[40px] rounded-full" />
        <Skeleton className="w-full h-[40px] rounded-full" />
        <Skeleton className="w-full h-[40px] rounded-full" />
        <Skeleton className="w-full h-[40px] rounded-full" />
        <Skeleton className="w-full h-[40px] rounded-full" />
        <Skeleton className="w-full h-[40px] rounded-full" />
       
        </div>
       
      
       
    </div>
    </div>
  )
}

export default loading