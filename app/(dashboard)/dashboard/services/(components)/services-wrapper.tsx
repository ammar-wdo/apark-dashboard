import React from "react";
import { DataTable } from "./data-table";
import { columnsService } from "./columns";
import { getServerSession } from "next-auth";
import prisma from "@/lib/db";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getCurrentCompany } from "@/lib/helpers";
import { CarIcon, Coins, CopyCheck, Edit, Euro, Key, Plug, Warehouse } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import ActionToolTip from "@/components/tool-tip";

type Props = {
  entityId: string | undefined | string[];
};

const ServicesWrapper = async ({ entityId }: Props) => {
  let services;
  const currentCompany = await getCurrentCompany();
  if (!currentCompany) throw Error("Unauthenticated");

  const session = await getServerSession(authOptions);
  if (session?.user?.name === "Entity") {
    services = await prisma.service.findMany({
      where: {
        entityId: currentCompany?.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        entity: { select: { airport: { select: { name: true } } } },
      },
    });
  } else {
    if (entityId) {
      services = await prisma.service.findMany({
        where: {
          entityId: entityId as string,
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          entity: { select: { airport: { select: { name: true } } } },
        },
      });
    } else {
      services = await prisma.service.findMany({
        where: {
          entity: {
            companyId: currentCompany?.id,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          entity: { select: { airport: { select: { name: true } } } },
        },
      });
    }
  }

  return (
    <div className="flex flex-wrap gap-8">
      {services.map((service) => (
        <div
          key={service.id}
          className="p-6 rounded-md max-w-[350px] w-full border shadow-md flex flex-col "
        >
          <h3 className="text-xl font-bold mb-6">{service.name}</h3>
         
          <p>{service.parkingAddress}</p>
          <p>
            {service.parkingZipcode} {service.parkingPlace}
          </p>
          <div className="flex flex-col gap-1 my-8 text-muted-foreground">
          {!!service.electricCharging && (
            <p className="flex items-center gap-2  text-xs w-fit   ">
              {<Plug className=" p-1 " />}
              Electric charging 
            </p>
          )}
           <p className="lowercase first-letter:capitalize  text-xs w-fit  flex items-center gap-2 ">{service.parkingLocation==='INDOOR' ? <Warehouse  className="p-1 "/>:<CarIcon  className="p-1 "/>}{service.parkingLocation}</p>
          <p className="flex items-center gap-2 lowercase first-letter:capitalize   text-xs w-fit   ">
            {<Key className="p-1" />}
            {service.keyStatus}
          </p>
          </div>
          
          <Separator className="my-4 mt-auto" />
          <div className="flex items-center justify-between ">
          {!service.isActive &&<Badge
            className="bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/20"
          >
             Pending
          </Badge>}

          <span className="text-sm p-1 border rounded-lg ml-auto">{service.available  ? "Available" : "Not available"}</span>
            </div>
        <Separator className="my-3" /> 
          <div className="grid grid-cols-2 gap-2 ">
          <ActionToolTip title="Edit your service" side="top">
            <Button variant={'secondary'} 
            className="text-xs"
            >
              <Link className="flex items-center" href={`/dashboard/services/${service.id}`}>
              Edit
              <Edit className="ml-3 w-4 h-4" />
              </Link>

            </Button>
            </ActionToolTip>
          <ActionToolTip title="Manage your pricing for each day" side="top">
            <Button variant={'secondary'}
            className="text-xs"
            >
              <Link className="flex items-center" href={`/dashboard/services/${service.id}/pricing`}>
              Pricing
              <Euro className="ml-3 w-4 h-4" />
              </Link>

            </Button>
            </ActionToolTip>
          <ActionToolTip title="Enable and disable your service for specific times" side="bottom">
            <Button variant={'secondary'}
            className="text-xs"
            >
              <Link className="flex items-center" href={`/dashboard/services/${service.id}/availability`}>
              Availability
              <CopyCheck className="ml-3 w-4 h-4" />
              </Link>

            </Button>
            </ActionToolTip>
          <ActionToolTip title="Manage your payment rules for different dates" side="bottom">
            <Button variant={'secondary'}
            className="text-xs"
            >
              <Link className="flex items-center" href={`/dashboard/services/${service.id}/rules`}>
              Payment rules
              <Coins className="ml-3 w-4 h-4" />
              </Link>

            </Button>
            </ActionToolTip>
           
          </div>
        </div>
      ))}
    </div>
  );
};

export default ServicesWrapper;
