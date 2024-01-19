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

import { setLog } from "../../(helpers)/set-log";
import { getClientDates } from "../../services/(helpers)/getClientDates";
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

 let booking
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

     booking = await prisma.booking.findUnique({
      where: {
        id: id,
        serviceId: validBody.data.serviceId,
        email: validBody.data.email,

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

    const service = await prisma.service.findUnique({
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
          },
        },
        availability: true,
        rules: true,
      },
    });

    if (!service)
      return NextResponse.json(
        { customError: "This service is not available" },
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
        { customError: "This service is no more available" },
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
        { response: "service is not available" },
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
      const updatedBooking = await prisma.booking.update({
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
        `This booking has been updated with no additional days, no additional payment`,
        updatedBooking
      );
      await prisma.log.create({ data: { ...values } });
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

      

      const updatedBooking = await prisma.booking.update({
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
const stripePrice = Math.round(additionalPrice * 100)
      console.log('stripe price',stripePrice)

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
      }

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
                description: `Booking for additional ${additionalDays} day(s) parking `,
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
        `An attemt to extend the period of parking for ${additionalDays} day(s) with additional expected payment of €${additionalPrice}`,
        updatedBooking
      );
      await prisma.log.create({ data: { ...values } });

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
  
    await prisma.booking.update({
      where:{id:booking?.id},
      data:{
        address:booking?.address,
        arrivalDate:booking?.arrivalDate,
        departureDate:booking?.departureDate,
        arrivalTime:booking?.arrivalTime,
        departureTime:booking?.departureTime,
        bookingCode:booking?.bookingCode,
        bookingOnBusinessName:booking?.bookingOnBusinessName,
        bookingStatus:booking?.bookingStatus,
        carColor:booking?.carColor,
        carLicense:booking?.carLicense,
        carModel:booking?.carModel,
        companyName:booking?.companyName,
        daysofparking:booking?.daysofparking,
        discount:booking?.discount!,
        email:booking?.email,
        extraOptions:booking?.extraOptions as JsonArray[],
        extraServiceFee:booking?.extraServiceFee,
        firstName:booking?.firstName,
        flightNumber:booking?.flightNumber,
        isCompany:booking?.isCompany,
        lastName:booking?.lastName,
        numberOfPeople:booking?.numberOfPeople,
        parkingPrice:booking?.parkingPrice,
        paymentMethod:booking?.paymentMethod,
        paymentStatus:booking?.paymentStatus,
        total:booking?.total,
        phoneNumber:booking?.phoneNumber,
        place:booking?.place,
        zipcode:booking?.zipcode,
        vatNumber:booking?.vatNumber,
        updatedAt:booking?.updatedAt,
        createdAt:booking?.createdAt


      }
    })
    return new NextResponse("internal error", { status: 500 });
  }
}
