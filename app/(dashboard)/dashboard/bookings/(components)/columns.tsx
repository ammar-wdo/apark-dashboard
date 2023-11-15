"use client";

import {format} from "date-fns"
import { cn } from "@/lib/utils";
import { Booking, PaymentMethod, Service } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button";


const paymentImage: { [key: string]: string } = {
 IDEAL: "/ideal.png",
  CREDIT_CARD: "/cards.png",
 PAYPAL: "/paypal.png",

};

const styles :{ [key: string]: string }= {
  SUCCEEDED:"bg-green-500/20 text-green-500 ",
  PENDING:"bg-yellow-500/20 text-yellow-500"
}

export const columns: ColumnDef<Booking & {service:Service}>[] = [
  {
    accessorKey: "bookingCode",
    header: "Booking code",
    cell: ({ row }) => (
      <Link
        className="underline text-blue-600 dark:text-indigo-500"
        href={`/dashboard/bookings/${row.getValue("bookingCode")}`}
      >
        {row.getValue("bookingCode")}
      </Link>
    ),
  },
  {
    accessorKey: "service.title",
    header: "Parking Provider",
  },
  {
    accessorKey: "service.parkingType",
    header: "Parking Type",
  },
  {
      accessorKey: "firstName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            First name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },

  },
  {
      accessorKey: "lastName",
    header: "Last name",

  },
  {
      accessorKey: "createdAt",
    header: "Booking date",
    cell:({row})=><div><p>{format(new Date( row.getValue('createdAt')),"EEEE, MMMM d, yyyy")}</p><p className="text-xs">{format(new Date( row.getValue('createdAt')),"HH:mm")}</p></div>

  },
  {
    accessorKey: "arrivalDate",
    header: "Arrival date",
    cell:({row})=><div><p>{format(new Date( row.getValue('createdAt')),"EEEE, MMMM d, yyyy")}</p><p className="text-xs">{format(new Date( row.getValue('createdAt')),"HH:mm")}</p></div>
  },
  {
    accessorKey: "departureDate",
    header: "departure date",
    cell:({row})=><div><p>{format(new Date( row.getValue('createdAt')),"EEEE, MMMM d, yyyy")}</p><p className="text-xs">{format(new Date( row.getValue('createdAt')),"HH:mm")}</p></div>
  },
  {
    accessorKey: "paymentMethod",
    header: "Payment method",
    cell: ({ row }) => (
      <div
        title={row.getValue("paymentMethod")}
        className={cn("w-12 h-12 relative  overflow-hidden ")}
      >
        <Image
          src={paymentImage[row.getValue("paymentMethod") as string] }
          fill
          alt="payment"
          className="object-contain"
        />
      </div>
    ),
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => (
      <span className="space-x-3 whitespace-nowrap">$ {row.getValue("total")}</span>
    ),
    
  },
  {
    accessorKey: "paymentStatus",
    header: "Payment status",
    cell:({row})=><span className={cn('px-4 py-2 text-xs font-bold rounded-md ',styles[row.getValue!('paymentStatus') as string])}>{row.getValue('paymentStatus')}</span>
  },
 
];
