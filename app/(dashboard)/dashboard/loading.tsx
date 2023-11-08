import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

type Props = {}

const loading = (props: Props) => {
  return (
    <div className='space-y-8'>
        <div className='space-y-4'>
        <Skeleton className="w-[150px] h-[20px] rounded-full" />
        <Skeleton className="w-[150px] h-[20px] rounded-full" />
        </div>
        <Skeleton className="w-full h-[700px] rounded-md" />
      
       
    </div>
  )
}

export default loading