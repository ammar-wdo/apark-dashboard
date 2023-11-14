import { Booking } from "@prisma/client";

export const findBusyPlaces = (bookings:Booking[],startDate:string,endDate:string)=>{


    const busyPlaces = bookings.filter((booking) => {
        const arrivalDate = new Date(booking.arrivalDate);
        const departureDate = new Date(booking.departureDate);

      

        if (
          arrivalDate <= new Date(startDate) &&
          departureDate >= new Date(endDate)
        ) {
          return true;
        } else return false;
      });


      return busyPlaces

}

