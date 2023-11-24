import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import prisma from "@/lib/db";
import { sendMail } from "./(helpers)/send-email";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

 

  switch (event.type) {
    case "checkout.session.completed": {
      try {
        if (session.payment_status === "paid") {

          const order = await prisma.booking.update({
            where: {
              id: session?.metadata?.id,
            },
            data: {
              paymentStatus: "SUCCEEDED",
            },include:{
              service:{
                include:{
                  entity:true
                }
              }
            }
          });

          const log =  prisma.log.create({
            data:{
              bookingId:order.id,
              payed:order.total,
           
            arrivalDate:order.arrivalDate,
            arrivalTime:order.arrivalTime,
            bookingCode:order.bookingCode,
            carColor:order.carColor,
            carLicense:order.carLicense,
            carModel:order.carModel,
            daysofparking:order.daysofparking,
            departureDate:order.departureDate,
            departureTime:order.departureTime,
            email:order.email,
            firstName:order.firstName,
            lastName:order.lastName,
            parkingPrice:order.parkingPrice,
            phoneNumber:order.phoneNumber,
            address:order.address,
            bookingOnBusinessName:order.bookingOnBusinessName,
            bookingStatus:order.bookingStatus,
            companyName:order.companyName,
            discount:order.discount,
            extraServiceFee:order.extraServiceFee,
            flightNumber:order.flightNumber,
            isCompany:order.isCompany,
            paymentMethod:order.paymentMethod,
            paymentStatus:order.paymentStatus,
            place:order.place,
            returnFlightNumber:order.returnFlightNumber,
            status:order.status,
            vatNumber:order.vatNumber,
            zipcode:order.zipcode,
            }
          })
        const notification=   prisma.notification.create({
            data:{
              entityId:order.service.entityId,
              companyId:order.service.entity.companyId,
              status:'APPROVE',
              type:'BOOKING',
              message:'New booking payment has been succeeded'
            }
          })

          await  Promise.all([log,notification])
          // await sendMail('Booking is payed',"new booking is payed","m.swaghi@gmail.com","Mouhammmad")
        }
      } catch (error) {
        console.log(error);
      }

      break;
    }

    case "checkout.session.expired": {
      try {
        const order = await prisma.booking.update({
          where: {
            id: session?.metadata?.id,
          },
          data: {
            paymentStatus: "EXPIRED",
            bookingStatus:'CANCELED',
          },include:{
            service:{
              include:{
                entity:true
              }
            }
          }
        });

      
          const log =  prisma.log.create({
            data:{
              bookingId:order.id,
              payed:0,
            arrivalDate:order.arrivalDate,
            arrivalTime:order.arrivalTime,
            bookingCode:order.bookingCode,
            carColor:order.carColor,
            carLicense:order.carLicense,
            carModel:order.carModel,
            daysofparking:order.daysofparking,
            departureDate:order.departureDate,
            departureTime:order.departureTime,
            email:order.email,
            firstName:order.firstName,
            lastName:order.lastName,
            parkingPrice:order.parkingPrice,
            phoneNumber:order.phoneNumber,
            address:order.address,
            bookingOnBusinessName:order.bookingOnBusinessName,
            bookingStatus:order.bookingStatus,
            companyName:order.companyName,
            discount:order.discount,
            extraServiceFee:order.extraServiceFee,
            flightNumber:order.flightNumber,
            isCompany:order.isCompany,
            paymentMethod:order.paymentMethod,
            paymentStatus:order.paymentStatus,
            place:order.place,
            returnFlightNumber:order.returnFlightNumber,
            status:order.status,
            vatNumber:order.vatNumber,
            zipcode:order.zipcode,

            

            }
          })
      const notification=   prisma.notification.create({
          data:{
            entityId:order.service.entityId,
            companyId:order.service.entity.companyId,
            status:'DELETE',
            type:'BOOKING',
            message:'A booking session has expired'
          }
        })

        await  Promise.all([log,notification])

      } catch (error) {
        console.log(error);
      }
      break;
    }

  
    default:
     ;
  }

  return new NextResponse(null, { status: 200 });
}
