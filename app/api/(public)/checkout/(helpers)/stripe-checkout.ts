import { stripe } from "@/lib/stripe";
import { Booking, ExraOption } from "@prisma/client";

export const stripeCheckout = async (
  booking: Booking,
  total: number,
  arrivalDateString: string,
  departureDateString: string,
  startTime:string,
  endTime:string,
  serviceName:string,
  myPayment:"card" | "paypal" | "ideal",
  daysofparking:number,
  options:ExraOption[]
) => {


const metaData = {
    id: booking.id,
    bookingCode: booking.bookingCode,

    payed: total,
    startDate: arrivalDateString,
    endDate: departureDateString,
    startTime: startTime,
    endTime: endTime,
    service: serviceName,
    arrivalString: `${booking.arrivalDate.getDate()}-${
      booking.arrivalDate.getMonth() + 1
    }-${booking.arrivalDate.getFullYear()} ${startTime}`,
    departureString: `${booking.departureDate.getDate()}-${
      booking.departureDate.getMonth() + 1
    }-${booking.departureDate.getFullYear()} ${
        endTime
    }`,
    firstName: booking.firstName,
    lastName: booking.lastName,
  }


  const session = await stripe.checkout.sessions.create({
    customer_email: booking.email,
    payment_intent_data: {
      metadata: metaData,
      capture_method: "automatic",
    },
    payment_method_types: [myPayment as "card" | "paypal" | "ideal"],

    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: serviceName,
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
    metadata: metaData,

    success_url: `${process.env.NEXT_PUBLIC_FRONTEND!}/checkout?success=${
      booking.id
    }`,
    cancel_url: `${process.env.NEXT_PUBLIC_FRONTEND!}/checkout?canceled`,
  });


  return session
};
