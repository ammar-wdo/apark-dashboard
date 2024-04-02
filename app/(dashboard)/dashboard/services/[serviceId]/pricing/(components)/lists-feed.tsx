import Heading from "@/components/heading";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/db";
import { Edit, PlusCircle } from "lucide-react";
import Link from "next/link";
import React from "react";
import ListCard from "./list-card";

type Props = { serviceId: string };

const ListFeed = async ({ serviceId }: Props) => {
  const lists = await prisma.list.findMany({
    where: {
      serviceId,
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <Heading
          title="Additional lists"
          description="Manage Additional lists"
        />
        <Button asChild>
          <Link
            href={`/dashboard/services/${serviceId}/pricing/new`}
            className="flex items-center gap-2 p-4 rounded-md"
          >
            <PlusCircle className="" /> New List
          </Link>
        </Button>
      </div>

      {!lists.length && (
        <p className="mt-12 text-center text-muted-foreground capitalize text-lg">
          {" "}
          No lists added
        </p>
      )}
      {!!lists.length && (
        <div className="flex flex-wrap gap-6 items-center">
          {lists.map((list) => (
           <ListCard list={list}  serviceId={serviceId}/>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListFeed;
