import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import { daysAndTotal } from "../checkout/(helpers)/days-and-total";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}
export const POST = async (req: Request) => {
  try {
    const body = await req.json();


    if(!body.code || !body.startDate || !body.endDate || !body.serviceId) return NextResponse.json(
        { message: "all info are required" },
        { status: 400 }
      );

    const discount = await prisma.discount.findUnique({
      where: { code: body.code },
    });

    if (!discount)
      return NextResponse.json(
        { message: "Invalid promocode" },
        { status: 200 }
      );


      const service = await prisma.service.findUnique({where:{id:body.serviceId}})
      if(!service)  return NextResponse.json(
        { message: "service is not available" },
        { status: 400 }
      );

      const bookingStart = new Date(body.startDate);
      const bookingEnd = new Date(body.endDate);

      const {total} = await daysAndTotal(bookingStart,bookingEnd,body.serviceId)

      if(discount.type === "FIXED" && discount.value! >=total) return NextResponse.json(
        { message: "Promocode is not applicable to this service with this date range!" },
        { status: 200 }
      );


    if (discount.based === "CREATING") {
      const currentDate = new Date();
      const startDate = new Date(discount.startDate);
      const endDate = new Date(discount.endDate);

      console.log('startDate',startDate)
      console.log('endDate',endDate)

      if (currentDate >= startDate && currentDate <= endDate) {
        return NextResponse.json(
          {
            label: discount.code,
            percentage:discount.type==='PERCENTAGE' ? discount.percentage : undefined,
            value:discount.type==='FIXED' ? discount.value : undefined,
            id: discount.id,
          },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { message: "Promocode is not applicable to your booking" },
          { status: 200 }
        );
      }
    } else if (discount.based === "BOOKING") {
      const promoStart = new Date(discount.startDate);
      const promoEnd = new Date(discount.endDate);
   

      console.log('startDate',bookingStart)
      console.log('endDate',bookingEnd)
      console.log('promoStart',promoStart)
      console.log('promoEnd',promoEnd)

      if (bookingStart <= promoEnd && bookingEnd >= promoStart) {
        return NextResponse.json(
          {
            label: discount.code,
            percentage:discount.type==='PERCENTAGE' ? discount.percentage : undefined,
            value:discount.type==='FIXED' ? discount.value : undefined,
            id: discount.id,
          },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { message: "Promocode is not applicable to your booking" },
          { status: 200 }
        );
      }
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "internal error" }, { status: 500 });
  }
};
