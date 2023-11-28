import { Booking } from "@prisma/client";



export const findBusyPlaces = (
  bookings: Booking[],
  startDate: string,
  endDate: string,
  bookingId:string
) => {
  const busyPlaces = bookings?.filter((booking) => {
    const arrivalDate = new Date(booking.arrivalDate);
    const departureDate = new Date(booking.departureDate);
    if(bookingId === booking.id){
        return false
    }

    // console.log(
    //   "booking arrival",
    //   arrivalDate.toLocaleDateString(),
    //   "booking departure",
    //   departureDate.toLocaleDateString(),
    //   "start date",
    //   startDate,
    //   "end date",
    //   endDate
    // );

    if (
      (new Date(new Date(startDate).setHours(0, 0, 0, 0)) >=
        new Date(arrivalDate.setHours(0, 0, 0, 0)) &&
        new Date(new Date(startDate).setHours(0, 0, 0, 0)) <=
          new Date(departureDate.setHours(0, 0, 0, 0))) ||
      (new Date(new Date(endDate).setHours(0, 0, 0, 0)) >=
        new Date(arrivalDate.setHours(0, 0, 0, 0)) &&
        new Date(new Date(endDate).setHours(0, 0, 0, 0)) <=
          new Date(departureDate.setHours(0, 0, 0, 0))) ||
      (new Date(new Date(startDate).setHours(0, 0, 0, 0)) <
        new Date(arrivalDate.setHours(0, 0, 0, 0)) &&
        new Date(new Date(endDate).setHours(0, 0, 0, 0)) >
          new Date(departureDate.setHours(0, 0, 0, 0)))
    ) {
      // console.log("true")
      return true;
    } else {
      // console.log("false");
      return false;
    }
  });

  return busyPlaces;
};
