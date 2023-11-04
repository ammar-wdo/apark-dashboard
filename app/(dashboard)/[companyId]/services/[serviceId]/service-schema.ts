"use client"
 
import { Service ,ParkingType} from "@prisma/client"
import * as z from "zod"
 
export const serviceSchema = z.object({
   address:z.string().min(1),
   arrivalTodos:z.string().optional(),
   city:z.string(),
   departureTodos:z.string().optional(),
   description:z.string().min(1),
   distanceToAirport:z.string().optional(),
   facilities:z.array(z.string()),
   importantInfo:z.string().optional(),
   latitude:z.string().optional(),
   logo:z.string().min(1),
   longitude:z.string().optional(),
   parkingType:z.enum(['shuttle','valet']),
   timeToAirport:z.string().optional(),
   title:z.string().min(1),
   zipcode:z.string().min(1),
   
  
})


export const serviceDefaultValues = (service:Service | null)=>({
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
 })