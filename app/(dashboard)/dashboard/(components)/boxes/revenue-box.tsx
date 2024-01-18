import prisma from '@/lib/db'
import { getCurrentCompany } from '@/lib/helpers'
import React from 'react'
import { getServices } from './(helpers)/get-services'
import { getTotal } from './(helpers)/get-total'
import { DollarSign, Euro } from 'lucide-react'
import Box from './box'

type Props = {
    searchParams:string,
    entity:string | undefined
}

const RevenueBox = async({searchParams,entity}: Props) => {

    const company = await  getCurrentCompany()

    const {services} = await getServices(searchParams,company?.id as string,entity )
    

    const {totalRevenue,monthlyRevenue} = getTotal(services!)



  return (
   <Box title='Total revenue'  Icon={<Euro className='w-7 h-7 text-neutral-500'/>} footer='For this month' dollar={true} value={+monthlyRevenue.toFixed(2) as number}/>
  )
}

export default RevenueBox