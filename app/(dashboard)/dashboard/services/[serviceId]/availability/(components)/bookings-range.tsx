import DailyChart from "@/app/(dashboard)/dashboard/(components)/boxes/daily-chart";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import Heading from "@/components/heading";
import { calculateBookingsPerDay } from "@/lib/calculate-bookings-per-day";
import prisma from "@/lib/db";
import { getCurrentCompany } from "@/lib/helpers";
import { NLtimezone } from "@/lib/nl-timezone";
import { processBookingPerDay } from "@/lib/proccess-booking-per-day";
import { Booking } from "@prisma/client";
import { getServerSession } from "next-auth";
import React from "react";

type Props = {
  serviceId: string;
};

const BookingsRange = async ({ serviceId }: Props) => {
  const currentCompany = await getCurrentCompany();
  const session = await getServerSession(authOptions);

  const currentMonth = new Date().getMonth();

  const currentYear = new Date().getFullYear();
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const startDate = new Date(currentYear, currentMonth, 1);
  startDate.setHours(0, 0, 0, 0);



  const lastDate = new Date(currentYear, currentMonth, lastDayOfMonth);
  lastDate.setHours(23, 45, 0, 0);



  const bookings = await prisma.booking.findMany({
    where: {
      service: {
        id: serviceId,
        ...(session?.user?.name === "Company" && {
          entity: { companyId: currentCompany?.id },
        }),
        ...(session?.user?.name === "Entity" && {
          entityId: currentCompany?.id,
        }),
      },
      paymentStatus: {in:['SUCCEEDED','PENDING']},
      bookingStatus: "ACTIVE",
      AND: [
        { departureDate: { gte: startDate } },
        { arrivalDate: { lte: lastDate } },
      ],
    },

    select: {
      id: true,
      arrivalDate: true,
      departureDate: true,
    },
  });

  const bookingsRange = calculateBookingsPerDay(bookings, startDate, lastDate);

  const resultArray = processBookingPerDay(
    bookingsRange,
    currentYear,
    currentMonth,
    lastDayOfMonth
  );

  const currentDate = new Date();
  const monthName = currentDate.toLocaleString("default", { month: "long" });

  return (
    <div className="">
      <p className="font-semibold">Bookings for {monthName}</p>
      <div className="my-12">
        <DailyChart bookingsPerDay={resultArray} />
      </div>
    </div>
  );
};

export default BookingsRange;
