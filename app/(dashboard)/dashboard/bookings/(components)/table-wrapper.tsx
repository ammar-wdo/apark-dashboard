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
  
  
  
  
    
  
 
  return (
    <div>
    
    
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