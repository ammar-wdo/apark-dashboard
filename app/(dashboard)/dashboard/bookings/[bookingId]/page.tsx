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
import { notFound, redirect } from "next/navigation";
import { JsonArray } from "@prisma/client/runtime/library";
import { Discount, ExraOption } from "@prisma/client";
import { NLtimezone } from "@/lib/nl-timezone";
import { getCurrentCompany } from "@/lib/helpers";
import ErrorHolder from "../../(components)/error-holder";


type Props = {
  params: { bookingId: string; companyId: string };
};

const page = async ({ params }: Props) => {
  const company = await getCurrentCompany()
  if(!company) return <ErrorHolder/>

  
  const booking = await prisma.booking.findUnique({
    where: {
      id: params.bookingId,
    },
    include: {
      service: true,
    },
  });

  if(!booking) return notFound()
  
const {daysofparking} = await daysAndTotal(booking?.arrivalDate!,booking?.departureDate!,booking?.service.id!)

const discount  = booking.discount as  Discount | null

const discountApplied = discount?.type ==='FIXED' ? `€${discount.value}` : `%${discount?.percentage}`
  return (
    <div className="p-12 separate">
      <h2 className="text-3xl font-semibold ">
      Reservering #{booking?.bookingCode}
      </h2>
      <div className="mt-12 border  rounded-sm border-muted-foreground overflow-hidden">
        <Table>
          <TableHeader className="">
            <TableRow>
              <TableHead className="w-full bg-muted/80">Klantgegevens</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="flex items-center justify-between">
                <p className="font-semibold">Naam</p>
                <p className="capitalize text-muted-foreground">{`${booking?.firstName}  ${booking?.lastName}`}</p>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="flex items-center justify-between">
                <p className="font-semibold">Mobiel nummer</p>
                <p className="capitalize text-muted-foreground">
                  + {booking?.phoneNumber}
                </p>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="flex items-center justify-between">
                <p className="font-semibold">Merk en model</p>
                <p className="capitalize text-muted-foreground">
                  {booking?.carModel}
                </p>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="flex items-center justify-between">
                <p className="font-semibold">Kenteken</p>
                <p className="capitalize text-muted-foreground">
                  {booking?.carLicense}
                </p>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="flex items-center justify-between">
                <p className="font-semibold">Aantal personen</p>
                <p className="capitalize text-muted-foreground">
                  {booking?.numberOfPeople}
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
              <TableHead className="w-full bg-muted/80">Reservering</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="flex items-center justify-between">
                <p className="font-semibold">Reserverings datum</p>
                <p className="capitalize text-muted-foreground">{NLtimezone(booking.createdAt,'Europe/Amsterdam')}</p>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="flex items-center justify-between">
                <p className="font-semibold">Parkeer aanbieder</p>
                <p className="capitalize text-muted-foreground">
                   {booking?.service.name}
                </p>
              </TableCell>
            </TableRow>
            <TableRow>
           
              <TableCell className="flex items-center justify-between">
                <p className="font-semibold">Aankomst datum</p>
                <p className="capitalize text-muted-foreground">{NLtimezone(booking.arrivalDate,'UTC')}</p>
              </TableCell>
           
            </TableRow>
            <TableRow>
           
              <TableCell className="flex items-center justify-between">
                <p className="font-semibold">Vertrek datum</p>
                <p className="capitalize text-muted-foreground">{NLtimezone(booking.departureDate,'UTC')}</p>
              </TableCell>
           
            </TableRow>
            <TableRow>
              <TableCell className="flex items-center justify-between">
                <p className="font-semibold"> Vlucht nummer</p>
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
        <p>{daysofparking} dag(en) {booking?.service.parkingType} parking</p>
 
        </div>
        
        </div>
     
        <Separator className="my-4 bg-muted-foreground h-[2px]" />
        <div className="space-y-2  text-black dark:text-white">
       
        {!!booking.extraOptions.length&&<div className="border-b mt-4 pb-2">
                <h3 className="font-bold first-letter:capitalize ">Extra opties</h3>
                <div className="flex flex-col gap-1">
                {(booking.extraOptions as unknown as ExraOption[]).map((option) =><div key={option.id} className="flex justify-between items-center font-semibold">
                    <span className="first-letter:capitalize font-normal text-neutral-500">{option.label}</span>
                    <span>€{option.price.toFixed(2)}</span>
                  </div>)}
                

                </div>

            
                
                </div>}

                {!!booking.discount && <div className="flex items-center justify-between">
                  <p className="font-semibold">Kortingscode toegepast</p>
                  <p className="font-semibold">{discountApplied}</p>
                  </div>}
        <div className="flex items-center justify-between font-semibold space-x-3">
        <p className="">Totaal betaald</p>
        <p>€ { booking?.total.toFixed(2)}</p>
        </div>
        </div>
       

      </div>

      <LogsFeed bookingId={params.bookingId} />
    </div>
  );
};

export default page;
