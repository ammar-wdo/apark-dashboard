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
const {daysofparking,total} = await daysAndTotal(booking?.arrivalDate!,booking?.departureDate!,booking?.service.id!)
  return (
    <div className="p-12">
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
                <p className="capitalize text-muted-foreground">{format(new Date(booking?.createdAt!),"yyyy-MM-dd'  'HH:mm:ss")}</p>
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
                <p className="capitalize text-muted-foreground">{format(new Date(booking?.arrivalDate!),"yyyy-MM-dd")} {booking?.arrivalTime}:00</p>
              </TableCell>
           
            </TableRow>
            <TableRow>
           
              <TableCell className="flex items-center justify-between">
                <p className="font-semibold">Departure date</p>
                <p className="capitalize text-muted-foreground">{format(new Date(booking?.departureDate!),"yyyy-MM-dd")} {booking?.departureTime}:00</p>
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
        <p>$ { total}</p>
        </div>
        <div className="flex items-center justify-between capitalize">
        <p>Credit/Dept card cost</p>
        <p>free</p>
        </div>
        </div>
     
        <Separator className="my-4 bg-muted-foreground h-[2px]" />
        <div className="space-y-2  text-black dark:text-white">
        <div className="flex items-center justify-between font-semibold">
        <p className="">Total turnover Comfort Parking</p>
        <p>€ { booking?.total}</p>
        </div>
        <div className="flex items-center justify-between font-semibold space-x-3">
        <p className="">Total amount Customer (paid in advance)</p>
        <p>€ { booking?.total}</p>
        </div>
        </div>
       

      </div>

      <LogsFeed bookingId={params.bookingId} />
    </div>
  );
};

export default page;
