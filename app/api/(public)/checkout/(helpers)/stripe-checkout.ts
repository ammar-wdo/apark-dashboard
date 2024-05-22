import { stripe } from "@/lib/stripe";
import { Booking, ExraOption } from "@prisma/client";

export const stripeCheckout = async (
  companyEmail:string,
  booking: Booking,
  total: number,
  arrivalDateString: string,
  departureDateString: string,
  startTime: string,
  endTime: string,
  serviceName: string,
  myPayment: "card" | "paypal" | "ideal",
  daysofparking: number,
  options: ExraOption[],
  parkingproServiceId:string | null,
  parkingproCompanyId:string | null,
) => {

  
  const metaData = {
    id: booking.id,
    bookingCode: booking.bookingCode,
    flightNumber:booking.flightNumber,
    phoneNumber:booking.phoneNumber,
    licensePlate:booking.carLicense,
    carModel:booking.carModel,
    numberOfPeople:booking.numberOfPeople,
    parkingproServiceId,
    parkingproCompanyId,
    

    companyEmail,
    payed: +total.toFixed(2),
    startDate: arrivalDateString,
    endDate: departureDateString,
    startTime: startTime,
    endTime: endTime,
    service: serviceName,
    arrivalString: `${booking.arrivalDate
      .getDate()
      .toString()
      .padStart(2, "0")}-${(booking.arrivalDate.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${booking.arrivalDate.getFullYear()} ${startTime}`,
    departureString: `${booking.departureDate
      .getDate()
      .toString()
      .padStart(2, "0")}-${(booking.departureDate.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${booking.departureDate.getFullYear()} ${endTime}`,
    firstName: booking.firstName,
    lastName: booking.lastName,
  };

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
            description: `Reservering voor ${daysofparking} dag(en)  ${
              !!options && !!options.length
                ? `met extra opties (  ${options.map(
                    (el) => `${el.label} voor  €${el.price}`
                  )})`
                : ""
            }`,
          },
          unit_amount: Math.round(booking.total * 100),
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

  return session;
};

// const session = await stripe.checkout.sessions.create({
//   customer_email: booking.email,
//   payment_intent_data: {
//     metadata: {
//       id: booking.id,
//       bookingCode: booking.bookingCode,

//       payed: total,
//       startDate: arrivalString,
//       endDate: departureString,
//       startTime: validBody.data.arrivalTime,
//       endTime: validBody.data.departureTime,
//       service: service.name,
//       arrivalString: `${booking.arrivalDate.getDate()}-${
//         booking.arrivalDate.getMonth() + 1
//       }-${booking.arrivalDate.getFullYear()} ${validBody.data.arrivalTime}`,
//       departureString: `${booking.departureDate.getDate()}-${
//         booking.departureDate.getMonth() + 1
//       }-${booking.departureDate.getFullYear()} ${
//         validBody.data.departureTime
//       }`,
//       firstName: booking.firstName,
//       lastName: booking.lastName,
//     },
//     capture_method: "automatic",
//   },
//   payment_method_types: [myPayment as "card" | "paypal" | "ideal"],

//   line_items: [
//     {
//       price_data: {
//         currency: "eur",
//         product_data: {
//           name: service.name,
//           description: `Booking for ${daysofparking} day(s) parking ${
//             !!options && !!options.length
//               ? `with extra options (  ${options.map(
//                   (el) => `${el.label} for  €${el.price}`
//                 )})`
//               : ""
//           }`,
//         },
//         unit_amount: booking.total * 100,
//       },
//       quantity: 1,
//     },
//   ],
//   expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
//   mode: "payment",
//   metadata: {
//     id: booking.id,
//     bookingCode: booking.bookingCode,

//     payed: total,
//     startDate: arrivalString,
//     endDate: departureString,
//     startTime: validBody.data.arrivalTime,
//     endTime: validBody.data.departureTime,
//     service: service.name,
//     arrivalString: `${booking.arrivalDate.getDate()}-${
//       booking.arrivalDate.getMonth() + 1
//     }-${booking.arrivalDate.getFullYear()} ${validBody.data.arrivalTime}`,
//     departureString: `${booking.departureDate.getDate()}-${
//       booking.departureDate.getMonth() + 1
//     }-${booking.departureDate.getFullYear()} ${
//       validBody.data.departureTime
//     }`,
//     firstName: booking.firstName,
//     lastName: booking.lastName,
//   },

//   success_url: `${process.env.NEXT_PUBLIC_FRONTEND!}/checkout?success=${
//     booking.id
//   }`,
//   cancel_url: `${process.env.NEXT_PUBLIC_FRONTEND!}/checkout?canceled`,
// });
