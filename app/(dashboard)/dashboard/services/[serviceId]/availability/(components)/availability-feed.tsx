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

type Props = {
  availabilitys: Availability[];
};

const AvailabilityFeed = ({ availabilitys }: Props) => {
  return !availabilitys.length ? (
    <p>No availability blockings added</p>
  ) : (
    <div className="space-y-1 mt-20">

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
          startDate={new Date(availability.startDate)}
          endDate={new Date(availability.endDate)}
          label={availability?.label}
          rangeId={availability.id}
        />
      ))}


  </TableBody>
</Table>

    </div>
  );
};

export default AvailabilityFeed;
