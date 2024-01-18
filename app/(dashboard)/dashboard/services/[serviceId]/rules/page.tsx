import Heading from '@/components/heading'
import prisma from '@/lib/db'
import { getCurrentCompany } from '@/lib/helpers'
import React from 'react'
import RuleTriggerButton from './(components)/rules-trigger-button'
import RulesFeed from './(components)/rules-feed'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { notFound } from 'next/navigation'

type Props = {params:{serviceId:string}}

const page =async({params}: Props) => {


  const company = await getCurrentCompany()
if(!company) throw new Error('auth')

    const session = await getServerSession(authOptions)


    const service = await prisma.service.findUnique({
      where:{
        id:params.serviceId,
        ...(session?.user?.name === "Company" && {
          entity: { companyId: company?.id },
        }),
        ...(session?.user?.name === "Entity" && {
          entityId: company?.id,
        })
      }
    })
 
     const  rules = await prisma.rule.findMany({
        where:{
          service:{
            id:params.serviceId,
            ...(session?.user?.name === "Company" && {
              entity: { companyId: company?.id },
            }),
            ...(session?.user?.name === "Entity" && {
              entityId: company?.id,
            })
          }
        }
      })
    

 if(!service) return notFound()


  return (
    <div>


    <div className='flex items-center justify-between'><Heading title='Rules' description='Manage your pricing rules for diffirent times' /> 
    <RuleTriggerButton /></div>

<div className='separate'>

    <RulesFeed rules={rules} />
</div>

    </div>
    
  )
}

export default page