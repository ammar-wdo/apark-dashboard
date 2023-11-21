import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import Heading from "@/components/heading";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton"
import ServiceCardSceleton from "./(components)/service-card-skeleton";
import { Button } from "@/components/ui/button";
import { columnsService } from "./(components)/columns";
import { DataTable } from "./(components)/data-table";
import ServicesWrapper from "./(components)/services-wrapper";

type Props = {
  searchParams: {[key:string]:string | string[] | undefined };
};

const page = async ({ searchParams }: Props) => {

 const entityId = searchParams.entityId
 console.log(entityId)

  return (
    <div >
      <div className="flex justify-between items-center">
      <Heading title="Services" description="Manage your services" />
      <Link className="" href={`/dashboard/services/new`}><Button>Add service</Button></Link>
      </div>

     
      <Suspense fallback={<Skeleton className="w-full h-[700px] rounded-lg" />}>
      <ServicesWrapper  entityId={entityId}/>
      </Suspense>

     
    </div>
  );
};

export default page;
