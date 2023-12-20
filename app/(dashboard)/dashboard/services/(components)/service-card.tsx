"use client";

import ActionToolTip from "@/components/tool-tip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Service } from "@prisma/client";
import {
  CarIcon,
  Coins,
  CopyCheck,
  Edit,
  Euro,
  Key,
  Plug,
  PlusCircle,
  Warehouse,
} from "lucide-react";
import Link from "next/link";
import React from "react";

type Props = {
  service: Service;
};

const ServiceCard = ({ service }: Props) => {
  return (
    <div
      key={service.id}
      className="p-6 rounded-md max-w-[350px] w-full border shadow-md hover:shadow-lg transition flex flex-col "
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
        <p className="lowercase first-letter:capitalize  text-xs w-fit  flex items-center gap-2 ">
          {service.parkingLocation === "INDOOR" ? (
            <Warehouse className="p-1 " />
          ) : (
            <CarIcon className="p-1 " />
          )}
          {service.parkingLocation}
        </p>
        <p className="flex items-center gap-2 lowercase first-letter:capitalize   text-xs w-fit   ">
          {<Key className="p-1" />}
          {service.keyStatus}
        </p>
      </div>

      <Separator className="my-4 mt-auto" />
      <div className="flex items-center justify-between ">
        {!service.isActive && (
          <Badge className="bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/20">
            Pending
          </Badge>
        )}

        <span className="text-sm p-1 border rounded-lg ml-auto">
          {service.available ? "Available" : "Not available"}
        </span>
      </div>
      <Separator className="my-3" />
      <div className="grid grid-cols-2 gap-2 ">
        <ActionToolTip title="Edit your service" side="top">
          <Button asChild variant={"secondary"} className="text-xs">
            <Link
              className="flex items-center"
              href={`/dashboard/services/${service.id}`}
            >
                    <Edit className="mr-3 w-4 h-4" />
              Edit
        
            </Link>
          </Button>
        </ActionToolTip>
        <ActionToolTip title="Manage your pricing for each day" side="top">
          <Button asChild variant={"secondary"} className="text-xs">
            <Link
              className="flex items-center"
              href={`/dashboard/services/${service.id}/pricing`}
            >
                     <Euro className="mr-3 w-4 h-4" />
              Pricing
       
            </Link>
          </Button>
        </ActionToolTip>
      </div>
      <div className="grid grid-cols-3 gap-2 mt-2">
        <ActionToolTip
          title="Enable and disable your service for specific times"
          side="bottom"
        >
          <Button asChild variant={"secondary"} className="text-xs">
            <Link
              className="flex items-center"
              href={`/dashboard/services/${service.id}/availability`}
            >
              <CopyCheck className="w-4 h-4" />
            </Link>
          </Button>
        </ActionToolTip>
        <ActionToolTip
          title="Manage your payment rules for different dates"
          side="bottom"
        >
          <Button asChild variant={"secondary"} className="text-xs">
            <Link
              className="flex items-center"
              href={`/dashboard/services/${service.id}/rules`}
            >
              <Coins className="w-4 h-4" />
            </Link>
          </Button>
        </ActionToolTip>
        <ActionToolTip
          title="Manage your extra options for the service"
          side="bottom"
        >
          <Button asChild variant={"secondary"} className="text-xs">
            <Link
              className="flex items-center"
              href={`/dashboard/services/${service.id}/extra-options`}
            >
              <PlusCircle className="w-4 h-4" />
            </Link>
          </Button>
        </ActionToolTip>
      </div>
    </div>
  );
};

export default ServiceCard;
