import prisma from "@/lib/db";
import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { calculateParkingDays } from "@/app/api/(public)/services/(helpers)/findParkingDays";
import { daysAndTotal } from "@/app/api/(public)/checkout/(helpers)/days-and-total";
import { Separator } from "@/components/ui/separator";
import LogsFeed from "./(components)/logs-feed";
import { redirect } from "next/navigation";
import { JsonArray } from "@prisma/client/runtime/library";
import { ExraOption } from "@prisma/client";
import { NLtimezone } from "@/lib/nl-timezone";


type Props = {
  params: { bookingId: string; companyId: string };
};

const page = async ({ params }: Props) => {
  const booking = await prisma.booking.findUnique({
    where: {
      id: params.bookingId,
    },
    include: {
      service: true,
    },
  });

  if(!booking) return redirect('/dashboard')
  
const {daysofparking} = await daysAndTotal(booking?.arrivalDate!,booking?.departureDate!,booking?.service.id!)
  return (
    <div className="p-12 separate">
      <h2 className="text-3xl font-semibold ">
        Reservation #{booking?.bookingCode}
      </h2>
      <div className="mt-12 border  rounded-sm border-muted-foreground overflow-hidden">
        <Table>
          <TableHeader className="">
            <TableRow>
              <TableHead className="w-full bg-muted/80">Customer data</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="flex items-center justify-between">
                <p className="font-semibold">Name</p>
                <p className="capitalize text-muted-foreground">{`${booking?.firstName}  ${booking?.lastName}`}</p>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="flex items-center justify-between">
                <p className="font-semibold">Phone number</p>
                <p className="capitalize text-muted-foreground">
                  + {booking?.phoneNumber}
                </p>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="flex items-center justify-between">
                <p className="font-semibold">Car model</p>
                <p className="capitalize text-muted-foreground">
                  {booking?.carModel}
                </p>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="flex items-center justify-between">
                <p className="font-semibold">Car lisence</p>
                <p className="capitalize text-muted-foreground">
                  {booking?.carLicense}
                </p>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="flex items-center justify-between">
                <p className="font-semibold">Car color</p>
                <p className="capitalize text-muted-foreground">
                  {booking?.carColor}
                </p>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <div className="mt-12 border rounded-sm border-muted-foreground overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-full bg-muted/80">Reservation</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="flex items-center justify-between">
                <p className="font-semibold">Reserve date</p>
                <p className="capitalize text-muted-foreground">{NLtimezone(booking.createdAt)}</p>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="flex items-center justify-between">
                <p className="font-semibold">Provider</p>
                <p className="capitalize text-muted-foreground">
                   {booking?.service.name}
                </p>
              </TableCell>
            </TableRow>
            <TableRow>
           
              <TableCell className="flex items-center justify-between">
                <p className="font-semibold">Arrival date</p>
                <p className="capitalize text-muted-foreground">{NLtimezone(booking.arrivalDate)}</p>
              </TableCell>
           
            </TableRow>
            <TableRow>
           
              <TableCell className="flex items-center justify-between">
                <p className="font-semibold">Departure date</p>
                <p className="capitalize text-muted-foreground">{NLtimezone(booking.departureDate)}</p>
              </TableCell>
           
            </TableRow>
            <TableRow>
              <TableCell className="flex items-center justify-between">
                <p className="font-semibold">Flight number</p>
                <p className="capitalize text-muted-foreground">
                  {booking?.flightNumber}
                </p>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <div className="mt-12 border p-3 rounded-sm text-sm space-y-5 font-light max-w-[350px]   w-full text-muted-foreground">
        <div className="space-y-2">
        <div className="flex items-center justify-between">
        <p>{daysofparking} day(s) of {booking?.service.parkingType} parking</p>
 
        </div>
        
        </div>
     
        <Separator className="my-4 bg-muted-foreground h-[2px]" />
        <div className="space-y-2  text-black dark:text-white">
       
        {!!booking.extraOptions.length&&<div className="border-b mt-4 pb-2">
                <h3 className="font-bold first-letter:capitalize ">Extra options</h3>
                <div className="flex flex-col gap-1">
                  {(booking.extraOptions as unknown as ExraOption[]).map((option) =><div key={option.id} className="flex justify-between items-center mt-2 font-semibold">
                    <span className="first-letter:capitalize">{option.label}</span>
                    <span>€{option.price}</span>
                  </div>)}

                </div>
                
                </div>}
        <div className="flex items-center justify-between font-semibold space-x-3">
        <p className="">Total amount paid</p>
        <p>€ { booking?.total}</p>
        </div>
        </div>
       

      </div>

      <LogsFeed bookingId={params.bookingId} />
    </div>
  );
};

export default page;
