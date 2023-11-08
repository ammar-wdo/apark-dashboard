'use client'

import { Booking } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"


export const columns: ColumnDef<Booking>[] = [
    {
      accessorKey: "bookingCode",
      header: "Booking code",
      cell:({row})=><Link className="underline" href={`/dashboard/bookings/${row.getValue('bookingCode')}`}>{row.getValue('bookingCode')}</Link>
    },
    {
      accessorKey: "parkingPrice",
      header: "Price",
    },
    {
      accessorKey: "paymentStatus",
      header: "Payment status",
    },
    {
      accessorKey: "paymentMethod",
      header: "Payment method",
    },
    {
      accessorKey: "total",
      header: "Total",
    },
    {
      accessorKey: "carModel",
      header: "Car model",
    },
    {
      accessorKey: "arrivalDate",
      header: "Arrival date",
      cell:({row})=><span>{new Date(row.getValue('arrivalDate')).toLocaleDateString()}</span>
    },
    {
      accessorKey: "departureDate",
      header: "departure date",
      cell:({row})=><span>{new Date(row.getValue('departureDate')).toLocaleDateString()}</span>
    },
  ]