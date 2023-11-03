import { Button } from '@/components/ui/button'
import prisma from '@/lib/db'
import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {
    params:{companyId:string}
}

const page = async({params}: Props) => {



const company = await prisma.company.findUnique({where:{
  id:params.companyId
}})

if(!company) return redirect('/')

  return (
    <div><UserButton afterSignOutUrl='/' showName={true} />
    <div>{JSON.stringify(company)}</div>


   <Link className='block w-fit p-4 bg-red-500' href={`${params.companyId}/services`}>Add service</Link>
    </div>
  )
}

export default page