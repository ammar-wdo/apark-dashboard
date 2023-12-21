import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import { isAvailable } from "./(helpers)/isAvailable";
import prisma from "@/lib/db";
import { STATUS } from "@prisma/client";
import { bookingSchema } from "@/schemas";
import { daysAndTotal } from "./(helpers)/days-and-total";
import { nanoid } from "nanoid";
import { findValidServices } from "../services/(helpers)/findValidServices";

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
    console.log(body);
    const {ids,...rest} = body
    console.log(ids)
    const validBody = bookingSchema.safeParse(rest);
    if (!validBody.success)
      return NextResponse.json(validBody.error, { status: 400 });

    const { total, daysofparking } = await daysAndTotal(
      validBody.data.arrivalDate,
      validBody.data.departureDate,
      validBody.data.serviceId
    );
    validBody.data.paymentMethod;
    const service = await prisma.service.findUnique({
      where: {
        id: validBody.data.serviceId,
        isActive:true
      },
      include: {
        bookings: {
          where: { paymentStatus: { in: ["SUCCEEDED", "PENDING"] },bookingStatus:'ACTIVE' },
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

   const   options = await prisma.exraOption.findMany({
      where:{
        serviceId:service.id,
        id:{in:ids as string[]}
        

      },
      select:{
        label:true,
        id:true,
        price:true
      }
    })

    console.log(options)
let additionalPrice = 0
    if(!!options.length){

      additionalPrice = options.reduce((result,val)=>result + val.price,0)

    }



    booking = await prisma.booking.create({
      data: {
        ...validBody.data,
        bookingCode,
        total: total + additionalPrice as number,
        daysofparking,
...(!!options.length && {extraOptions:{
  connect: options.map(el=>({id:el.id}))
  
}})
      },
    });

  

    const myPayment = methods[booking.paymentMethod];

    const entity = await prisma.entity.findFirst({
      where:{
        services:{
          some:{id:service.id}
        },
      },
      select:{
        id:true,companyId:true
      }
    })


   

    const session = await stripe.checkout.sessions.create({
      payment_intent_data: { metadata: { id: booking.id ,bookingCode:booking.bookingCode,payed:total},
      capture_method:'automatic',
      

     },
      payment_method_types: [myPayment as "card" | "paypal" | "ideal"],

      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: service.name,
              description: `Booking for ${daysofparking} day(s) parking ${!!options.length && 'with extra options (' + options.map(el=>`${el.label} for ${el.price}`)})`,
            },
            unit_amount: +booking.total.toFixed(0) * 100,
          },
          quantity: 1,
        },
      ],
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
      mode: "payment",
      metadata: { id: booking.id,bookingCode:booking.bookingCode,payed:total },

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
