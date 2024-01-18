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
      className="p-6 rounded-md max-w-[375px] w-full border  transition flex flex-col separate "
    >
      <div className="flex items-center justify-between">
        <div>
        <h3 className="text-xl font-bold mb-6">{service.name}</h3>

<p>{service.parkingAddress}</p>
<p>
  {service.parkingZipcode} {service.parkingPlace}
</p>
        </div>
        <div className="p-2 rounded-full border text-[11px] flex flex-col  justify-center items-center">
          <span>
          {service.spots}
            </span> <span className="font-bold">plekken</span>
        </div>
     
      </div>
      
      <div className="flex flex-col gap-1 my-8 text-muted-foreground">
        {!!service.electricCharging && (
          <p className="flex items-center gap-2  text-xs w-fit   ">
            {<Plug className=" p-1 " />}
            elektrisch laden
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
            in behandeling
          </Badge>
        )}

        <span className="text-sm p-1 border rounded-lg ml-auto">
          {service.available ? "Beschikbaar" : "Niet Beschikbaar"}
        </span>
      </div>
      <Separator className="my-3" />
      <div className="grid grid-cols-2 gap-2 ">
        <ActionToolTip title="Pas uw service aan" side="top">
          <Button asChild variant={"secondary"} className="text-xs">
            <Link
              className="flex items-center"
              href={`/dashboard/services/${service.id}`}
            >
                    <Edit className="mr-3 w-4 h-4" />
              Bewerken
        
            </Link>
          </Button>
        </ActionToolTip>
        <ActionToolTip title="Beheer uw prijzen per dag" side="top">
          <Button asChild variant={"secondary"} className="text-xs">
            <Link
              className="flex items-center"
              href={`/dashboard/services/${service.id}/pricing`}
            >
                     <Euro className="mr-3 w-4 h-4" />
              Prijzen
       
            </Link>
          </Button>
        </ActionToolTip>
      </div>
      <div className="grid grid-cols-3 gap-2 mt-2">
        <ActionToolTip
        header="Beschikbaarheid"
          title="Schakel uw service in en uit voor specifieke dagen"
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
        header="Regels"
          title="Beheer prijsregels"
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
        header="Extra opties"
          title="Beheer opties"
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
