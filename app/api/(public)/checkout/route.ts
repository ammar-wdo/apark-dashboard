import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import { isAvailable } from "./(helpers)/isAvailable";
import prisma from "@/lib/db";
import { STATUS } from "@prisma/client";
import { bookingSchema } from "@/schemas";
import { daysAndTotal } from "./(helpers)/days-and-total";
import { nanoid } from 'nanoid';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    body.arrivalDate = new Date(body.arrivalDate);
    body.departureDate = new Date(body.departureDate);
console.log(body)
    const validBody = bookingSchema.safeParse(body);
    if (!validBody.success)
      return NextResponse.json(validBody.error, { status: 400 });

    const available = await isAvailable(body.serviceId);

    if (!available)
      return NextResponse.json(
        { customError: "This service is not available" },
        { status: 400 }
      );

    const { total, daysofparking } = await daysAndTotal(
      validBody.data.arrivalDate,
      validBody.data.departureDate,
      validBody.data.serviceId
    );


    let bookingCode = nanoid(9);
    let existingBooking = await prisma.booking.findFirst({
      where: {
        bookingCode: bookingCode,
      },select:{bookingCode:true}
    });
    
    while (existingBooking) {
      bookingCode = nanoid(9);
      existingBooking = await prisma.booking.findFirst({
        where: {
          bookingCode: bookingCode,
        },select:{bookingCode:true}
      });
    }
  

    const booking = await prisma.booking.create({
      data: {
        ...validBody.data,
        bookingCode,
        total: total as number,
        daysofparking,
      },
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],

      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "service",
              description: `Booking for ${daysofparking} day(s) parking `,
            },
            unit_amount: total * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      metadata: { id: booking.id },
      success_url: `${process.env.NEXT_PUBLIC_FRONTEND!}/checkout?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_FRONTEND!}/checkout?canceled=true`,
    });

    console.log(session.metadata);
    return NextResponse.json(
      { url: session.url },
      {
        headers: corsHeaders,
      }
    );
  } catch (error) {
    console.log(error);
    return new NextResponse("internal error", { status: 500 });
  }
}
