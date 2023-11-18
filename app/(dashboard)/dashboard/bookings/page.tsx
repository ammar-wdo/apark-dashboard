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

type Props = {
  params: { companyId: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

const page = async ({ params, searchParams }: Props) => {

 



  if (!searchParams.page) {
    searchParams.page = "1";
  }

  if (+searchParams.page <= 0) {
    redirect("/");
  }
 

  return (
    <div className=" ">
      <Heading title="Bookings" description="Check your bookings" />
      <Suspense   key={+searchParams.page}  fallback={<Skeleton className="w-full h-[700px] rounded-lg" />} >
      <TableWrapper  page={searchParams.page} />
      </Suspense>

   
    </div>
  );
};

export default page;


// key={+searchParams.page}  fallback={<Skeleton className="w-full h-[700px] rounded-lg" />}