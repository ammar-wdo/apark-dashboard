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
import ErrorHolder from "../../../(components)/error-holder";

type Props = {
  params: { serviceId: string };
};

const page = async ({ params }: Props) => {
  const company = await getCurrentCompany()
  if(!company) return <ErrorHolder />

  const session = await getServerSession(authOptions);








  return (
    <div>
      <div className="flex items-center justify-between">
        <Heading
          title="Beschikbaarheid"
          description="Schakel uw service in en uit voor specifieke dagen "
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
