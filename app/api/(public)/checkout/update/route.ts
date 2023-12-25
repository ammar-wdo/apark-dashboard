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
import { getClientDates } from "../../services/(helpers)/getClientDates";

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


      const arriveString = validBody.data.arrivalDate.toString()
      const departureString = validBody.data.departureDate.toString()

      const {clientArrivalDate,clientDepartureDate} = getClientDates(arriveString,departureString,validBody.data.arrivalTime,validBody.data.departureTime)

      console.log("start client",clientArrivalDate.getHours(),"end client",clientDepartureDate.getHours())


      
      // console.log("arrive string",arriveString,"departure string",departureString)

      // console.log("arrive date",clientArrivalDate,"departure date",clientDepartureDate)

  

    const newArrival =new Date (clientArrivalDate);
    const newDeparture =new Date (clientDepartureDate);

    console.log("new arrival",newArrival)
    console.log("new departure",newDeparture)




    const booking = await prisma.booking.findUnique({
      where: {
        id: id,
        serviceId: validBody.data.serviceId,
        email: validBody.data.email,
   
        
        bookingCode: bookingCode,
        departureDate:{gte:new Date(new Date().setHours(0,0,0,0))},
        paymentStatus:'SUCCEEDED',
        bookingStatus:'ACTIVE'

      },
    });

    if (!booking)
      return new NextResponse("Invalid credintials", { status: 400 });

    const service = await prisma.service.findUnique({
      where: {
        id: validBody.data.serviceId,
        isActive:true,
        available:true
      },
      include: {
        bookings: {
          where: { paymentStatus: { in: ["SUCCEEDED", "PENDING"] },bookingStatus:'ACTIVE' ,id:{not:booking.id}},
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

      const validService = isServiceValid(
        service,
        newArrival.toString(),
        newDeparture.toString(),
        validBody.data.arrivalTime,
        validBody.data.departureTime
        
     
       
      ); 
      if (!validService)
        return new NextResponse("This service is no more available", {
          status: 400,
        });



        const parkingDays = calculateParkingDays(newArrival, newDeparture);
    
        const totalPrice = findTotalPrice(service,parkingDays,newArrival.toString(),newDeparture.toString())
        
        // console.log('parking days',parkingDays)
        // console.log("total price",totalPrice)
        
        if(totalPrice===0 || totalPrice === undefined || !totalPrice) return NextResponse.json({response:'service is not available'},{status:200})

        const userParkingDays = calculateParkingDays(new Date(booking.arrivalDate), new Date(booking.departureDate));

     

        const userTotalPrice = findTotalPrice(service,userParkingDays,booking.arrivalDate.toString(),booking.departureDate.toString())

    

        const newParkingDays = parkingDays > userParkingDays
const additionalDays = newParkingDays ? parkingDays - userParkingDays : 0


let additionalPrice = newParkingDays ? totalPrice - userTotalPrice : 0 
if(additionalPrice < 0 ){
    additionalPrice = 0
}

// console.log('user arrival',booking.arrivalDate)
// console.log('user departure',booking.departureDate)
// console.log('user parking days',userParkingDays)
// console.log('user total price',userTotalPrice)

// console.log('additional days',additionalDays)

  

    const entity = await prisma.entity.findFirst({
      where: {
        services: {
          some: { id: service.id },
        },
      },
    });

    if (additionalDays === 0) {

      console.log("client 2 arrival",clientArrivalDate.getHours())
      console.log("client 2 departure",clientDepartureDate.getHours())
      const updatedBooking = await prisma.booking.update({
        where: {
          id: booking.id,
        },
        data: {
          ...validBody.data,
          arrivalDate: clientArrivalDate,
          departureDate: clientDepartureDate,
          daysofparking: parkingDays,
        },
      });

// create new log
      const values = setLog(0,"UPDATED",`This booking has been updated with no additional days, no additional payment`,updatedBooking)
      await prisma.log.create({data:{...values}})

     

      return NextResponse.json(
        {
          url: `${process.env.NEXT_PUBLIC_FRONTEND!}/checkout?success=${
            booking.id
          }`,
        },
        { status: 201 }
      );
    }
    
    
    else if (additionalDays > 0) {
      const myPayment = methods[booking.paymentMethod];

   const updatedBooking=   await prisma.booking.update({
        where: {
          id: booking.id,
        },
        data: {
          ...validBody.data,
          paymentStatus: "PENDING",
          total: additionalPrice + booking.total ,
          daysofparking: parkingDays,
        },
      });



     

      const session = await stripe.checkout.sessions.create({
        payment_intent_data: {
          metadata: {
            id: booking.id,
            update: "true",
            bookingCode,
            payed:additionalPrice,
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
                description: `Booking for additional ${additionalDays} day(s) parking `,
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
          bookingCode,
          update: "true",
          arrivalDate: booking.arrivalDate.toString(),
          departureDate: booking.departureDate.toString(),
          payed:additionalPrice,
          total: booking.total,
          daysofparking: booking.daysofparking,
        },

        success_url: `${process.env.NEXT_PUBLIC_FRONTEND!}/checkout?success=${
          booking.id
        }`,
        cancel_url: `${process.env.NEXT_PUBLIC_FRONTEND!}/checkout?canceled`,
      });

    
// create new log
      const values = setLog(0,"UPDATING",`An attemt to extend the period of parking for ${additionalDays} day(s) with additional expected payment of €${additionalPrice}`,updatedBooking)
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
