"use client";

import {format} from "date-fns"
import { cn } from "@/lib/utils";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button";
import { Booking, Service } from "@prisma/client";


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
        className="underline text-blue-600 dark:text-indigo-500"
        href={`/dashboard/bookings/${row.getValue("bookingCode")}`}
      >
        {row.getValue("bookingCode")}
      </Link>
    ),
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
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Last name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },

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
    cell:({row})=><div><p>{format(new Date( row.getValue('createdAt')),"EEEE, MMMM d, yyyy")}</p><p className="text-xs">{format(new Date( row.getValue('createdAt')),"HH:mm")}</p></div>

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
    cell:({row})=><div><p>{format(new Date( row.getValue('arrivalDate')),"EEEE, MMMM d, yyyy")}</p><p className="text-xs">{format(new Date( row.getValue('arrivalDate')),"HH:mm")}</p></div>
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
    cell:({row})=><div><p>{format(new Date( row.getValue('departureDate')),"EEEE, MMMM d, yyyy")}</p><p className="text-xs">{format(new Date( row.getValue('departureDate')),"HH:mm")}</p></div>
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
      <span className="space-x-3 whitespace-nowrap">$ {row.getValue("total")}</span>
    ),
    
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
    cell:({row})=><span className={cn('px-4 py-2 text-xs font-bold rounded-md ',styles[row.getValue!('paymentStatus') as string])}>{row.getValue('paymentStatus')}</span>
  },
 
];
