"use client";
import { TableCell, TableRow } from "@/components/ui/table";
import { useModal } from "@/hooks/use-modal";
import { Rule } from "@prisma/client";
import { format } from "date-fns";
import { Edit, Trash, XIcon } from "lucide-react";
import { useParams } from "next/navigation";
import React from "react";

type Props = {
 rule:Rule
};

const RuleCard = ({ rule}: Props) => {
  const { setOpen } = useModal();

  const params = useParams();

  return (
   

<TableRow>
      <TableCell className="font-medium text-center capitalize">{rule.label}</TableCell>
      <TableCell className="text-center"> {format(rule.startDate, "yyyy - MM - dd")}</TableCell>
      <TableCell className="text-center">  {format(rule.endDate, "yyyy - MM - dd")}</TableCell>
      <TableCell className="text-center"> {rule.type} </TableCell>
  
      <TableCell className="text-center"> {rule.value ? "€"+rule.value : "N/A"} </TableCell>
      <TableCell className="text-center"> {rule.percentage ? "%" + rule.percentage : "N/A"} </TableCell>
      <TableCell className=" text-center">
        <div className="flex items-center gap-1 justify-center"><button
        onClick={() =>
          setOpen("delete-modal", {
            url: `/api/service/${params.serviceId}/rules/${rule.id}`,
            redirect: `/dashboard/services/${params.serviceId}/rules`,
          })
        }
        type="button"
        className="p-1 bg-rose-500 text-white flex  items-center justify-center rounded-sm transition hover:bg-rose-500/90"
      >
        <Trash className="w-3 h-3" />
      </button>
      <button
        onClick={() =>
          setOpen("rule-modal", {
           rule:rule
          })
        }
        type="button"
        className="p-1 bg-primary text-white flex  items-center justify-center rounded-sm transition hover:bg-primary/90"
      >
        <Edit className="w-3 h-3" />
      </button></div></TableCell>
   
    </TableRow>
    
      
 
  );
};

export default RuleCard;
