import Heading from "@/components/heading";
import prisma from "@/lib/db";
import React from "react";
import AvailabilityForm from "./(components)/availability-form";
import AvailabilityFeed from "./(components)/availability-feed";
import AvailabilityTriggerButton from "./(components)/availability-trigger-button";
import Ranges from "./(components)/ranges";
import { getCurrentCompany } from "@/lib/helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import BookingsRange from "./(components)/bookings-range";

type Props = {
  params: { serviceId: string };
};

const page = async ({ params }: Props) => {
  const company = await getCurrentCompany()
  if(!company) throw new Error('auth')

  const session = await getServerSession(authOptions);








  return (
    <div>
      <div className="flex items-center justify-between">
        <Heading
          title="Availability"
          description="Manage your availability times"
        />
        <AvailabilityTriggerButton />
      </div>

      

      <AvailabilityFeed  serviceId={params.serviceId} />
      <div className="overflow-x-auto separate mt-12">
        <div className="min-w-[1400px]">
        <BookingsRange  serviceId={params.serviceId}/>
        </div>
      </div>
    
   
    </div>
  );
};

export default page;
