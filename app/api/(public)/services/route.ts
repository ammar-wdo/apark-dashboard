import prisma from "@/lib/db";
import { Service } from "@prisma/client";
import { NextResponse } from "next/server";
import { calculateParkingDays } from "./(helpers)/findParkingDays";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const startDate = searchParams.get("startDate") as string;
  const endDate = searchParams.get("endDate") as string;
  const startTime = searchParams.get("startTime") as string;
  const endTime = searchParams.get("endTime") as string;

  try {
    const services = await prisma.service.findMany({
      where: {
        isActive: true,
      },
      include: {
        bookings: true,
        availability: true,
      },
    });

    const parkingDays = calculateParkingDays(
      new Date(startDate),
      new Date(endDate)
    );

    const validServices = services.map((service) => {

        const isBlocked = service.availability.map((range) => {
            console.log(new Date(startDate),new Date(endDate),new Date(range.startDate),new Date(range.endDate))
            if (
              (new Date(startDate) >= new Date(range.startDate) &&
                new Date(startDate) <= new Date(range.endDate)) ||
              (new Date(endDate) >= new Date(range.startDate) &&
                new Date(endDate) <= new Date(range.endDate)) ||
              (new Date(startDate) < new Date(range.startDate) &&
                new Date(endDate) > new Date(range.endDate)) 
            )
              {return range}else{
                return null
              }
          });
  
          if(!!isBlocked.filter((el)=>el!==null).length) return null

      const busyPlaces = service.bookings.map((booking) => {
        const arrivalDate = new Date(booking.arrivalDate);
        const departureDate = new Date(booking.departureDate);

      

        if (
          arrivalDate <= new Date(startDate) &&
          departureDate >= new Date(endDate)
        ) {
          return booking;
        } else return ;
      });

      const availabelPlaces = service.spots - busyPlaces.length;

      if (availabelPlaces > 0) {
        const totalPrice = service.pricings
          .slice(0, parkingDays)
          .reduce((total, value) => total + value, 0);

        return {
          ...service,
          totalPrice,
          startDate,
          endDate,
          startTime,
          endTime,
        };
      } else return null;
    });
const filteredValidServices = validServices.filter((service)=>service !==null)
console.log(filteredValidServices)
    return NextResponse.json(filteredValidServices);
  } catch (error) {
    console.log("failded to fetch services", error);
    return new NextResponse("internal error", { status: 500 });
  }
}
