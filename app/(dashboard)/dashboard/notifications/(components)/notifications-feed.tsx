
import React from 'react'
import NotificationComponent from './notification-component'
import { fetchNotifications } from '../(helpers)/fetchNotifications'
import prisma from '@/lib/db'
import { revalidateNotifications } from '../(helpers)/revalidateNotifications'
import { fetchCount } from '../(helpers)/getchCount'
import Controller from './controller'
import Scroller from './scroller'

type Props = {list:string }


export const revalidate = 0
const NotificationsFeed = async({list}: Props) => {



 const notifications = await fetchNotifications(list)
 await revalidateNotifications()
 const count = await fetchCount()



const noNotifications = !notifications.length

const showController = count > 12 * +list

  return (
    <div className='max-w-[800px] mt-10 flex flex-col gap-2'>
        {noNotifications && <p className='mt-10'>Geen notificaties</p>}
        {notifications.map((notification)=><NotificationComponent key={notification.id} notification={notification} />) }
        {showController && <Controller list={list} />}
        <Scroller  />


    </div>
  )
}

export default NotificationsFeed