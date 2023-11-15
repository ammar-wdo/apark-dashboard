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
        select:{id:true},
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

      {company.services.length === 0 ? (
        <div>no services added</div>
      ) : (
        <div className={"grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  3xl:grid-cols-5 gap-5"}>
          {company.services.map(service=><Suspense key={service.id} fallback={<ServiceCardSceleton />}><ServiceCard key={service.id} serviceId={service.id} companyId={company.id} /></Suspense>)}
        </div>
      )}

      <Link className="inline-block mt-20" href={`/dashboard/services/new`}><Button>Add service</Button></Link>
    </div>
  );
};

export default page;
