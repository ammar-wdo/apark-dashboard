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
import ErrorHolder from "../(components)/error-holder";

type Props = {
  params: { companyId: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

const page = async ({ params, searchParams }: Props) => {

  const company = await getCurrentCompany()
  if(!company) return <ErrorHolder/>



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
    description:'De betaling is succesvol uitgevoerd.',
    color:'border-l-2 border-green-500'
  },
  {
    label:'In Behandeling',
    description:'De betaling is in behandeling.',
    color:'border-l-2 border-yellow-500'
  },
    {
    label:'Verlopen',
    description:'De betaalcheckout is verlopen en de betaling is mislukt.',
    color:'border-l-2 border-rose-500'
  },
  
    {
    label:'Geannuleerd',
    description:'De betaling is geannuleerd en er is een terugbetalingsactie uitgevoerd.',
    color:'border-l-2 border-rose-500'
  },
  
  ]
  const bookingStatus = [
    {
    label:'Actief',
    description:'De boeking is betaald of in behandeling.',
    color:'border-l-2 border-green-500'
  },
  {
    label:'Verzoek om teruggave',
    description:'De boeking wacht op terugbetaling. ',
    color:'border-l-2 border-yellow-500'
  },
    {
    label:'Terugbetaald',
    description:'De boeking is succesvol terugbetaald.',
    color:'border-l-2 border-green-500'
  },
  
    {
    label:'Geannuleerd',
    description:'De boeking is geannuleerd.',
    color:'border-l-2 border-rose-500'
  },
  
  ]
 



  return (
    <div className=" ">
      <Heading title="Reserveringen" description="Bekijk Reserveringen" />
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