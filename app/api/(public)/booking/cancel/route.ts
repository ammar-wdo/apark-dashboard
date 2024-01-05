import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import { morethanOneDay } from "./(helper)/isOneDay";
import { setLog } from "../../(helpers)/set-log";
import { sendMail } from "../../webhook/(helpers)/send-email";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: Request) {
  console.log("try");
  try {
    const { bookingId, bookingCode, email } = await req.json();

    if (!bookingId || !bookingCode || !email)
      return NextResponse.json(
        { error: "fields are missing" },
        { status: 400 }
      );

    const booking = await prisma.booking.findUnique({
      where: {
        id: bookingId,
        bookingCode,
        email,
        paymentStatus: "SUCCEEDED",
        bookingStatus: "ACTIVE",
     
      },
    });

    if (!booking)
      return NextResponse.json(
        { error: "Booking is not valid" },
        { status: 400 }
      );

      const amesterdam = new Date();

      amesterdam.setHours(amesterdam.getHours() + 1);
    
      amesterdam.setMinutes(amesterdam.getMinutes());
  
        if(booking.arrivalDate <= amesterdam)
        return NextResponse.json(
          { customError: "You can no more update your booking because arrival date already passed." },
          { status: 400 }
        );

    const entity = await prisma.entity.findFirst({
      where: {
        services: {
          some: { id: booking.serviceId },
        },
      },
      select: {
        id: true,
        companyId: true,
      },
    });

    if (!morethanOneDay(booking.arrivalDate)) {
   const updatedBooking =   await prisma.booking.update({
        where: {
          id: booking.id,
        },
        data: {
        
          bookingStatus: "CANCELED",
        },
      });

      const values = setLog(
        0,
        "CANCELED",
        "This booking has been canceled , but no refunding steps are required",
        updatedBooking
      );
      const newLog = prisma.log.create({
        data: {
          ...values,
        },
      });

      const notification = prisma.notification.create({
        data: 
          {
          IdHolder: booking.id,
          entityId: entity?.id,
    
          companyId: entity?.companyId,
          status: "DELETE",
          type: "BOOKING",
          message: "A booking has been canceled",
        },
      
      
      
      });

      await Promise.all([newLog, notification]);
      await sendMail('booking canceled','your booking is successfully canceled',"ammar@wdodigital.com","Ammar")
    } else {

    const updatedBooking =  await prisma.booking.update({
        where: {
          id: booking.id,
        },
        data: {
          bookingStatus: "REFUND_REQUEST",
        },
      });

      const values = setLog(
        0,
        "CANCELED",
        "This booking has been canceled and requiring a refund action ",
        updatedBooking
      );
      const newLog = prisma.log.create({
        data: {
          ...values,
        },
      });

      const notification = prisma.notification.create({
        data: {
          IdHolder: booking.id,
          isAdmin:true,
          entityId: entity?.id,
          companyId: entity?.companyId,
          status: "DELETE",
          type: "BOOKING",
          message: "A booking has been canceled and requiring a refund action",
        },
      });

      await Promise.all([newLog, notification]);
      await sendMail('booking canceled','your booking is successfully canceled and you will be refunded',"ammar@wdodigital.com","Ammar")
    }

   

    return NextResponse.json(
      { redirect_url: `/cancel` },
      { status: 201, headers: corsHeaders }
    );
  } catch (error) {
    console.log("cancel error", error);
    return NextResponse.json(
      { customError: "Custom Internal error" },
      { status: 500 }
    );
  }
}
