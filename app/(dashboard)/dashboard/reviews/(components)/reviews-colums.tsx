"use client";

import ToolTip from "@/components/tool-tip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { Company, Entity, Review } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash } from "lucide-react";
import Link from "next/link";

import ReactStars from "react-stars";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

const themes: { [key: string]: string } = {
  PENDING: "bg-yellow-500/10 text-yellow-500",
  ACTIVE: "bg-green-500/10 text-green-500",
};

export const reviewColumns: ColumnDef<
  Review & { booking: { firstName: string; lastName: string; email: string } }
>[] = [
  {
    accessorKey: "booking.email",
    header: "E-mail",
    cell: ({ row }) => <p>{row.original.booking.email}</p>,
  },
  {
    accessorKey: "booking.firstName",
    header: "First name",
  },
  {
    accessorKey: "booking.lastName",
    header: "Last name",
  },
  {
    accessorKey: "rate",
    header: "Rate",
    cell: ({ row }) => (
      <ReactStars
        className="mx-auto"
        value={row.getValue("rate")}
        edit={false}
        count={5}
        size={18}
        color2={"#FEBA02"}
      />
    ),
  },
  {
    accessorKey: "reviewContent",
    header: "Content",
    cell: ({ row }) => (
      <ToolTip side="top" title={row.getValue("reviewContent")}>
        <p className="line-clamp-1">{row.getValue("reviewContent")}</p>
      </ToolTip>
    ),
  },
  {
    accessorKey: "visibility",
    header: "Visibility",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <p
        className={cn(
          "p-3 rounded-lg w-fit",
          themes[row.getValue("status") as string]
        )}
      >
        {row.getValue("status")}
      </p>
    ),
  },

];
