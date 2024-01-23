import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

import prisma from "@/lib/db";

import { bookingSchema } from "@/schemas";



import { isServiceValid } from "./(helpers)/isServiceValid";
import { calculateParkingDays } from "../../services/(helpers)/findParkingDays";

import { setLog } from "../../(helpers)/set-log";

import { calculateNewUpdate } from "./(helpers)/calculateNewUpdate";
import { getFinalDates } from "../../services/(helpers)/getFinalDates";
import { findTotalPrice } from "../../services/(helpers)/findTotalPrice";
import { sendEmail } from "../../booking/cancel/(helper)/send-email";
import { JsonArray } from "@prisma/client/runtime/library";
import { getCurrentDateInNetherlands } from "./(helpers)/toAmsterdam";

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
  return await prisma.$transaction(async (prismaTransaction) => {
  let booking;
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

    const arriveString = validBody.data.arrivalDate.toString();
    const departureString = validBody.data.departureDate.toString();

    const { adjustedStartDate, adjustedEndDate } = getFinalDates(
      arriveString,
      departureString,
      validBody.data.arrivalTime,
      validBody.data.departureTime
    ); //get the time stamp

    const newArrival = new Date(adjustedStartDate); //to reset hours
    const newDeparture = new Date(adjustedEndDate); //to reset hours

    booking = await prismaTransaction.booking.findUnique({
      where: {
        id: id,
        serviceId: validBody.data.serviceId,
        email: validBody.data.email.toLowerCase(),

        bookingCode: bookingCode,

        paymentStatus: "SUCCEEDED",
        bookingStatus: "ACTIVE",
      },
    });

    if (!booking)
      return NextResponse.json(
        { customError: "Invalid credentials" },
        { status: 400 }
      );

    // const amesterdam = new Date();

    // amesterdam.setHours(amesterdam.getHours() + 1);

    // amesterdam.setMinutes(amesterdam.getMinutes());

    if (booking.arrivalDate <= getCurrentDateInNetherlands())
      return NextResponse.json(
        {
          customError:
            "You can no more update your booking because arrival date already passed.",
        },
        { status: 400 }
      );

    const service = await prismaTransaction.service.findUnique({
      where: {
        id: validBody.data.serviceId,
        isActive: true,
        available: true,
      },
      include: {
        bookings: {
          where: {
            paymentStatus: { in: ["SUCCEEDED", "PENDING"] },
            bookingStatus: "ACTIVE",
            id: { not: booking.id },
            AND: [
              { arrivalDate: { lte: adjustedEndDate } },
              { departureDate: { gte: adjustedStartDate } },
            ],
          },
        },
        availability: true,
        rules: true,
      },
    });

    if (!service)
      return NextResponse.json(
        { customError: "Deze dienst is niet beschikbaar." },
        { status: 400 }
      );

    const validService = isServiceValid(
      service,
      newArrival.toString(),
      newDeparture.toString(),
      validBody.data.arrivalTime,
      validBody.data.departureTime
    );
    if (!validService)
      return NextResponse.json(
        { customError: "Deze dienst is niet langer beschikbaar." },
        { status: 400 }
      );

    const parkingDays = calculateParkingDays(newArrival, newDeparture);

    const totalPrice = findTotalPrice(
      service,
      parkingDays,
      adjustedStartDate,
      adjustedEndDate
    );

    if (totalPrice === 0 || totalPrice === undefined || !totalPrice)
      return NextResponse.json(
        { response: "Deze dienst is niet beschikbaar." },
        { status: 200 }
      );

    const { additionalDays, additionalPrice } = calculateNewUpdate({
      bookingArrival: booking.arrivalDate,
      bookingDeparture: booking.departureDate,
      service,
      parkingDays,
      totalPrice,
    });

    console.log("the booking total", booking.total);
    console.log("additional price", additionalPrice);

    if (additionalDays === 0) {
      const updatedBooking = await prismaTransaction.booking.update({
        where: {
          id: booking.id,
        },
        data: {
          ...validBody.data,
          arrivalDate: adjustedStartDate,
          departureDate: adjustedEndDate,
          daysofparking: parkingDays,
        },
      });

      // create new log
      const values = setLog(
        0,
        "UPDATED",
        `Deze boeking is bijgewerkt zonder extra dagen, geen extra betaling.`,
        updatedBooking
      );
      await prismaTransaction.log.create({ data: { ...values } });
      await sendEmail(booking, "update", service.name);

      return NextResponse.json(
        {
          url: `${process.env.NEXT_PUBLIC_FRONTEND!}/checkout?success=${
            booking.id
          }`,
        },
        { status: 201 }
      );
    } else if (additionalDays > 0) {
      const myPayment = methods[validBody.data.paymentMethod];

      const updatedBooking = await prismaTransaction.booking.update({
        where: {
          id: booking.id,
        },
        data: {
          ...validBody.data,
          arrivalDate: adjustedStartDate,
          departureDate: adjustedEndDate, //added arrival and departure
          paymentStatus: "PENDING",
          total: additionalPrice + booking.total,
          daysofparking: parkingDays,
        },
      });
      const stripePrice = Math.round(additionalPrice * 100);
      console.log("stripe price", stripePrice);

      const metadata = {
        id: booking.id,
        update: "true",
        bookingCode,
        payed: +additionalPrice.toFixed(2),
        arrivalDate: booking.arrivalDate.toString(),
        departureDate: booking.departureDate.toString(),
        total: booking.total,
        daysofparking: booking.daysofparking,
        service: service.name,
        arrivalString: `${updatedBooking.arrivalDate
          .getDate()
          .toString()
          .padStart(2, "0")}-${(updatedBooking.arrivalDate.getMonth() + 1)
          .toString()
          .padStart(2, "0")}-${updatedBooking.arrivalDate.getFullYear()} ${
          updatedBooking.arrivalTime
        }`,
        departureString: `${updatedBooking.departureDate
          .getDate()
          .toString()
          .padStart(2, "0")}-${(updatedBooking.departureDate.getMonth() + 1)
          .toString()
          .padStart(2, "0")}-${updatedBooking.departureDate.getFullYear()} ${
          updatedBooking.departureTime
        }`,
        firstName: updatedBooking.firstName,
        lastName: updatedBooking.lastName,
      };

      const session = await stripe.checkout.sessions.create({
        customer_email: booking.email,
        payment_intent_data: {
          metadata,
          capture_method: "automatic",
        },
        payment_method_types: [myPayment as "card" | "paypal" | "ideal"],

        line_items: [
          {
            price_data: {
              currency: "eur",
              product_data: {
                name: service.name,
                description: `Boeking voor ${additionalDays} extra dag(en) parkeren`,
              },
              unit_amount: stripePrice,
            },
            quantity: 1,
          },
        ],
        expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
        mode: "payment",
        metadata,

        success_url: `${process.env.NEXT_PUBLIC_FRONTEND!}/checkout?success=${
          booking.id
        }`,
        cancel_url: `${process.env.NEXT_PUBLIC_FRONTEND!}/checkout?canceled`,
      });

      // create new log
      const values = setLog(
        0,
        "UPDATING",
        `Een poging om de parkeerperiode met ${additionalDays} dag(en) te verlengen met een verwachte extra betaling van €${additionalPrice}`,
        updatedBooking
      );
      await prismaTransaction.log.create({ data: { ...values } });

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

    await prismaTransaction.booking.update({
      where: { id: booking?.id },
      data: {
        ...booking,
        extraOptions: booking?.extraOptions as JsonArray[],
        discount: booking?.discount!,
      },
    });
    return new NextResponse("internal error", { status: 500 });
  }
}
)}