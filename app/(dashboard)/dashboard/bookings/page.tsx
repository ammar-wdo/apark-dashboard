import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import Heading from "@/components/heading";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import Link from "next/link";
import React, { Suspense } from "react";
import { DataTable } from "./(components)/data-table";
import { columns } from "./(components)/columns";
import { redirect } from "next/navigation";
import TableWrapper from "./(components)/table-wrapper";
import { Skeleton } from "@/components/ui/skeleton";
import Explane from "./[bookingId]/(components)/explane";
import { getCurrentCompany } from "@/lib/helpers";

type Props = {
  params: { companyId: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

const page = async ({ params, searchParams }: Props) => {

  const company = await getCurrentCompany()
  if(!company) throw new Error('auth')



  if (!searchParams.page) {
    searchParams.page = "1";
  }

  if (+searchParams.page <= 0) {
    redirect("/");
  }

  const bookingCode = searchParams.bookingCode

  const paymentStatus = [
    {
    label:'Geslaagd',
    description:'The payment is made successfully',
    color:'border-l-2 border-green-500'
  },
  {
    label:'In Behandeling',
    description:'The payment is pending ',
    color:'border-l-2 border-yellow-500'
  },
    {
    label:'Verlopen',
    description:'The payment checkout was expired and payment failed ',
    color:'border-l-2 border-rose-500'
  },

    {
    label:'Geannuleerd',
    description:'The payment is canceled and a refund action made',
    color:'border-l-2 border-rose-500'
  },

]
const bookingStatus = [
  {
  label:'Actief',
  description:'The booking is either paid or pending',
  color:'border-l-2 border-green-500'
},
{
  label:'Verzoek om teruggave',
  description:'The booking is pending to be refunded ',
  color:'border-l-2 border-yellow-500'
},
  {
  label:'Terugbetaald',
  description:'The booking is successfully refunded',
  color:'border-l-2 border-green-500'
},

  {
  label:'Geannuleerd',
  description:'The booking is canceled',
  color:'border-l-2 border-rose-500'
},

]
 



  return (
    <div className=" ">
      <Heading title="Bookings" description="Check your bookings" />
<div className="separate">

<div className='flex gap-3 '>
     <Explane  stages={bookingStatus} title=' Reservering status' />
     <Explane  stages={paymentStatus} title='Betaal status' />
     </div>

      <Suspense   key={+searchParams.page}  fallback={<Skeleton className="w-full h-[700px] rounded-lg" />} >
      <TableWrapper bookingCode={bookingCode as string | undefined} page={searchParams.page} />
      </Suspense>
</div>
    

   
    </div>
  );
};

export default page;


// key={+searchParams.page}  fallback={<Skeleton className="w-full h-[700px] rounded-lg" />}