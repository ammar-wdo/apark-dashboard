import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import Heading from '@/components/heading'
import prisma from '@/lib/db'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import React from 'react'
import EntitiesTable from './(components)/entitiesTable'
import { getCurrentCompany } from '@/lib/helpers'

type Props = {}

const page = async(props: Props) => {
const session = await getServerSession(authOptions)
const company = await getCurrentCompany()
if (!company) throw Error("Unauthenticated");

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
        <Heading  title='Entities' description='Manage entities'/>
        <div className='mt-20'>
<EntitiesTable  entities={entities} />
        </div>
    </div>
  )
}

export default page