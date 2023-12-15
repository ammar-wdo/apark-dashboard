import prisma from "@/lib/db";

import { NextResponse } from "next/server";
import { calculateParkingDays } from "./(helpers)/findParkingDays";

import { findValidServices } from "./(helpers)/findValidServices";
import { Key, ParkingLocation, ParkingType } from "@prisma/client";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);


const airport = searchParams.get('airport') as string
  const startDate = searchParams.get("startDate") as string;
  const endDate = searchParams.get("endDate") as string;
  const startTime = searchParams.get("startTime") as string;
  const endTime = searchParams.get("endTime") as string;

  const serviceType = searchParams.getAll("serviceType") as ParkingType[] | undefined;
  const location = searchParams.getAll("location") as ParkingLocation[] | undefined;
  const carsKey = searchParams.getAll("carsKey") as Key[] | undefined;
  const electric = searchParams.get("electric") as string | undefined;

  console.log('Filters',serviceType,location,carsKey,electric)

  if (!airport || !startDate || !endDate || !startTime || !endTime)
    return new NextResponse("date and time is required", { status: 400 });

  try {
    const services = await prisma.service.findMany({
      where: {
        entity:{airport:{id:airport}},
        isActive: true,
        ...(serviceType?.length ? { parkingType: { in: serviceType } } : {}),
        ...(location?.length ? { parkingLocation: { in: location } } : {}),
        ...(carsKey?.length ? { keyStatus: { in: carsKey } } : {}),
        ...(electric ? { electricCharging: true } : {}),
      },
      include: {
        bookings: {
          where: { paymentStatus: { in: ['SUCCEEDED', 'PENDING'] }, bookingStatus: 'ACTIVE' },
          
        },
        entity:{
          select:{entityName:true,airport:{select:{name:true}}}
        },
        availability: true,
        rules: true,
      },
    });

    console.log(services)

 

    const parkingDays = calculateParkingDays(
      new Date(startDate),
      new Date(endDate)
    );

    const validServices = findValidServices(
      services,
      startDate,
      endDate,
      startTime,
      endTime,
      parkingDays
    );


   const invalidServices = services.filter((service)=>{

    if(validServices.some(valid=>valid.id===service.id)) return false
    // else if(service.available===true) return false
    else return true
   })



   const finalValid = validServices.filter((service)=>service.available===true)
   const finalInvalid = [...invalidServices,...validServices.filter((service)=>service.available===false)]

    return NextResponse.json({valid:finalValid,invalid:finalInvalid,total:services.length});
  } catch (error) {
    console.log("failded to fetch services", error);
    return new NextResponse("internal error", { status: 500 });
  }
}
