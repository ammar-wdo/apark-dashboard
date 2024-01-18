import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import Heading from '@/components/heading'
import prisma from '@/lib/db'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import React from 'react'
import EntitiesTable from './(components)/entitiesTable'
import { getCurrentCompany } from '@/lib/helpers'
import ErrorHolder from '../(components)/error-holder'

type Props = {}

const page = async(props: Props) => {
const session = await getServerSession(authOptions)
const company = await getCurrentCompany()
if(!company) return <ErrorHolder />

if(session?.user?.name !=="Company") return redirect('/')

const entities = await prisma.entity.findMany({
    where:{
        companyId:company?.id,
        
        
    },
    include:{
        airport:{select:{
            name:true
        }}
    }
})

  return (
    <div>
        <Heading  title='Entiteit' description='Beheer entiteiten'/>
        <div className='mt-8'>
<EntitiesTable  entities={entities} />
        </div>
    </div>
  )
}

export default page