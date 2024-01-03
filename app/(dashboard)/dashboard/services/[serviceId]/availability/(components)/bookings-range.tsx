import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import Heading from "@/components/heading";
import { calculateBookingsPerDay } from "@/lib/calculate-bookings-per-day";
import prisma from "@/lib/db";
import { getCurrentCompany } from "@/lib/helpers";
import { NLtimezone } from "@/lib/nl-timezone";
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
  const queryMonth = currentMonth + 1;
  const currentYear = new Date().getFullYear();
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const startDate = new Date(currentYear, currentMonth, 1);
  startDate.setHours(0, 0, 0, 0);

  console.log("start date", startDate.toLocaleString());

  const lastDate = new Date(currentYear, currentMonth, lastDayOfMonth);
  lastDate.setHours(23, 45, 0, 0);

  console.log("end date", lastDate.toLocaleString());

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
      departureDate: {
        gte: startDate,
      },
      arrivalDate: { lte: lastDate },
    },

    select: {
      id: true,
      arrivalDate: true,
      departureDate: true,
    },
  });

  // const bookingsRange = calculateBookingsPerDay(bookings,startDate,lastDate)

  return (
    <div className="my-12">
      <Heading title="Bookings list" description="Bookings for this month" />
      <div className="my-12">
        {/* {JSON.stringify(bookingsRange)} */}
        <div className="my-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="my-6">
              <p>{NLtimezone(booking.arrivalDate, "UTC")}</p>
              <p>{NLtimezone(booking.departureDate, "UTC")}</p>
            </div>
          ))}
        </div>
        <p>current month {queryMonth}</p>
        <p>last day of month {lastDayOfMonth}</p>
      </div>
    </div>
  );
};

export default BookingsRange;
