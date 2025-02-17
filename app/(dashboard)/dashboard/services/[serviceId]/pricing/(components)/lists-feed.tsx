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
    },orderBy:{
      createdAt:'desc'
    }
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <Heading
          title="Aanvullende lijsten"
          description="Beheer aanvullende lijsten"
        />
        <Button asChild>
          <Link
            href={`/dashboard/services/${serviceId}/pricing/new`}
            className="flex items-center gap-2 p-4 rounded-md"
          >
            <PlusCircle className="" /> Nieuwe Lijst
          </Link>
        </Button>
      </div>

      {!lists.length && (
        <p className="mt-12 text-center text-muted-foreground capitalize text-lg">
          {" "}
          Geen lijsten toegevoegd
        </p>
      )}
      {!!lists.length && (
        <div className="flex flex-wrap gap-6 items-center">
          {lists.map((list) => (
           <ListCard list={list} key={list.id}  serviceId={serviceId}/>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListFeed;
