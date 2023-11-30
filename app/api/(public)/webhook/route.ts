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
      console.log("success");
      console.log(session.metadata);
      if (!session.metadata?.update) {
        try {
          if (session.payment_status === "paid") {
            const order = await prisma.booking.update({
              where: {
                id: session?.metadata?.id,
              },
              data: {
                paymentStatus: "SUCCEEDED",
              },
              include: {
                service: {
                  include: {
                    entity: true,
                  },
                },
              },
            });
            const values = setLog(
              order.total,
              "CREATED",
              "This booking has been  created and paid successfully",
              order
            );
            const log = prisma.log.create({
              data: {
                ...values,
              },
            });
            const notification = prisma.notification.create({
              data: {
                IdHolder:order.id,
                entityId: order.service.entityId,
                companyId: order.service.entity.companyId,
                status: "APPROVE",
                type: "BOOKING",
                message: "New booking payment has been succeeded",
              },
            });

            await Promise.all([log, notification]);
            // await sendMail('Booking is payed',"new booking is payed","m.swaghi@gmail.com","Mouhammmad")
          }
        } catch (error) {
          console.log(error);
        }
      } else {
        console.log(session.metadata);
        try {
          if (session.payment_status === "paid") {
            const order = await prisma.booking.update({
              where: {
                id: session?.metadata?.id,
              },
              data: {
                paymentStatus: "SUCCEEDED",
              },
              include: {
                service: {
                  include: {
                    entity: true,
                  },
                },
              },
            });
            const values = setLog(
              +session.metadata?.payed,
              "UPDATED",
              `This booking has been updated with additional extra days and a €${session.metadata.payed} has been paid`,
              order
            );
            const log = prisma.log.create({
              data: {
                ...values,
              },
            });
            const notification = prisma.notification.create({
              data: {
                IdHolder:order.id,
                entityId: order.service.entityId,
                companyId: order.service.entity.companyId,
                status: "APPROVE",
                type: "BOOKING",
                message:
                  "New booking payment has been succeeded to extend new days",
              },
            });

            await Promise.all([log, notification]);
            // await sendMail('Booking is payed',"new booking is payed","m.swaghi@gmail.com","Mouhammmad")
          }
        } catch (error) {
          console.log(error);
        }
      }

      break;
    }

    case "checkout.session.expired": {
      console.log("expire");
      console.log(session.metadata);
      if (!session.metadata?.update) {
        try {
          const order = await prisma.booking.update({
            where: {
              id: session?.metadata?.id,
            },
            data: {
              paymentStatus: "EXPIRED",
              bookingStatus: "CANCELED",
            },
            include: {
              service: {
                include: {
                  entity: true,
                },
              },
            },
          });

          const values = setLog(
            0,
            "CANCELED",
            "An attempt of booking has been canceled because the checkout session expired with no payment ",
            order
          );
          const log = prisma.log.create({
            data: {
              ...values,
            },
          });
          const notification = prisma.notification.create({
            data: {
              IdHolder:order.id,
              entityId: order.service.entityId,
              companyId: order.service.entity.companyId,
              status: "DELETE",
              type: "BOOKING",
              message: "A booking session has expired",
            },
          });

          await Promise.all([log, notification]);
        } catch (error) {
          console.log(error);
        }
      } else {
        try {
          const order = await prisma.booking.update({
            where: {
              id: session?.metadata?.id,
            },
            data: {
              paymentStatus: "SUCCEEDED",
              bookingStatus: "ACTIVE",
              arrivalDate: new Date(session.metadata.arrivalDate),
              departureDate: new Date(session.metadata.departureDate),
              total: +session.metadata.total,
              daysofparking: +session.metadata.daysofparking,
            },
            include: {
              service: {
                include: {
                  entity: true,
                },
              },
            },
          });

          const values = setLog(
            0,
            "REVERTED",
            "An attempt to update a booking was reverted to its previous state because the payment for extra days was not succeeded, but if any changed information, then they will be saved",
            order
          );
          const log = prisma.log.create({
            data: {
              ...values,
            },
          });
          const notification = prisma.notification.create({
            data: {
              entityId: order.service.entityId,
              IdHolder:order.id,
              companyId: order.service.entity.companyId,
              status: "APPROVE",
              type: "BOOKING",
              message:
                "A booking status has failed to extend parking days and  been reverted to its previous parking date and succeeded status,",
            },
          });

          await Promise.all([log, notification]);
        } catch (error) {
          console.log(error);
        }
      }
      break;
    }

    default:
  }

  return new NextResponse(null, { status: 200 });
}
