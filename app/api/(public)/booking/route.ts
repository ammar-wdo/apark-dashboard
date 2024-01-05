import prisma from "@/lib/db";
import { NextResponse } from "next/server";

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

    console.log("booking departure date string", booking?.departureDate.toLocaleString('en-US',{timeZoneName:'long'}));
    console.log("booking departure date hours", booking?.departureDate.getHours());
    console.log("booking departure date ", booking?.departureDate);
    console.log("new date", new Date());
    console.log("new date hours", new Date().getHours());

    if (!booking)
      return  NextResponse.json({message:'Invalid credentials'}, { status: 200 });

      if(booking.arrivalDate <= new Date())
      return  NextResponse.json({message:'You can not update your booking info because arrival date has already passed.'}, { status: 200 });

    return NextResponse.json({ booking }, { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse("internal error", { status: 500 });
  }
}
