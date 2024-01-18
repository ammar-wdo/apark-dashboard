import { Availability } from "@prisma/client";
import React from "react";
import RangeCard from "./range-card";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { NLtimezone } from "@/lib/nl-timezone";
import prisma from "@/lib/db";
import { getCurrentCompany } from "@/lib/helpers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import Ranges from "./ranges";
import { notFound } from "next/navigation";

type Props = {
  serviceId:string
};

const AvailabilityFeed = async({ serviceId }: Props) => {

  const currentCompany = await getCurrentCompany();
  const session = await getServerSession(authOptions);
  const availabilitys = await prisma.availability.findMany({
    where: {
      service: { id: serviceId ,
        ...(session?.user?.name==='Company' &&{entity:{companyId:currentCompany?.id}} ),
        ...(session?.user?.name==='Entity' &&{entityId:currentCompany?.id} )
    },
    
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if(!availabilitys) return notFound()
  return  (
    <div className=" mt-20 separate">

<Table>

  <TableHeader>
    <TableRow>
      <TableHead className=" text-center">Label</TableHead>
      <TableHead className="text-center">From</TableHead>
      <TableHead className="text-center">To</TableHead>
      <TableHead className="text-center">Action</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>


 

    {availabilitys.map((availability) => (
        
        <RangeCard
          key={availability.id}
          startDate={NLtimezone(availability.startDate,'UTC')}
          endDate={NLtimezone(availability.endDate,'UTC')}
          label={availability?.label}
          rangeId={availability.id}
        />
      ))}


  </TableBody>
</Table>
{  !availabilitys.length && (
    <p className="font-bold text-center mt-4 text-muted-foreground">No availability blockings added</p>
  )}
<h3 className="text-center capitalize text-lg font-bold mt-24 pt-4">
          Calendar of blocked ranges
        </h3>
<Ranges availabilitys={availabilitys} />

    </div>
  );
};

export default AvailabilityFeed;
