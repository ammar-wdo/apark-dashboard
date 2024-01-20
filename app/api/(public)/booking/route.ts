import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import { getCurrentDateInNetherlands } from "../checkout/update/(helpers)/toAmsterdam";

export const revalidate = 0;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const bookingId = searchParams.get("bookingId");
    if (!bookingId) return new NextResponse("Booking code is required");
    const review = searchParams.get("review");

    if (review === "true") {
      try {
        const booking = await prisma.booking.findUnique({
          where: {
            id: bookingId,
          },
          include: {
            reivew: { select: { id: true } },
            service: {
              select: { entityId: true },
            },
          },
        });

        if (booking?.reivew) {
          return NextResponse.json(
            { booking: null },
            { status: 200, statusText: "all ready has review" }
          );
        } else {
          return NextResponse.json({ booking }, { status: 200 });
        }
      } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "internal error" }, { status: 400 });
      }
    }

    const booking = await prisma.booking.findUnique({
      where: {
        id: bookingId,
        departureDate: {
          gte: new Date(),
        },
      },
    });

    return NextResponse.json({ booking }, { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse("internal error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { email, bookingCode } = await req.json();
    console.log(email, bookingCode);

    if (!email || !bookingCode)
      return new NextResponse("creadentials are required");

    const booking = await prisma.booking.findUnique({
      where: {
        email,
        bookingCode,
        paymentStatus: { in: ["SUCCEEDED"] },
        bookingStatus: "ACTIVE",
      
      },
    });

  

    if (!booking)
      return  NextResponse.json({message:'Invalid credentials'}, { status: 200 });

      console.log('date',new Date())
      console.log('booking arrival date',booking.arrivalDate)

      // const amesterdam = new Date();

      // amesterdam.setHours(amesterdam.getHours() + 1);
    
      // amesterdam.setMinutes(amesterdam.getMinutes());

      // console.log("booking arrival date string", booking?.arrivalDate.toLocaleString('en-US',{timeZoneName:'long'}));
      // console.log("booking arrival date hours", booking?.arrivalDate.getHours());
      // console.log("booking arrival date ", booking?.arrivalDate);
      // console.log("new date",amesterdam);
      // console.log("new date hours",amesterdam.getHours());

      if(booking.arrivalDate <= getCurrentDateInNetherlands())
      return  NextResponse.json({message:'U kunt uw boekingsgegevens niet bijwerken omdat de aankomstdatum al is verstreken.'}, { status: 200 });

    return NextResponse.json({ booking }, { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse("internal error", { status: 500 });
  }
}
