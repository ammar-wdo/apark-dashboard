import Image from 'next/image'

import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]/options'
import { redirect } from 'next/navigation'
import LoginForm from './(components)/login-form'

export default async function Home() {


  const session =await getServerSession(authOptions)

  if(session?.user) return redirect('/dashboard')
  return (
    <main className='h-screen flex items-center justify-center'>
  <LoginForm />
    </main>
  )
}

