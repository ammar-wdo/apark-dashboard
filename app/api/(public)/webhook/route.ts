import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import prisma from "@/lib/db";
import { sendMail } from "./(helpers)/send-email";
import { setLog } from "../(helpers)/set-log";

export async function POST(req: Request) {

  console.log('webhook')
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
    console.log(error)
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
              "Deze boeking is aangemaakt en succesvol betaald.",
              order
            );
            const log = prisma.log.create({
              data: {
                ...values,
              },
            });
            const notification = prisma.notification.create({
              data: {
                IdHolder: order.id,
                entityId: order.service.entityId,
                companyId: order.service.entity.companyId,
                status: "APPROVE",
                type: "BOOKING",
                message: "De betaling voor de nieuwe boeking is geslaagd.",
              },
            });

            await Promise.all([log, notification]);
            // try {
            //   await sendMail(
            //     "booking payed",
            //     `your email ${order.email}, your bookingCode ${order.bookingCode}`,
            //     "ammar@wdodigital.com",
            //     "Ammar"
            //   );
            // } catch (error) {
            //   console.log(error);
            //   await prisma.notification.create({
            //     data: {
            //       IdHolder: order.id,
            //       entityId: order.service.entityId,
            //       companyId: order.service.entity.companyId,
            //       status: "DELETE",
            //       type: "BOOKING",
            //       message:
            //         "An error happened, the approvment email was not sent to customer.should be sent manually ",
            //     },
            //   });
            // }
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
              `Deze boeking is bijgewerkt met extra dagen en er is een bedrag van €${session.metadata.payed} betaald.`,
              order
            );
            const log = prisma.log.create({
              data: {
                ...values,
              },
            });
            const notification = prisma.notification.create({
              data: {
                IdHolder: order.id,
                entityId: order.service.entityId,
                companyId: order.service.entity.companyId,
                status: "APPROVE",
                type: "BOOKING",
                message:
                  "Een boeking is bijgewerkt en succesvol betaald.",
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
            "Een poging om een boeking te maken is geannuleerd, de betaalsessie is verlopen zonder betaling.",
            order
          );
          const log = prisma.log.create({
            data: {
              ...values,
            },
          });
          const notification = prisma.notification.create({
            data: {
              IdHolder: order.id,
              entityId: order.service.entityId,
              companyId: order.service.entity.companyId,
              status: "DELETE",
              type: "BOOKING",
              message: "Een boekingssessie is verlopen.",
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
            "Een poging om een boeking bij te werken is teruggedraaid naar de vorige staat omdat de betaling voor extra dagen niet is gelukt, maar als er informatie is bewerkt, dan wordt deze opgeslagen.",
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
              IdHolder: order.id,
              companyId: order.service.entity.companyId,
              status: "APPROVE",
              type: "BOOKING",
              message:
                "Een boeking is er niet in geslaagd om nieuwe parkeerdagen uit te breiden en is teruggezet naar de vorige parkeerdatum en geslaagde status.",
            },
          });

          await Promise.all([log, notification]);
        } catch (error) {
          console.log(error);
        }
      }
      break;
    }

    case "charge.refunded": {
      console.log("refund");
      console.log(session.metadata);

      try {
        const order = await prisma.booking.update({
          where: {
            id: session?.metadata?.id,
          },
          data: {
            paymentStatus: "CANCELED",
            bookingStatus: "REFUNDED",
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
          `Deze betaling is succesvol terugbetaald met €${session.metadata?.payed}`,
          order
        );
        const log = prisma.log.create({
          data: {
            ...values,
          },
        });
        const notification = prisma.notification.create({
          data: {
            IdHolder: order.id,
            entityId: order.service.entityId,
            companyId: order.service.entity.companyId,
            status: "APPROVE",
            type: "BOOKING",
            message: "Een betaling voor een boeking is terugbetaald.",
          },
        });

        await Promise.all([log, notification]);
      } catch (error) {
        console.log(error);
      }
    }

    default:
  }

  return new NextResponse(null, { status: 200 });
}
