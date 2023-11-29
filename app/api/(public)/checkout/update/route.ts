import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

import prisma from "@/lib/db";
import { STATUS } from "@prisma/client";
import { bookingSchema } from "@/schemas";

import { nanoid } from "nanoid";
import { daysAndTotal } from "../(helpers)/days-and-total";
import { findValidServices } from "../../services/(helpers)/findValidServices";
import { isAvailable } from "../(helpers)/isAvailable";
import { isServiceValid } from "./(helpers)/isServiceValid";
import { calculateParkingDays } from "../../services/(helpers)/findParkingDays";
import { findTotalPrice } from "./(helpers)/findNewTotal";
import { setLog } from "../../(helpers)/set-log";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const methods = {
  IDEAL: "ideal",
  CREDIT_CARD: "card",
  PAYPAL: "paypal",
};
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    body.arrivalDate = new Date(body.arrivalDate);
    body.departureDate = new Date(body.departureDate);

    const { id, bookingCode, ...rest } = body;

    if (!bookingCode)
      return new NextResponse("Invalid credintials, bookingCode is required", {
        status: 400,
      });

    const validBody = bookingSchema.safeParse(rest);
    if (!validBody.success)
      return NextResponse.json(validBody.error, { status: 400 });

    const newArrival = validBody.data.arrivalDate;
    const newDeparture = validBody.data.departureDate;

    const booking = await prisma.booking.findUnique({
      where: {
        id: id,
        serviceId: validBody.data.serviceId,
        email: validBody.data.email,
        bookingCode: bookingCode,
      },
    });

    if (!booking)
      return new NextResponse("Invalid credintials", { status: 400 });

    const service = await prisma.service.findUnique({
      where: {
        id: validBody.data.serviceId,
      },
      include: {
        bookings: {
          where: { paymentStatus: { in: ["SUCCEEDED", "PENDING"] } },
        },
        availability: true,
        rules: true,
      },
    });

    if (!service)
      return NextResponse.json(
        { customError: "This service does not exist" },
        { status: 400 }
      );

    const available = await isAvailable(body.serviceId);

    if (!available)
      return NextResponse.json(
        { customError: "This service is not available" },
        { status: 400 }
      );

    const newPakingDays = calculateParkingDays(newArrival, newDeparture);
    let newDays;
    if (newPakingDays > booking?.daysofparking) {
      newDays = newPakingDays - booking?.daysofparking;
    } else {
      newDays = 0;
    }

    const validService = isServiceValid(
      service,
      newArrival.toString(),
      newDeparture.toString(),
      booking.id,
      newDays
    );
    if (!validService)
      return new NextResponse("This service is no more available", {
        status: 400,
      });

    const newPrice = findTotalPrice(
      service,
      newDays + booking?.daysofparking,
      newArrival.toString(),
      newDeparture?.toString()
    );
    console.log("TOTAL DAYS", newPakingDays);
    console.log("NEW DAYS", newDays);
    console.log("NEW TOTAL PRICE", newPrice);
    console.log("NEW TOTAL PRICE", newPrice - booking.total);

    const additionalPrice = newPrice - booking.total;

    const entity = await prisma.entity.findFirst({
      where: {
        services: {
          some: { id: service.id },
        },
      },
    });

    if (newDays === 0) {
      const updatedBooking = await prisma.booking.update({
        where: {
          id: booking.id,
        },
        data: {
          ...validBody.data,
          arrivalDate: newArrival,
          departureDate: newDeparture,
          daysofparking: newPakingDays,
        },
      });

// create new log
      const values = setLog(0,updatedBooking)
      await prisma.log.create({data:{...values}})

      await prisma.notification.create({
        data: {
          entityId: entity?.id,
          companyId: entity?.companyId,
          type: "BOOKING",
          status: "APPROVE",
          IdHolder: updatedBooking.id,
          message: "A booking has changed its date range",
        },
      });

      return NextResponse.json(
        {
          url: `${process.env.NEXT_PUBLIC_FRONTEND!}/checkout?success=${
            booking.id
          }`,
        },
        { status: 201 }
      );
    }
    
    
    else if (newDays > 0) {
      const myPayment = methods[booking.paymentMethod];

   const updatedBooking=   await prisma.booking.update({
        where: {
          id: booking.id,
        },
        data: {
          ...validBody.data,
          paymentStatus: "PENDING",
          total: newPrice,
          daysofparking: newPakingDays,
        },
      });



     

      const session = await stripe.checkout.sessions.create({
        payment_intent_data: {
          metadata: {
            id: booking.id,
            update: "true",
            payed:newPrice - booking.total,
            arrivalDate: booking.arrivalDate.toString(),
            departureDate: booking.departureDate.toString(),
            total: booking.total,
            daysofparking: booking.daysofparking,
          },
          capture_method: "automatic",
        },
        payment_method_types: [myPayment as "card" | "paypal" | "ideal"],

        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: "service",
                description: `Booking for additional ${newDays} day(s) parking `,
              },
              unit_amount: +additionalPrice * 100,
            },
            quantity: 1,
          },
        ],
        expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
        mode: "payment",
        metadata: {
          id: booking.id,
          update: "true",
          arrivalDate: booking.arrivalDate.toString(),
          departureDate: booking.departureDate.toString(),
          payed:newPrice - booking.total,
          total: booking.total,
          daysofparking: booking.daysofparking,
        },

        success_url: `${process.env.NEXT_PUBLIC_FRONTEND!}/checkout?success=${
          booking.id
        }`,
        cancel_url: `${process.env.NEXT_PUBLIC_FRONTEND!}/checkout?canceled`,
      });

      const notification = await prisma.notification.create({
        data: {
          entityId: entity?.id,
          companyId: entity?.companyId,
          status: "REQUEST",
          type: "BOOKING",
          message: "A booking is extending parking days",
        },
      });
// create new log
      const values = setLog(0,updatedBooking)
      await prisma.log.create({data:{...values}})
   

      return NextResponse.json(
        { url: session.url },
        {
          headers: corsHeaders,
        }
      );
    }

    const myPayment = methods[booking.paymentMethod];

    return NextResponse.json({ try: "success" }, { status: 201 });
  } catch (error) {
    console.log(error);
    // await prisma.booking.delete({ where: { id: booking?.id } });
    return new NextResponse("internal error", { status: 500 });
  }
}
