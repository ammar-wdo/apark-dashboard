import { Notification } from '@prisma/client'
import {format} from 'date-fns'
import Link from 'next/link'

type Props = {
    notification:Notification
}

const NotificationComponent = ({notification}: Props) => {


    const formattedDate = format(new Date(notification.createdAt), 'EEE, MMM/d, HH:mm')
    const url = notification.type==='SERVICE'? `/dashboard/services/${notification.IdHolder}` :''

  return (
    <div className='rounded-lg p-6 border relative flex gap-4 items-center'>
        
        <p className='text-sm text-neutral-600'>{notification.message}</p>
     
       
        <Link href={url} className='hover:underline text-blue-500 text-sm'>Check</Link>
       
        <p className='text-xs text-neutral-500 pt-3 absolute bottom-2 right-3'>{formattedDate}</p>
    
    
    

    </div>
  )
}

export default NotificationComponent