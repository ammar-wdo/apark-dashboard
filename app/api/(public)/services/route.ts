import prisma from "@/lib/db";

import { NextResponse } from "next/server";
import { calculateParkingDays } from "./(helpers)/findParkingDays";

import { findValidServices } from "./(helpers)/findValidServices";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const startDate = searchParams.get("startDate") as string;
  const endDate = searchParams.get("endDate") as string;
  const startTime = searchParams.get("startTime") as string;
  const endTime = searchParams.get("endTime") as string;

  if(!startDate || !endDate || !startTime || !endTime) return new NextResponse('date and time is required',{status:400})

  try {
    const services = await prisma.service.findMany({
      where: {
        isActive: true,
      },
      include: {
        bookings: true,
        availability: true,
        rules:true
      },
    });

    const parkingDays = calculateParkingDays(
      new Date(startDate),
      new Date(endDate)
    );

    const validServices = findValidServices(services,startDate,endDate,startTime,endTime,parkingDays)

    return NextResponse.json(validServices);
  } catch (error) {
    console.log("failded to fetch services", error);
    return new NextResponse("internal error", { status: 500 });
  }
}
