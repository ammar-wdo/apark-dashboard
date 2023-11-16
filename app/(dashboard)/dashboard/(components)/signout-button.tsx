'use client'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'


type Props = {}

const SignoutButton = (props: Props) => {
    const router = useRouter()
const signout = async()=>{
   await signOut()
   router.refresh()


}

  return (
    <button  className='link' onClick={signout}><LogOut className='h-4 w-4 mr-3' />Signout</button>
  )
}

export default SignoutButton