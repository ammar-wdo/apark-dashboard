'use client'
import { Button } from '@/components/ui/button'
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
    <Button size={'sm'} onClick={signout}>Signout</Button>
  )
}

export default SignoutButton