import { Booking } from "@prisma/client";




export const calculateBookingsPerDay = (bookings: Booking[], startDate: Date, endDate: Date): Record<string, number> => {
  const bookingsPerDay: Record<string, number> = {};

  bookings.forEach(booking => {
    const { arrivalDate, departureDate } = booking;
    const start = new Date(arrivalDate);
    const end = new Date(departureDate);

    const bookingStartDate = new Date(Math.max(start.getTime(), startDate.getTime()));
    const bookingEndDate = new Date(Math.min(end.getTime(), endDate.getTime()));

    for (let date = new Date(bookingStartDate); date <= bookingEndDate; date.setDate(date.getDate() + 1)) {
      const dateString = date.toISOString().split('T')[0];

      if (bookingsPerDay[dateString]) {
        bookingsPerDay[dateString]++;
      } else {
        bookingsPerDay[dateString] = 1;
      }
    }
  });

  return bookingsPerDay;
};