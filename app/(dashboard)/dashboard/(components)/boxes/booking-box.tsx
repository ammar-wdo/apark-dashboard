import prisma from '@/lib/db'
import { getCurrentCompany } from '@/lib/helpers'
import React from 'react'
import { getServices } from './(helpers)/get-services'

import { BookmarkCheck } from 'lucide-react'
import Box from './box'
import { getTotal } from './(helpers)/get-total'

type Props = {
    searchParams:string,
    entity:string | undefined
}

const BookingBox = async({searchParams,entity}: Props) => {

    const company = await  getCurrentCompany()

    const {services} = await getServices(searchParams,company?.id as string,entity)

    const {monthlyBookings:bookings} = getTotal(services!)

  
    

  



  return (
   <Box title='Totale reserveringen'  Icon={<BookmarkCheck className='w-7 h-7 text-neutral-500'/>} footer='Deze maand' dollar={false} value={bookings as number}/>
  )
}

export default BookingBox