import Heading from '@/components/heading'
import prisma from '@/lib/db'
import { getCurrentCompany } from '@/lib/helpers'
import React from 'react'
import RuleTriggerButton from './(components)/rules-trigger-button'
import RulesFeed from './(components)/rules-feed'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'

type Props = {params:{serviceId:string}}

const page =async({params}: Props) => {


    const currentCompany = await getCurrentCompany()
    if(!currentCompany) throw Error('not authenticated')

    const session = await getServerSession(authOptions)

    let rules

    if(session?.user?.name === "Company"){
      rules = await prisma.rule.findMany({
        where:{
          service:{
            id:params.serviceId,
            entity:{companyId:currentCompany.id}
          }
        }
      })
    }else{
      rules = await  prisma.rule.findMany({
        where:{
            service:{entityId:currentCompany.id,id:params.serviceId},
           
        },
        orderBy:{
            createdAt:'desc'
        }
    })
    }

 


  return (
    <div>


    <div className='flex items-center justify-between'><Heading title='Rules' description='Manage your pricing rules for diffirent times' /> 
    <RuleTriggerButton /></div>

    <RulesFeed rules={rules} />

    </div>
    
  )
}

export default page