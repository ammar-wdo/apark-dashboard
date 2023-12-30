import { Booking } from "@prisma/client";



export const calculateBookingsPerDay = (bookings: Booking[], startDate: Date, endDate: Date): Record<string, number> => {
  const bookingsPerDay: Record<string, number> = {};

  bookings.forEach(booking => {
    const { arrivalDate, departureDate } = booking;
    const start = new Date(arrivalDate);
    const end = new Date(departureDate);

    // for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
    //   const dateString = date.toISOString().split('T')[0];

    //   if (bookingsPerDay[dateString]) {
    //     bookingsPerDay[dateString]++;
    //   } else {
    //     bookingsPerDay[dateString] = 1;
    //   }
    // }

    const startDateTime = start.getTime();
    const endDateTime = end.getTime();
    const bookingStartDateTime = startDate.getTime();
    const bookingEndDateTime = endDate.getTime();

    if (startDateTime <= bookingEndDateTime && endDateTime >= bookingStartDateTime) {
      const bookingStartDate = new Date(Math.max(startDateTime, bookingStartDateTime));
      const bookingEndDate = new Date(Math.min(endDateTime, bookingEndDateTime));

      for (let date = new Date(bookingStartDate); date <= bookingEndDate; date.setDate(date.getDate() + 1)) {
        const dateString = date.toISOString().split('T')[0];

        if (bookingsPerDay[dateString]) {
          bookingsPerDay[dateString]++;
        } else {
          bookingsPerDay[dateString] = 1;
        }
      }
    }
  });

  return bookingsPerDay;
};