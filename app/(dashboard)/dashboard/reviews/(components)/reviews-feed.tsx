import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import prisma from '@/lib/db'
import { getCurrentCompany } from '@/lib/helpers'
import { getServerSession } from 'next-auth'
import React from 'react'
import { DataTable } from './reviews-table'
import { reviewColumns } from './reviews-colums'
import { Review } from '@prisma/client'

type Props = {}

const ReviewsFeed =async (props: Props) => {

    let reviews

    const session = await getServerSession(authOptions)
    const company = await getCurrentCompany()

    if(session?.user?.name ==='Company'){
        reviews = await prisma.review.findMany({
            where:{
                entity:{companyId:company?.id},
                
            },include:{booking:{select:{firstName:true,lastName:true,email:true}}}
            
        })
    }else if(session?.user?.name === 'Entity'){
        reviews = await prisma.review.findMany({
            where:{
                entityId:company?.id
            },include:{booking:{select:{firstName:true,lastName:true,email:true}}}
        })
    }




  return (
    <div>
        <DataTable columns={reviewColumns} data={reviews!} />
    </div>
  )
}

export default ReviewsFeed
