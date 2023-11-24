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

  console.log(session.metadata);

  switch(event.type){

    case "checkout.session.completed": try {
      const order = await prisma.booking.update({
        where: {
          id: session?.metadata?.id,
        },
        data: {
          paymentStatus: "SUCCEEDED",
        },
      });
      // await sendMail('Booking is payed',"new booking is payed","m.swaghi@gmail.com","Mouhammmad")
    } catch (error) {
      console.log(error);
    };

    case "checkout.session.expired":
      try {
        const order = await prisma.booking.update({
          where: {
            id: session?.metadata?.id,
          },
          data: {
            paymentStatus: "EXPIRED",
          },
        });
      } catch (error) {
        console.log(error);
      };

      case "payment_intent.canceled" :
        try {
          const order = await prisma.booking.update({
            where: {
              id: session?.metadata?.id,
            },
            data: {
              paymentStatus: "EXPIRED",
            },
          });
        } catch (error) {
          console.log(error);
        };
  };


  


  
     
    

    
 

  

  return new NextResponse(null, { status: 200 });
}
