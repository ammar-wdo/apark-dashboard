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
const {updatedAt,createdAt,total,...rest} = order
          const log = await prisma.log.create({
            data:{
              bookingId:order.id,
              payed:order.total,
              ...rest
            }
          })
          await prisma.notification.create({
            data:{
              entityId:order.service.entityId,
              companyId:order.service.entity.companyId,
              status:'APPROVE',
              type:'BOOKING',
              message:'New booking payment has been succeeded'
            }
          })
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

        const {updatedAt,createdAt,total,...rest} = order
          const log = await prisma.log.create({
            data:{
              bookingId:order.id,
              payed:0,
              ...rest
            }
          })
        await prisma.notification.create({
          data:{
            entityId:order.service.entityId,
            companyId:order.service.entity.companyId,
            status:'DELETE',
            type:'BOOKING',
            message:'A booking session has expired'
          }
        })
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
