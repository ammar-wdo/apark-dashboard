import { Booking } from "@prisma/client";

export const calculateBookingsPerDay = (
  bookings: Booking[],
  startDate: Date,
  endDate: Date
): Record<string, number> => {
  const bookingsPerDay: Record<string, number> = {};
  console.log(startDate);
  console.log(endDate);

  for (
    let date = new Date(startDate);
    date <= new Date(endDate);
    date.setDate(date.getDate() + 1)
  ) {
    console.log("start date", date, "hours", date.getHours());
    const dateString = date.toISOString().split("T")[0];

    bookings.forEach((booking) => {
      const { arrivalDate, departureDate } = booking;

        if (bookingsPerDay[dateString]) {
          bookingsPerDay[dateString]++;
        } else {
          bookingsPerDay[dateString] = 1;
        }
      }
    );
  }
  console.log(bookingsPerDay);
  return bookingsPerDay;
};


//refactor
