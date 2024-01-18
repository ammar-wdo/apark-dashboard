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
import SearchEntity from "./(components)/search-entity-component";
import { getCurrentCompany } from "@/lib/helpers";

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

const page = async ({ searchParams }: Props) => {
  if (!searchParams.service) {
    searchParams.service = "all";
  }

  const session = await getServerSession(authOptions);
  const company = await getCurrentCompany()
  if(!company) throw new Error('auth')
  
  const isCompany = session?.user?.name === "Company"

  if(isCompany && !searchParams.entity){
    searchParams.entity = "all"
  }

  if(!isCompany && searchParams.entity) return redirect('/dashboard')




  return (
    <div>
      <div className="flex items-center justify-between">
        <Heading title="Dashboard" description="Manage your account" />
        <div className="flex items-center gap-3"> 
          <SearchComponent
          entityId={searchParams.entity}
          searchParams={searchParams.service as string}
         
        />

        {isCompany && <SearchEntity searchParams={searchParams.entity as string} />}

        </div>
       
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-2">
        <Suspense
          key={(searchParams.service + "revenue") as string}
          fallback={<Skeleton className="h-[175px] rounded-xl" />}
        >
          <RevenueBox searchParams={searchParams.service as string} entity={searchParams.entity as string | undefined}/>
        </Suspense>
        <Suspense
          key={(searchParams.service + "" + searchParams.entity + "booking") as string}
          fallback={<Skeleton className="h-[175px] rounded-xl" />}
        >
          <BookingBox searchParams={searchParams.service as string} entity={searchParams.entity as string | undefined}/>
        </Suspense>
        <Suspense key={(searchParams.service + "" + searchParams.entity + "canceling") as string} fallback={<Skeleton className="h-[175px] rounded-xl" />}>
          <CancelBox searchParams={searchParams.service as string} entity={searchParams.entity as string | undefined}/>
        </Suspense>
      </div>

      <div className="w-full overflow-x-auto mt-12 p-4 border rounded-xl separate
      ">
      <div className=" h-[600px]  min-w-[1400px] ">
          <Suspense
            key={(searchParams.service + "" + searchParams.entity + "chart") as string}
            fallback={<Skeleton className="h-[600px] rounded-xl" />}
          >
            <ChartComponent
              key={searchParams.service + "" + searchParams.entity + "chart"}
              searchParams={searchParams.service as string}
              entity={searchParams.entity as string | undefined}
            />
          </Suspense>
        </div>
      </div>
   
        
    
    </div>
  );
};

export default page;
