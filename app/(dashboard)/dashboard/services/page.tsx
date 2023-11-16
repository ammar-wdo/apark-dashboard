import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import Heading from "@/components/heading";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";
import ServiceCard from "./(components)/service-card";
import { Skeleton } from "@/components/ui/skeleton"
import ServiceCardSceleton from "./(components)/service-card-skeleton";
import { Button } from "@/components/ui/button";
import { columnsService } from "./(components)/columns";
import { DataTable } from "./(components)/data-table";

type Props = {
  params: {  };
};

const page = async ({  }: Props) => {

  const session = await getServerSession(authOptions)
  const company = await prisma.company.findUnique({
    where: {
      email: session?.user?.email as string,
    },
    include: {
      services: {
      
        orderBy:{
          createdAt:'desc'
        }
      },
      
    },
  });

  if (!company) return redirect("/");

  return (
    <div className="">
      <Heading title="Services" description="Manage your services" />
      <div className="">
        <DataTable
          columns={columnsService}
          data={company.services}
       
         
        />
      </div>
   

      <Link className="inline-block mt-20" href={`/dashboard/services/new`}><Button>Add service</Button></Link>
    </div>
  );
};

export default page;
