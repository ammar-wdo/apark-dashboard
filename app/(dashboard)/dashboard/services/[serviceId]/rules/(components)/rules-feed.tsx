import { Availability, Rule } from "@prisma/client";
import React from "react";

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import RuleCard from "./rule-card";

type Props = {
  rules: Rule[];
};

const RulesFeed = ({ rules }: Props) => {
  return !rules.length ? (
    <p>No Pricing rules added</p>
  ) : (
    <div className="space-y-1 mt-20">

<Table>

  <TableHeader>
    <TableRow>
      <TableHead className=" text-center capitalize">Label</TableHead>
      <TableHead className="text-center capitalize">From</TableHead>
      <TableHead className="text-center capitalize">To</TableHead>
      <TableHead className="text-center capitalize">Type</TableHead>

      <TableHead className="text-center capitalize">Value</TableHead>
      <TableHead className="text-center capitalize">Percentage</TableHead>
      <TableHead className="text-center capitalize">Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
 

    {rules.map((rule) => (
        <RuleCard key={rule.id} rule={rule} />
      
      ))}


  </TableBody>
</Table>

    </div>
  );
};

export default RulesFeed;
