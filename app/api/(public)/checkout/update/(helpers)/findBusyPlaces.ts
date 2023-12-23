import { Booking } from "@prisma/client";
import { getClientDates } from "../../../services/(helpers)/getClientDates";


export const findBusyPlaces = (
  bookings: Booking[],
  startDate: string,
  endDate: string,
  startTime:string,
  endTime:string
) => {
 const {clientArrivalDate,clientDepartureDate} = getClientDates(startDate,endDate,startTime,endTime)

  const busyPlaces = bookings.filter((booking) => {
    const arrivalDate = booking.arrivalDate;
    const departureDate = booking.departureDate;

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
      (clientArrivalDate >= arrivalDate &&
        clientArrivalDate <= departureDate) ||
      (clientDepartureDate >= arrivalDate &&
        clientDepartureDate <= departureDate) ||
      (clientArrivalDate < arrivalDate &&
        clientDepartureDate > departureDate)
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



// const busyPlaces = bookings.filter((booking) => {
//   const arrivalDate = new Date(booking.arrivalDate);
//   const departureDate = new Date(booking.departureDate);

//   // console.log(
//   //   "booking arrival",
//   //   arrivalDate.toLocaleDateString(),
//   //   "booking departure",
//   //   departureDate.toLocaleDateString(),
//   //   "start date",
//   //   startDate,
//   //   "end date",
//   //   endDate
//   // );

//   if (
//     (new Date(new Date(startDate)) >= new Date(arrivalDate) &&
//       new Date(new Date(startDate)) <= new Date(departureDate)) ||
//     (new Date(new Date(endDate)) >= new Date(arrivalDate) &&
//       new Date(new Date(endDate)) <= new Date(departureDate)) ||
//     (new Date(new Date(startDate)) < new Date(arrivalDate) &&
//       new Date(new Date(endDate)) > new Date(departureDate))
//   ) {
//     // console.log("true")
//     return true;
//   } else {
//     // console.log("false");
//     return false;
//   }
// });