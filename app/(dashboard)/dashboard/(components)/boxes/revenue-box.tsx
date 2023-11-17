import prisma from '@/lib/db'
import { getCurrentCompany } from '@/lib/helpers'
import React from 'react'
import { getServices } from './(helpers)/get-services'
import { getTotal } from './(helpers)/get-total'
import { DollarSign } from 'lucide-react'
import Box from './box'

type Props = {
    searchParams:string
}

const RevenueBox = async({searchParams}: Props) => {

    const company = await  getCurrentCompany()

    const {services} = await getServices(searchParams,company?.id as string)
    

    const {totalRevenue,monthlyRevenue} = getTotal(services!)



  return (
   <Box title='Total revenue'  Icon={<DollarSign className='w-7 h-7 text-neutral-500'/>} footer='For this month' dollar={true} value={monthlyRevenue as number}/>
  )
}

export default RevenueBox