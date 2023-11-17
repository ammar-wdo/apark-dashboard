"use client";

import { format } from "date-fns";
import { cn } from "@/lib/utils";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Service } from "@prisma/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ToolTip from "@/components/tool-tip";
import ActionToolTip from "@/components/tool-tip";

export const columnsService: ColumnDef<Service>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },

  {
    id: "id",
    accessorKey: "id",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="">
            <ActionToolTip title="Edit your service" side="left">
              <DropdownMenuItem className="cursor-pointer p-3" asChild>
                <Link href={`/dashboard/services/${row.getValue("id")}`}>
                  Edit
                </Link>
              </DropdownMenuItem>
            </ActionToolTip>
       
            <ActionToolTip title="Manage your pricing for each day" side="left">
              <DropdownMenuItem className="cursor-pointer p-3" asChild>
                <Link
                  href={`/dashboard/services/${row.getValue("id")}/pricing`}
                >
                  Pricing
                </Link>
              </DropdownMenuItem>
            </ActionToolTip>
       
            <ActionToolTip title="Manage your disabled date ranges" side="left">
              <DropdownMenuItem className="cursor-pointer p-3" asChild>
                <Link
                  href={`/dashboard/services/${row.getValue(
                    "id"
                  )}/availability`}
                >
                  Availability
                </Link>
              </DropdownMenuItem>
            </ActionToolTip>
       
           
              <ActionToolTip
              title="Manage your payment rules for different dates"
              side="left"
            >
              <DropdownMenuItem className="cursor-pointer p-3" asChild>
                <Link href={`/dashboard/services/${row.getValue("id")}/rules`}>
                  Payment rules
                </Link>
              </DropdownMenuItem>
            </ActionToolTip>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
