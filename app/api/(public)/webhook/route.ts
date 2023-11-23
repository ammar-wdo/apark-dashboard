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

  if (event.type === "checkout.session.completed") {
    if (session.payment_status === "unpaid") {
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
      }
    }

    if (session.payment_status === "paid") {
      try {
        const order = await prisma.booking.update({
          where: {
            id: session?.metadata?.id,
          },
          data: {
            paymentStatus: "SUCCEEDED",
          },
        });
      } catch (error) {
        console.log(error);
      }
    }

    // await sendMail('Booking is payed',"new booking is payed","m.swaghi@gmail.com","Mouhammmad")
  }

  if (event.type === "checkout.session.expired") {
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
    }
  }

  return new NextResponse(null, { status: 200 });
}
