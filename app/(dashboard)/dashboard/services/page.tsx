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
import ServicesWrapper from "./(components)/services-wrapper";

type Props = {
  params: {  };
};

const page = async ({  }: Props) => {

 

  return (
    <div className="">
      <Heading title="Services" description="Manage your services" />
     
      <Suspense fallback={<Skeleton className="w-full h-[700px] rounded-lg" />}>
      <ServicesWrapper />
      </Suspense>

     
    </div>
  );
};

export default page;
