import Heading from '@/components/heading'
import prisma from '@/lib/db'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {
  params:{companyId:string}
}

const page =async({params}: Props) => {

  const company = await prisma.company.findUnique({
    where:{
      id:params.companyId
    },
    include:{
      services:true
    }
  })

  if(!company) return redirect('/')
  return (
    <div className='p-32 '>
      <Heading title='Services' description='Manage your services' />

      {company.services.length ===0 && <div>no services added</div>}


      <Link href={`/${company.id}/services/new`}>Add service</Link>


    </div>
  )
}

export default page