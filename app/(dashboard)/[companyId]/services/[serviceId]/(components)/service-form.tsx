'use client'

import React from 'react'
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { serviceSchema } from '../service-schema';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from 'next/navigation';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ParkingType, Service } from '@prisma/client';

type Props = {service:Service | null }

const ServiceForm = ({service}: Props) => {



    const form = useForm<z.infer<typeof serviceSchema>>({
      resolver: zodResolver(serviceSchema),
      defaultValues: {
        address:service?.address || '',
   arrivalTodos:service?.arrivalTodos || '',
   city:service?.city || '',
   departureTodos:service?.departureTodos || '',
   description:service?.description || '',
   distanceToAirport:service?.distanceToAirport || '',
   facilities:service?.facilities || [],
   importantInfo:service?.importantInfo || '',
   latitude:service?.latitude || '',
   logo:service?.logo || '',
   longitude:service?.longitude || '',
   parkingType:service?.parkingType || ParkingType.shuttle,
   timeToAirport:service?.timeToAirport || '',
   title:service?.title || '',
   zipcode:service?.zipcode || '',
      },
    });
    const { toast } = useToast()
    const router = useRouter()
  

  return (
    <div>ServiceForm</div>
  )
}

export default ServiceForm