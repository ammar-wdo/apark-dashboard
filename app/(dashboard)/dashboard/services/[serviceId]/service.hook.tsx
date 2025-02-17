import { useEdgeStore } from "@/lib/edgestore";
import { useEffect, useState } from "react";

import { useParams, useRouter } from "next/navigation";
import * as z from "zod";

import { Key, ParkingLocation, ParkingType, Service } from "@prisma/client";
import axios from "axios";
import { UseFormReturn, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, XIcon } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { serviceSchema } from "@/schemas";

type Props = {
 
  service:Service | null,
  isCompany:boolean,
  entityId:string | undefined
 
};
export const useService = ({service,isCompany,entityId}: Props) => {
  const params = useParams();



  const form = useForm<z.infer<typeof serviceSchema>>({
    resolver: zodResolver(serviceSchema),
    defaultValues:  { name: service?.name || "",
    terms: service?.terms || "",
    bookingsEmail: service?.bookingsEmail || "",
    parkingAddress: service?.parkingAddress || "",
    parkingZipcode: service?.parkingZipcode || "",
    parkingCountry: service?.parkingCountry || "",
    parkingPlace: service?.parkingPlace || "",
    arrivalTodos: service?.arrivalTodos || "",
    departureTodos: service?.departureTodos || "",
    electricCharging :service?.electricCharging || false,
    keyStatus:service?.keyStatus || Key.LEAVE,
    parkingLocation:service?.parkingLocation || ParkingLocation.INDOOR,
    parkingType: service?.parkingType || ParkingType.shuttle,
    spots: service?.spots || 1,
    available: service?.available || false,
  isParkingproService:service?.isParkingproService ,
  parkingproId:service?.parkingproId || undefined,
    entityId:service?.entityId || ''},
  });



useEffect(()=>{
  if(!isCompany){
    form.setValue('entityId',entityId!)
  }
},[isCompany])



  


  const { edgestore } = useEdgeStore();

  


  const router = useRouter();

  async function onSubmit(values: z.infer<typeof serviceSchema>) {
    try {
     

      if(service){
        const service: Service = await axios.patch(
          `/api/service/${params.serviceId}`,
          values
        );
      }else{
        const service: Service = await axios.post(
          `/api/service`,
          values
        );
      }
   
      toast.success(`service has been ${service ? "edited" : " created"}`)
      router.push(`/dashboard/services`);
      router.refresh()
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong')
    }
  }


  

  

  return {
 
    onSubmit,
   
    form,
 
  };
};
