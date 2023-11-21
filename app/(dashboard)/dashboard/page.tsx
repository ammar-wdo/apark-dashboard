import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/db";

import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";
import SignoutButton from "./(components)/signout-button";
import Heading from "@/components/heading";
import SearchComponent from "./(components)/search-component";
import RevenueBox from "./(components)/boxes/revenue-box";
import { Skeleton } from "@/components/ui/skeleton";
import BookingBox from "./(components)/boxes/booking-box";
import CancelBox from "./(components)/boxes/cancel-box";
import ChartComponent from "./(components)/chart-component";

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

const page = async ({ searchParams }: Props) => {
  if (!searchParams.service) {
    searchParams.service = "all";
  }

  const session = await getServerSession(authOptions);
  const isCompany = session?.user?.name === "Company"

  if(isCompany && !searchParams.entity){
    searchParams.entity === "all"
  }

  if(!isCompany && searchParams.entity) return redirect('/dashboard')




  return (
    <div>
      <div className="flex items-center justify-between">
        <Heading title="Dashboard" description="Manage your account" />
        <div> 
          <SearchComponent
          searchParams={searchParams.service as string}
         
        />

        </div>
       
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-2">
        <Suspense
          key={(searchParams.service + "revenue") as string}
          fallback={<Skeleton className="h-[175px] rounded-xl" />}
        >
          <RevenueBox searchParams={searchParams.service as string} />
        </Suspense>
        <Suspense
          key={(searchParams.service + "booking") as string}
          fallback={<Skeleton className="h-[175px] rounded-xl" />}
        >
          <BookingBox searchParams={searchParams.service as string} />
        </Suspense>
        <Suspense fallback={<Skeleton className="h-[175px] rounded-xl" />}>
          <CancelBox searchParams={searchParams.service as string} />
        </Suspense>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3">
        <div className=" h-[500px] mt-12 p-4 border rounded-xl overflow-x-auto lg:col-span-2">
          <Suspense
            key={(searchParams.service + "chart") as string}
            fallback={<Skeleton className="h-[500px] rounded-xl" />}
          >
            <ChartComponent
              key={searchParams.service + "chart"}
              searchParams={searchParams.service as string}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default page;
