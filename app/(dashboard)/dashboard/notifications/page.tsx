import Heading from '@/components/heading'
import React, { Suspense } from 'react'

import { Skeleton } from '@/components/ui/skeleton'
import NotificationsFeedSkeleton from './(components)/notifications-feed-skeleton'
import NotificationsFeed from './(components)/notifications-feed'
import Revalidator from './(components)/revalidator'


type Props = {}


export const revalidate = 0


const page = async(props: Props) => {





  return (
    <div>
        <Heading title='Notifications' description='Manage your activities' />
        <Suspense fallback={<NotificationsFeedSkeleton />}><NotificationsFeed /></Suspense>
        <Revalidator />
    </div>
  )
}

export default page