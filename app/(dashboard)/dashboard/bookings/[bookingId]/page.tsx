import prisma from '@/lib/db'
import React from 'react'

type Props = {
    params:{bookingId:string,companyId:string}
}

const page = async({params}: Props) => {

const booking = await prisma.booking.findUnique({where:{
    bookingCode:params.bookingId,

}})

  return (
    <div className='text-xs'>{JSON.stringify(booking)}</div>
  )
}

export default page