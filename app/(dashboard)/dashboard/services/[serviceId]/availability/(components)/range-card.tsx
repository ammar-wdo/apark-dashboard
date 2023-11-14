"use client";
import { TableCell, TableRow } from "@/components/ui/table";
import { useModal } from "@/hooks/use-modal";
import { format } from "date-fns";
import { Trash, XIcon } from "lucide-react";
import { useParams } from "next/navigation";
import React from "react";

type Props = {
  startDate: Date;
  endDate: Date;
  label?: string | null;
  rangeId: string;
};

const RangeCard = ({ startDate, endDate, label, rangeId }: Props) => {
  const { setOpen } = useModal();

  const params = useParams();

  return (
   

<TableRow>
      <TableCell className="font-medium text-center capitalize">{label}</TableCell>
      <TableCell className="text-center"> {format(startDate, "yyyy - MM - dd")}</TableCell>
      <TableCell className="text-center">  {format(endDate, "yyyy - MM - dd")}</TableCell>
      <TableCell className=" text-center"><button
        onClick={() =>
          setOpen("delete-modal", {
            url: `/api/service/${params.serviceId}/availability/${rangeId}`,
            redirect: `/dashboard/services/${params.serviceId}/availability`,
          })
        }
        type="button"
        className="p-1 bg-rose-500 text-white flex mx-auto items-center justify-center rounded-sm transition hover:bg-rose-500/90"
      >
        <Trash className="w-3 h-3" />
      </button></TableCell>
    </TableRow>
    
      
 
  );
};

export default RangeCard;
