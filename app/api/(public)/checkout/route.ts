import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import { isAvailable } from "./(helpers)/isAvailable";
import prisma from "@/lib/db";
import { STATUS } from "@prisma/client";

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
    const {
      bookingOnBusinessName,
      extraServiceFee,

      address,
      arrivalDate,
      bookingCode,
      carColor,
      carLicense,
      carModel,
      serviceId,
      companyName,
      arrivalTime,
      departureTime,
      daysofparking,
      departureDate,
      discount,
      flightNumber,

      parkingPrice,

      paymentMethod,
      place,
      returnFlightNumber,
      total,
      vatNumber,
      zipcode,
    } = await req.json();

    const available = await isAvailable(serviceId);

    if (!available)
      return NextResponse.json(
        { customError: "This service is not available" },
        { status: 400 }
      );

    if (!serviceId)
      return new NextResponse("service Id is mandatory", { status: 400 });
    if (!total) return new NextResponse("Total is mandatory", { status: 400 });
    if (!daysofparking)
      return new NextResponse("Days of parking is mandatory", { status: 400 });
    if (!departureDate)
      return new NextResponse("Departure date of parking is mandatory", {
        status: 400,
      });
    if (!arrivalDate)
      return new NextResponse("Arrival date of parking is mandatory", {
        status: 400,
      });
    if (!bookingCode)
      return new NextResponse("Booking code is mandatory", { status: 400 });

    if (!departureTime)
      return new NextResponse("departure timeis mandatory", { status: 400 });
    if (!arrivalTime)
      return new NextResponse("arrival time is mandatory", { status: 400 });
    if (!carColor)
      return new NextResponse("car color is mandatory", { status: 400 });
    if (!carLicense)
      return new NextResponse("car license is mandatory", { status: 400 });
    if (!carModel)
      return new NextResponse("car model is mandatory", { status: 400 });

    if (!paymentMethod)
      return new NextResponse("payment method is mandatory", { status: 400 });

    const booking = await prisma.booking.create({
      data: {
        bookingOnBusinessName,
        extraServiceFee,

        address,
        arrivalDate,
        bookingCode,
        carColor,
        carLicense,
        carModel,
        serviceId,
        companyName,
        arrivalTime,
        departureTime,
        daysofparking,
        departureDate,
        discount,
        flightNumber,

        parkingPrice,

        paymentMethod,
        place,
        returnFlightNumber,
        total,
        vatNumber,
        zipcode,
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
metadata:{id:booking.id},
      success_url: "http://localhost:3000/checkout?success=true",
      cancel_url: "http://localhost:3000/checkout?canceled=true",
    });

    console.log(session.metadata)
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
