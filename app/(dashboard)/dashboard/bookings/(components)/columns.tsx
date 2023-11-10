"use client";

import { Booking } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import Link from "next/link";

const paymentImage: { [key: string]: string } = {
  MASTER_CARD: "/mastercard.png",
  VISA_CARD: "/visacard.png",
  AMERICAN_EXPRESS: "/americanexpress.png",
  PAYPALL: "/paypal.webp",
};

export const columns: ColumnDef<Booking>[] = [
  {
    accessorKey: "bookingCode",
    header: "Booking code",
    cell: ({ row }) => (
      <Link
        className="underline"
        href={`/dashboard/bookings/${row.getValue("bookingCode")}`}
      >
        {row.getValue("bookingCode")}
      </Link>
    ),
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
    cell: ({ row }) => (
      <div
        title={row.getValue("paymentMethod")}
        className="w-12 h-12 relative  overflow-hidden "
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
      <span className="flex items-center gap-1">$ {row.getValue("total")}</span>
    ),
    
  },
  {
    accessorKey: "carModel",
    header: "Car model",
  },
  {
    accessorKey: "arrivalDate",
    header: "Arrival date",
    cell: ({ row }) => (
      <span>{new Date(row.getValue("arrivalDate")).toLocaleDateString()}</span>
    ),
  },
  {
    accessorKey: "departureDate",
    header: "departure date",
    cell: ({ row }) => (
      <span>
        {new Date(row.getValue("departureDate")).toLocaleDateString()}
      </span>
    ),
  },
];
