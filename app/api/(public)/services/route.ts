import prisma from "@/lib/db";

import { NextResponse } from "next/server";
import { calculateParkingDays } from "./(helpers)/findParkingDays";

import { findValidServices } from "./(helpers)/findValidServices";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  console.log("hi");
const airport = searchParams.get('airport') as string
  const startDate = searchParams.get("startDate") as string;
  const endDate = searchParams.get("endDate") as string;
  const startTime = searchParams.get("startTime") as string;
  const endTime = searchParams.get("endTime") as string;

  if (!airport || !startDate || !endDate || !startTime || !endTime)
    return new NextResponse("date and time is required", { status: 400 });

  try {
    const services = await prisma.service.findMany({
      where: {
        airportId:airport,
        isActive: true,
      },
      include: {
        bookings: {
          where: { paymentStatus: { in: ["SUCCEEDED", "PENDING"] },bookingStatus:'ACTIVE' },
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

    console.log('services',services.length)
   const invalidServices = services.filter((service)=>{

    if(validServices.some(valid=>valid.id===service.id)) return false
    // else if(service.available===true) return false
    else return true
   })

   console.log("invalid services",invalidServices)


   const finalValid = validServices.filter((service)=>service.available===true)
   const finalInvalid = [...invalidServices,...validServices.filter((service)=>service.available===false)]

    return NextResponse.json({valid:finalValid,invalid:finalInvalid,total:services.length});
  } catch (error) {
    console.log("failded to fetch services", error);
    return new NextResponse("internal error", { status: 500 });
  }
}
