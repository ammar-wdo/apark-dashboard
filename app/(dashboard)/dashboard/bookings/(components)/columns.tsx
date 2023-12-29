"use client";

import {format} from "date-fns"
import { cn } from "@/lib/utils";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button";
import { Booking, Service } from "@prisma/client";
import { NLtimezone } from "@/lib/nl-timezone";



const paymentImage: { [key: string]: string } = {
 IDEAL: "/ideal.png",
  CREDIT_CARD: "/cards.png",
 PAYPAL: "/paypal.png",

};

const styles :{ [key: string]: string }= {
  CANCELED: "text-rose-500 bg-rose-500/20",
  REVERTED: "text-rose-500 bg-rose-500/20",
  EXPIRED: "text-rose-500 bg-rose-500/20",
  ACTIVE: "text-green-500 bg-green-500/20",
  SUCCEEDED: "text-green-500 text-green-500 bg-green-500/20",
  REFUNDED: "text-green-500 text-green-500 bg-green-500/20",
  CREATED: "text-green-500 text-green-500 bg-green-500/20",
  PENDING: "text-yellow-500 text-yellow-500 bg-yellow-500/20",
  UPDATED: "text-green-500 text-green-500 bg-green-500/20",
  UPDATING: "text-yellow-500 text-yellow-500 bg-yellow-500/20",
  REFUND_REQUEST: "text-yellow-500 text-yellow-500 bg-yellow-500/20",
 
}

export const columns: ColumnDef<Booking & {service:Service}>[] = [
  {
    accessorKey: "bookingCode",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Booking code
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <Link
      style={{textTransform:'none'}}
        className="underline text-blue-600 dark:text-indigo-500 text-center block w-full "
        href={`/dashboard/bookings/${row.original.id}`}
      >
        {row.getValue("bookingCode")}
      </Link>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
         E-mail
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell:({row})=><span style={{textTransform:'none'}}>{row.getValue('email')}</span>
  },
  {
    accessorKey: "service.name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
         Parking provider
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell:({row})=> <p className="text-center">{row.original.service.name}</p>
  },
  {
    accessorKey: "service.parkingType",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Parking type
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell:({row})=> <p className="text-center">{row.original.service.parkingType}</p>
  },
  {
      accessorKey: "firstName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell:({row})=><p className="capitalize text-center">{row.original.firstName} {row.original.lastName}</p>

  },
 
  {
      accessorKey: "createdAt",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
           Booking date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    cell:({row})=><div className="flex items-center gap-1 justify-center"><p className="text-xs ">{NLtimezone(row.getValue('createdAt'),'Europe/Amsterdam')}</p></div>

  },
  {
    accessorKey: "arrivalDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Arrival date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell:({row})=><div className="flex items-center gap-1 justify-center"><p className="text-xs ">{NLtimezone(row.getValue('arrivalDate'),'UTC')}</p></div>
  },
  {
    accessorKey: "departureDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
         Departure date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell:({row})=><div className="flex items-center gap-1 justify-center"><p className="text-xs ">{NLtimezone(row.getValue('departureDate'),'UTC')}</p></div>
  },
  {
    accessorKey: "paymentMethod",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
         Payment method
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div
        title={row.getValue("paymentMethod")}
        className={cn("w-12 h-12 relative  overflow-hidden mx-auto")}
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
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Total
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <span className=" whitespace-nowrap   flex justify-center">€ {row.getValue("total")}</span>
    ),
    
  },
  {
    accessorKey: "bookingStatus",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Booking status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell:({row})=><span className={cn('px-4 py-2 text-xs font-bold rounded-md mx-auto w-fit block',styles[row.getValue!('bookingStatus') as string])}>{row.getValue('bookingStatus')}</span>
  },
  {
    accessorKey: "paymentStatus",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Payment status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell:({row})=><span className={cn('px-4 py-2 text-xs font-bold rounded-md mx-auto w-fit block',styles[row.getValue!('paymentStatus') as string])}>{row.getValue('paymentStatus')}</span>
  },
 
];
