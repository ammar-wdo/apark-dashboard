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
<div className='flex flex-col sm:flex-row gap-8 max-w-[1200px]'>
<Skeleton className='flex-1 min-h-[1200px]' />
<Skeleton className='flex-1 max-h-[800px]' />
</div>
   
    </div>
  )
}

export default loading