import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

type Props = {}

const loading = (props: Props) => {
  return (
    <div>
         <div className='space-y-2 mb-6'>
        <Skeleton className='text-3xl first-letter:uppercase font-bold w-[100px] p-2'/>
        <Skeleton className='text-sm text-muted-foreground p-2 w-[200px]'/>
    </div>

   <Skeleton className='w-full min-h-[500px]' />
   <Skeleton className='w-full min-h-[500px] mt-4' />
    </div>
  )
}

export default loading