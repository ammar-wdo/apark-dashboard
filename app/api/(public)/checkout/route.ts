import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import { isAvailable } from "./(helpers)/isAvailable";
import prisma from "@/lib/db";
import { ExraOption, STATUS } from "@prisma/client";
import { bookingSchema } from "@/schemas";
import { daysAndTotal } from "./(helpers)/days-and-total";
import { nanoid } from "nanoid";
import { findValidServices } from "../services/(helpers)/findValidServices";
import { getClientDates } from "../services/(helpers)/getClientDates";
import { getFinalDates } from "../services/(helpers)/getFinalDates";

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
  let booking;
  try {
    const body = await req.json();
    body.arrivalDate = new Date(body.arrivalDate);
    body.departureDate = new Date(body.departureDate);

    const { ids, ...rest } = body;

    const validBody = bookingSchema.safeParse(rest);
    if (!validBody.success)
      return NextResponse.json(validBody.error, { status: 400 });


    const arrivalString = validBody.data.arrivalDate.toString();
    const departureString = validBody.data.departureDate.toString();

    console.log("arrival string",arrivalString,"departure string",departureString)

    const { adjustedStartDate, adjustedEndDate } = getFinalDates(
      arrivalString,
      departureString,
      validBody.data.arrivalTime,
      validBody.data.departureTime
    );

   

    const { total, daysofparking } = await daysAndTotal(
      adjustedStartDate,
     adjustedEndDate,
      validBody.data.serviceId
    );

    // console.log("total",total)

   
    validBody.data.paymentMethod;
    const service = await prisma.service.findUnique({
      where: {
        id: validBody.data.serviceId,
        isActive: true,
      },
      include: {
        bookings: {
          where: {
            paymentStatus: { in: ["SUCCEEDED", "PENDING"] },
            bookingStatus: "ACTIVE",
          },
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

    const validServices = findValidServices(
      [service],
      validBody.data.arrivalDate.toString(),
      validBody.data.departureDate.toString(),
      validBody.data.arrivalTime,
      validBody.data.departureTime,
      daysofparking
    );

    if (!validServices.length)
      return NextResponse.json(
        { customError: "This service has no more free spots!" },
        { status: 400 }
      );

    const available = await isAvailable(body.serviceId);

    if (!available)
      return NextResponse.json(
        { customError: "This service is not available" },
        { status: 400 }
      );

    let bookingCode = nanoid(9);
    let existingBooking = await prisma.booking.findFirst({
      where: {
        bookingCode: bookingCode,
      },
      select: { bookingCode: true },
    });

    while (existingBooking) {
      bookingCode = nanoid(9);
      existingBooking = await prisma.booking.findFirst({
        where: {
          bookingCode: bookingCode,
        },
        select: { bookingCode: true },
      });
    }

    let options: ExraOption[] | any[];
    if (ids && ids.length) {
      options = await prisma.exraOption.findMany({
        where: {
          serviceId: service.id,
          id: { in: ids as string[] },
        },
        select: {
          label: true,
          id: true,
          price: true,
          commession: true,
        },
      });
    } else {
      options = [];
    }

  
    let additionalPrice = 0;
    if (!!options.length) {
      additionalPrice = options.reduce((result, val) => result + val.price, 0);
    }

    // console.log("additional price",additionalPrice)


    booking = await prisma.booking.create({
      data: {
        ...validBody.data,
        bookingCode,
        arrivalDate:adjustedStartDate,
        departureDate:adjustedEndDate,
        total: (total + additionalPrice)as number,
        daysofparking,
        ...(!!options.length && {
          extraOptions: options.map((el: ExraOption) => ({
            id: el.id,
            commession: el.commession,
            label: el.label,
            price: el.price,
          })),
        }),
      },
    });

    const myPayment = methods[booking.paymentMethod];

    const entity = await prisma.entity.findFirst({
      where: {
        services: {
          some: { id: service.id },
        },
      },
      select: {
        id: true,
        companyId: true,
      },
    });
  //  console.log('final total',booking.total)





  //  checkout session
   
    const session = await stripe.checkout.sessions.create({
      payment_intent_data: {
        metadata: {
          id: booking.id,
          bookingCode: booking.bookingCode,
          payed: total,
          startDate:arrivalString,
          endDate:departureString,
          startTime:validBody.data.arrivalTime,
          endTime:validBody.data.departureTime

        },
        capture_method: "automatic",
      },
      payment_method_types: [myPayment as "card" | "paypal" | "ideal"],

      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: service.name,
              description: `Booking for ${daysofparking} day(s) parking ${
                !!options && !!options.length
                  ? `with extra options (  ${options.map(
                      (el) => `${el.label} for  €${el.price}`
                    )})`
                  : ""
              }`,
            },
            unit_amount: booking.total * 100,
          },
          quantity: 1,
        },
      ],
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
      mode: "payment",
      metadata: {
        id: booking.id,
        bookingCode: booking.bookingCode,
        payed: total,
        startDate:arrivalString,
        endDate:departureString,
        startTime:validBody.data.arrivalTime,
        endTime:validBody.data.departureTime
      },

      success_url: `${process.env.NEXT_PUBLIC_FRONTEND!}/checkout?success=${
        booking.id
      }`,
      cancel_url: `${process.env.NEXT_PUBLIC_FRONTEND!}/checkout?canceled`,
    });

    return NextResponse.json(
      { url: session.url },
      {
        headers: corsHeaders,
      }
    );
  } catch (error) {
    console.log(error);
    await prisma.booking.delete({ where: { id: booking?.id } });
    return new NextResponse("internal error", { status: 500 });
  }
}
