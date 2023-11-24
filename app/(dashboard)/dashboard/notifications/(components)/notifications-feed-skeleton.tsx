import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

type Props = {}

const NotificationsFeedSkeleton = (props: Props) => {
  return (
    <div className='flex flex-col gap-4 max-w-[800px] mt-10'>
        {Array(10).fill('').map((el)=><Skeleton key={Date.now()} className='  h-[80px] rounded-lg' />)}
    </div>
  )
}

export default NotificationsFeedSkeleton