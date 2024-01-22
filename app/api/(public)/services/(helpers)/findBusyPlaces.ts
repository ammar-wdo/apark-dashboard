import { Booking } from "@prisma/client";
// Ensure that getClientDates and getFinalDates are used elsewhere or remove these imports.

export const findBusyPlaces = (
  bookings: Booking[],
  userStartDate: Date,
  userEndDate: Date
) => {
  return bookings.filter((booking) => {
    // Directly return the result of the overlap check
    return (
      userStartDate <= booking.departureDate &&
      userEndDate >= booking.arrivalDate
    );
  });
};









// import { Booking } from "@prisma/client";
// import { getClientDates } from "./getClientDates";
// import { getFinalDates } from "./getFinalDates";

// export const findBusyPlaces = (
//   bookings: Booking[],
//   startDate: Date,
//   endDate: Date,

// ) => {

//   const busyPlaces = bookings.filter((booking) => {
//     const arrivalDate = booking.arrivalDate;
//     const departureDate = booking.departureDate;

//     if (
//       (startDate >= arrivalDate &&
//         startDate <= departureDate) ||
//       (endDate >= arrivalDate &&
//         endDate <= departureDate) ||
//       (startDate < arrivalDate &&
//         endDate > departureDate)
//     ) {
//       // console.log("true")
//       return true;
//     } else {
//       // console.log("false");
//       return false;
//     }
//   });

//   return busyPlaces;
// };
