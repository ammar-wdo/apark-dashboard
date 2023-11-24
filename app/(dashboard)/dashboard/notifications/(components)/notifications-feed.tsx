
import React from 'react'
import NotificationComponent from './notification-component'
import { fetchNotifications } from '../(helpers)/fetchNotifications'
import prisma from '@/lib/db'
import { revalidateNotifications } from '../(helpers)/revalidateNotifications'

type Props = {}


export const revalidate = 0
const NotificationsFeed = async(props: Props) => {



 const notifications = await fetchNotifications()
 await revalidateNotifications()



const noNotifications = !notifications.length

  return (
    <div className='max-w-[800px] mt-10 flex flex-col gap-4'>
        {noNotifications && <p className='mt-10'>No notifications</p>}
        {notifications.map((notification)=><NotificationComponent key={notification.id} notification={notification} />)}


    </div>
  )
}

export default NotificationsFeed