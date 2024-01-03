import { Booking } from "@prisma/client";

export const calculateBookingsPerDay = (
  bookings: { id: string; arrivalDate: Date; departureDate: Date }[],
  arrivalDate: Date,
  departureDate: Date
): Record<string, number> => {
  const numBookingsPerDay: Record<string, number> = {};

  bookings.forEach((booking) => {
    const bookingStart = booking.arrivalDate.getTime();
    const bookingEnd = booking.departureDate.getTime();

    console.log("arrival range", arrivalDate);
    console.log("departure range", departureDate);

    // Case 1: Arrival date is the same as departure date

    if (
      new Date(arrivalDate).setHours(0, 0, 0, 0) ===
      new Date(departureDate).setHours(0, 0, 0, 0)
    ) {
      if (
        bookingStart <= departureDate.getTime() &&
        bookingEnd >= arrivalDate.getTime()
      ) {
        const currentDay = `${arrivalDate.getFullYear()}-${
          arrivalDate.getMonth() + 1
        }-${arrivalDate.getDate()}`;
        numBookingsPerDay[currentDay] =
          (numBookingsPerDay[currentDay] || 0) + 1;
      }
    } else {
      // Case 2: Arrival date is different from departure date

      const currentDate = new Date(arrivalDate);

      while (currentDate.getDate() <= departureDate.getDate()) {
        if (currentDate.getDate() === arrivalDate.getDate()) {
          //Case a: Current day is equal to user arrival day
          if (
            bookingStart <=
              new Date(currentDate.getTime()).setHours(23, 45, 0, 0) &&
            bookingEnd >= currentDate.getTime()
          ) {
            const currentDay = `${currentDate.getFullYear()}-${
              currentDate.getMonth() + 1
            }-${currentDate.getDate()}`;
            numBookingsPerDay[currentDay] =
              (numBookingsPerDay[currentDay] || 0) + 1;
          }
        } else if (currentDate.getDate() === departureDate.getDate()) {
          //Case b: Current day is equal to user departure day
          if (
            bookingStart <= departureDate.getTime() &&
            bookingEnd >= new Date(currentDate.getTime()).setHours(0, 0, 0, 0)
          ) {
            const currentDay = `${currentDate.getFullYear()}-${
              currentDate.getMonth() + 1
            }-${currentDate.getDate()}`;
            numBookingsPerDay[currentDay] =
              (numBookingsPerDay[currentDay] || 0) + 1;
          }
        } else {
          if (
            bookingStart <=
              new Date(currentDate.getTime()).setHours(23, 45, 0, 0) &&
            bookingEnd >= new Date(currentDate.getTime()).setHours(0, 0, 0, 0)
          ) {
            const currentDay = `${currentDate.getFullYear()}-${
              currentDate.getMonth() + 1
            }-${currentDate.getDate()}`;
            numBookingsPerDay[currentDay] =
              (numBookingsPerDay[currentDay] || 0) + 1;
          }
        }

        currentDate.setDate(currentDate.getDate() + 1);
      }
    }
  });
  console.log(numBookingsPerDay);
  return numBookingsPerDay;
};

//refactor
