import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import prisma from "@/lib/db";
import { sendMail } from "./(helpers)/send-email";
import { setLog } from "../(helpers)/set-log";

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

      console.log('success')
      console.log(session.metadata)
      if(!session.metadata?.update){

      
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
const values = setLog(order.total,order)
          const log =  prisma.log.create({
            data:{
            ...values
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
    }else{
      console.log(session.metadata)
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
const values = setLog(+session.metadata?.payed,order)
          const log =  prisma.log.create({
            data:{
             ...values
            }
          })
        const notification=   prisma.notification.create({
            data:{
              entityId:order.service.entityId,
              companyId:order.service.entity.companyId,
              status:'APPROVE',
              type:'BOOKING',
              message:'New booking payment has been succeeded to extend new days'
            }
          })

          await  Promise.all([log,notification])
          // await sendMail('Booking is payed',"new booking is payed","m.swaghi@gmail.com","Mouhammmad")
        }
      } catch (error) {
        console.log(error);
      }
    }

      break;
    }

    case "checkout.session.expired": {
      console.log('expire')
      console.log(session.metadata)
      if(!session.metadata?.update){

      
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

        const values = setLog(0,order)
          const log =  prisma.log.create({
            data:{
             ...values

            

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
     
    }else{

      try {
        const order = await prisma.booking.update({
          where: {
            id: session?.metadata?.id,
          },
          data: {
            paymentStatus: "SUCCEEDED",
            bookingStatus:'ACTIVE',
            arrivalDate:new Date(session.metadata.arrivalDate),
            departureDate:new Date(session.metadata.departureDate),
            total:+session.metadata.total,
            daysofparking:+session.metadata.daysofparking
          },include:{
            service:{
              include:{
                entity:true
              }
            }
          }
        });

      const values = setLog(0,order)
          const log =  prisma.log.create({
            data:{
             
...values
            

            }
          })
      const notification=   prisma.notification.create({
          data:{
            entityId:order.service.entityId,
            companyId:order.service.entity.companyId,
            status:'APPROVE',
            type:'BOOKING',
            message:'A booking status has failed to extend parking days and  been reverted to its previous succeeded status'
          }
        })

        await  Promise.all([log,notification])

      } catch (error) {
        console.log(error);
      }
    }
    break;
  }

  
    default:
     ;
  }

  return new NextResponse(null, { status: 200 });
}
