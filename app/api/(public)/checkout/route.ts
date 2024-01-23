import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import { isAvailable } from "./(helpers)/isAvailable";
import prisma from "@/lib/db";
import { ExraOption, STATUS } from "@prisma/client";
import { bookingSchema } from "@/schemas";
import { daysAndTotal } from "./(helpers)/days-and-total";
import { nanoid } from "nanoid";
import { findValidServices } from "../services/(helpers)/findValidServices";
import { getClientDates } from "../services/(helpers)/getClientDates";
import { getFinalDates } from "../services/(helpers)/getFinalDates";
import { generateUniquePattern } from "./(helpers)/generateId";
import { checkOptions } from "./(helpers)/check-options";
import { generateBookingCode } from "./(helpers)/generateBookingCode";
import { stripeCheckout } from "./(helpers)/stripe-checkout";
import { checkDiscount } from "./(helpers)/check-discount";
import { isServiceValid } from "./update/(helpers)/isServiceValid";

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
  
  let booking;

  try {
    const body = await req.json();
    body.arrivalDate = new Date(body.arrivalDate);
    body.departureDate = new Date(body.departureDate);

    const { ids, discountId, ...rest } = body;

    const validBody = bookingSchema.safeParse(rest);
    if (!validBody.success)
      return NextResponse.json(validBody.error, { status: 400 });

    const arrivalString = validBody.data.arrivalDate.toString();
    const departureString = validBody.data.departureDate.toString();

    const { adjustedStartDate, adjustedEndDate } = getFinalDates(
      arrivalString,
      departureString,
      validBody.data.arrivalTime,
      validBody.data.departureTime
    );

    const { total, daysofparking } = await daysAndTotal(
      adjustedStartDate,
      adjustedEndDate,
      validBody.data.serviceId
    );

    const service = await prisma.service.findUnique({
      where: {
        id: validBody.data.serviceId,
        isActive: true,
      },
      include: {
        bookings: {
          where: {
            paymentStatus: { in: ["SUCCEEDED", "PENDING"] },
            bookingStatus: "ACTIVE",
            AND: [
              { arrivalDate: { lte: adjustedEndDate } },
              { departureDate: { gte: adjustedStartDate } },
            ],
          },
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

    const validServices = isServiceValid(
      service,
      validBody.data.arrivalDate.toString(),
      validBody.data.departureDate.toString(),
      validBody.data.arrivalTime,
      validBody.data.departureTime,
  
    );

    if (!validServices)
      return NextResponse.json(
        { customError: "Deze dienst heeft geen vrije plaatsen meer!" },
        { status: 400 }
      );

    const available = await isAvailable(body.serviceId);

    if (!available)
      return NextResponse.json(
        { customError: "This service is not available" },
        { status: 400 }
      );

    const bookingCode = await generateBookingCode();

    const { priceWithOptions, options } = await checkOptions(ids, service.id);
    const { priceWithDiscount, error, discount } = await checkDiscount(
      discountId,
      total,
      priceWithOptions,
      adjustedStartDate,
      adjustedEndDate
    );
    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }
console.log('discount value',priceWithDiscount)
    const finalTotal = (total +
      priceWithOptions -
      priceWithDiscount!) as number;

      console.log('total',total,'price with options',priceWithOptions,"price With Discount",priceWithDiscount,'final total',finalTotal)

    booking = await prisma.booking.create({
      data: {
        ...validBody.data,
        email:validBody.data.email.toLowerCase(),
        bookingCode,
        arrivalDate: adjustedStartDate,
        departureDate: adjustedEndDate,
        total: finalTotal,
        daysofparking,
        serviceCommession: service.commession,
        ...(discount && { discount }),
        ...(!!options.length && {
          extraOptions: options.map((el: ExraOption) => ({
            id: el.id,
            commession: el.commession,
            label: el.label,
            price: el.price,
          })),
        }),
      },
    });
console.log('name',booking.firstName)
    const myPayment = methods[booking.paymentMethod];

    //  checkout session

    const session = await stripeCheckout(
      booking,
      finalTotal,  //from total to final total ??
      arrivalString,
      departureString,
      validBody.data.arrivalTime,
      validBody.data.departureTime,
      service.name,
      myPayment as "card" | "paypal" | "ideal",
      daysofparking,
      options
    );

    return NextResponse.json(
      { url: session.url },
      {
        headers: corsHeaders,
      }
    );
  } catch (error) {
    console.log(error);
    await prisma.booking.delete({ where: { id: booking?.id } });
    return new NextResponse("internal error", { status: 500 });
  }
}
