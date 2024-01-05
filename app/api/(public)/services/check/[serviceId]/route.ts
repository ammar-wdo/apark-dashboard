import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { calculateParkingDays } from "../../(helpers)/findParkingDays";
import { isServiceValid } from "../../../checkout/update/(helpers)/isServiceValid";
import { findTotalPrice } from "../../(helpers)/findTotalPrice";
import { getClientDates } from "../../(helpers)/getClientDates";
import { getFinalDates } from "../../(helpers)/getFinalDates";


export const GET = async (
  req: NextRequest,
  { params }: { params: { serviceId: string } }
) => {
  try {

    const seriviceId = params.serviceId;
    if (!seriviceId)
      return NextResponse.json(
        { error: "service Id is required" },
        { status: 400 }
      );

    const searchParams = req.nextUrl.searchParams;

    const startDate = searchParams.get("startDate") as string;
    const endDate = searchParams.get("endDate") as string;
    const startTime = searchParams.get("startTime") as string;
    const endTime = searchParams.get("endTime") as string;
    const bookingId = searchParams.get("bookingId");

    const userStart = searchParams.get("userStart") as string;
    const userEnd = searchParams.get("userEnd") as string;


    if (!startDate || !endDate || !startTime || !endTime)
      return NextResponse.json(
        { ignore: "not provided parameters" },
        { status: 200 }
      );

      const {adjustedStartDate,adjustedEndDate} = getFinalDates(startDate,endDate,startTime,endTime)

      if(adjustedStartDate.getTime()>= adjustedEndDate.getTime())   return NextResponse.json(
        { response: "Departure date should be greater than arrival date" },
        { status: 200 }
      );

   

      const amesterdam = new Date();

      amesterdam.setHours(amesterdam.getHours() + 1);
    
      amesterdam.setMinutes(amesterdam.getMinutes());
    
    
    
    
      if (adjustedStartDate.getTime() < amesterdam.getTime()) {
        console.log('bigger')
    
    
        return NextResponse.json(
          { response: `Arrival date should be greater than current date in Netherlands   ${new Date().toLocaleString('en-US',{timeZone:'Europe/Amsterdam'})}` },
          { status: 200 }
        );
      }
      
    
    
   


      

    const service = await prisma.service.findUnique({
      where: {
        id: seriviceId,
        isActive: true,
        available: true,
      },
      include: {
        bookings: {
          where: {
            paymentStatus: { in: ["SUCCEEDED", "PENDING"] },
            bookingStatus: "ACTIVE",
            ...(bookingId && { id: { not: bookingId } }),
          },
        },
        entity: {
          select: { entityName: true, airport: { select: { name: true } } },
        },
        availability: true,
        rules: true,
        extraOptions: {
          where: {
            isActive: true,
            available: true,
          },
        },
      },
    });

  

    if (!service)
      return NextResponse.json(
        { response: "service is not available" },
        { status: 200 }
      );
  
    const validService = isServiceValid(
      service,
      startDate,
      endDate,
      startTime,
      endTime
    );

  

    if (!validService)
      return NextResponse.json(
        { response: "Service is not available" },
        { status: 200 }
      );

    const parkingDays = calculateParkingDays(
     adjustedStartDate,
     adjustedEndDate
    );

    console.log("parking days",parkingDays)
    console.log(startDate,endDate)

    
    const totalPrice = findTotalPrice(service, parkingDays, adjustedStartDate, adjustedEndDate);

    console.log(totalPrice);

    if (totalPrice === 0 || totalPrice === undefined || !totalPrice)
      return NextResponse.json(
        { response: "service is not available" },
        { status: 200 }
      );

    const { rules, bookings, ...theService } = service;

    if (bookingId && userStart && userEnd) {
      const userParkingDays = calculateParkingDays(
        new Date(userStart),
        new Date(userEnd)
      );
      const userTotalPrice = findTotalPrice(
        service,
        userParkingDays,
        adjustedStartDate,
        adjustedEndDate
      );

      const newParkingDays = parkingDays > userParkingDays;
   
      const additionalDays = newParkingDays
        ? parkingDays - userParkingDays
        : undefined;
      let additionalPrice = newParkingDays ? +(totalPrice - userTotalPrice).toFixed(2) : 0;
      if (additionalPrice < 0) {
        additionalPrice = 0;
      }
console.log("additional price",additionalPrice)

      return NextResponse.json(
        { available: true, additionalPrice, additionalDays },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        service: {
          id: theService.id,
          name: theService.name,
          totalPrice: totalPrice,
          parkingDays: parkingDays,
          startDate: startDate,
          endDate: endDate,
          startTime: startTime,
          endTime: endTime,
          extraOptions: theService.extraOptions,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "internal error" }, { status: 400 });
  }
};
