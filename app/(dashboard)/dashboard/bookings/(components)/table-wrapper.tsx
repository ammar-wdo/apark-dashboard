import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import prisma from '@/lib/db';
import { getServerSession } from 'next-auth';
import React, { Suspense } from 'react'
import { DataTable } from './data-table';
import { columns } from './columns';

type Props = {
    page:string | string[] | undefined
}

const TableWrapper =async ({page}: Props) => {
    const session = await getServerSession(authOptions);

    const company = await prisma.company.findUnique({
      where: {
        email: session?.user?.email as string,
      },
    });
    

    if (!company) throw Error("Unauthenticated");
    const ITEMS_PER_PAGE = 6;
    const bookingsCount = await prisma.booking.count({
      where:{
          service:{
              companyId:company.id
          }
      }
    });
    const totalPages = Math.ceil(bookingsCount / ITEMS_PER_PAGE);
    const isLastPage = +page! >= totalPages ;
  
  
  
  
  
  
    const bookings = await prisma.booking.findMany({
      where: {
        service: {
          companyId: company.id,
        },
      },
      include: {
        service: true,
      },
      take: ITEMS_PER_PAGE,
      skip: ITEMS_PER_PAGE * (+page! -1),
      orderBy:{
        createdAt:'desc'
      }
    });
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