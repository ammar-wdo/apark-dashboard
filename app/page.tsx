import prisma from '@/lib/db'
import { auth } from '@clerk/nextjs'
import Image from 'next/image'
import { redirect } from 'next/navigation'

export default async function Home() {

  const {userId} = auth()

  const company = await prisma.company.findUnique({
    where:{
      userId:userId as string
    }
  })

  if(!company) return redirect('/register')

 

  return redirect(`/${company.id}`)
}
