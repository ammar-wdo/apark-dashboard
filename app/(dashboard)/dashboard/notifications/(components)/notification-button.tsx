
'use client'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'


type Props = {
    url:string
}

const NotificationButton = ({url}: Props) => {
    const router=useRouter()
  return (
<Button variant={'link'} className='ml-auto p-0 sm:mr-32' onClick={()=>router.push(url)}>Check</Button>
  )
}

export default NotificationButton