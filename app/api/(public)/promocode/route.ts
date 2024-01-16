import prisma from "@/lib/db";
import { NextResponse } from "next/server";

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

    const discount = await prisma.discount.findUnique({
      where: { code: body.code },
    });

    if (!discount)
      return NextResponse.json(
        { message: "Invalid promocode" },
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
            label: discount.label,
            percentage: discount.percentage,
            value: discount.value,
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
      const bookingStart = new Date(body.startDate);
      const bookingEnd = new Date(body.endDate);

      console.log('startDate',bookingStart)
      console.log('endDate',bookingEnd)
      console.log('promoStart',promoStart)
      console.log('promoEnd',promoEnd)

      if (bookingStart <= promoEnd && bookingEnd >= promoStart) {
        return NextResponse.json(
          {
            label: discount.label,
            percentage: discount.percentage,
            value: discount.value,
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
