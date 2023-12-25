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

    <div className='w- full flex items-center gap-4 mt-10 flex-wrap'>
        {Array(10).fill('').map((_,i)=><Skeleton key={i} className='w-[375px] h-[475px]' />)}

    </div>
    </div>
  )
}

export default loading