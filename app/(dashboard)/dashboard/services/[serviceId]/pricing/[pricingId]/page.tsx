import Heading from '@/components/heading'
import prisma from '@/lib/db'
import { notFound } from 'next/navigation'
import React from 'react'
import ListForm from './(components)/list-form'

type Props = {params:{pricingId:string,serviceId:string}}

const page = async({params}: Props) => {

    const list = await prisma.list.findUnique({
        where:{
            id:params.pricingId,
            serviceId:params.serviceId
        }
    })
    if(!list && params.pricingId !=='new') return  notFound()

  return (
    <div>
<Heading title={list ? 'Lijst bewerken' : 'Lijst maken'} description='Beheer lijst' />

<div>
    <ListForm  list={list}/>
</div>

    </div>
  )
}

export default page