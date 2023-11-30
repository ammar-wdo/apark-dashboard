import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import prisma from '@/lib/db';
import { getServerSession } from 'next-auth';
import React, { Suspense } from 'react'
import { DataTable } from './data-table';
import { columns } from './columns';
import { getCurrentCompany } from '@/lib/helpers';
import { getBookingsAndCount } from '../(helpers)/get-bookings-count';
import Explane from '../[bookingId]/(components)/explane';

type Props = {
    page:string | string[] | undefined
}

const TableWrapper =async ({page}: Props) => {
    const session = await getServerSession(authOptions);

    const company = await getCurrentCompany()
    

    if (!company) throw Error("Unauthenticated");
    const ITEMS_PER_PAGE = 6;

   
    const {bookings,bookingsCount} = await getBookingsAndCount(ITEMS_PER_PAGE,page)
    const totalPages = Math.ceil(bookingsCount / ITEMS_PER_PAGE);
    const isLastPage = +page! >= totalPages ;
  
  
  
  
    const paymentStatus = [
      {
      label:'succeeded',
      description:'The payment is made successfully',
      color:'border-l-2 border-green-500'
    },
    {
      label:'pending',
      description:'The payment is pending ',
      color:'border-l-2 border-yellow-500'
    },
      {
      label:'expired',
      description:'The payment checkout was expired and payment failed ',
      color:'border-l-2 border-rose-500'
    },
  
      {
      label:'canceled',
      description:'The payment is canceled and a refund action made',
      color:'border-l-2 border-rose-500'
    },
  
  ]
    const bookingStatus = [
      {
      label:'active',
      description:'The booking is either paid or pending',
      color:'border-l-2 border-green-500'
    },
    {
      label:'refund request',
      description:'The booking is pending to be refunded ',
      color:'border-l-2 border-yellow-500'
    },
      {
      label:'refunded',
      description:'The booking is successfully refunded',
      color:'border-l-2 border-green-500'
    },
  
      {
      label:'canceled',
      description:'The booking is canceled',
      color:'border-l-2 border-rose-500'
    },
  
  ]
  
 
  return (
    <div>
     
     {<Explane  stages={paymentStatus} title='Payment status' />}
     {<Explane  stages={bookingStatus} title='Boooking status' />}
        <DataTable
          columns={columns}
          data={bookings}
          page={page as string}
          isLastPage={isLastPage}
          itemsPerPage={ITEMS_PER_PAGE}
          bookingsCount={bookingsCount}
        />
      
    </div>
  )
}

export default TableWrapper