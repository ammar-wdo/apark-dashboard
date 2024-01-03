import { Service } from "@prisma/client";
import { findBlockingDates } from "../../../services/(helpers)/findBlockingDates";

import { getFinalDates } from "../../../services/(helpers)/getFinalDates";
import { findBusyPlaces } from "../../../services/(helpers)/findBusyPlaces";
import { checkBookingAvailability } from "@/lib/check-availability-of-booking";




type FullService = Service & {
  availability: any[];
  bookings: any[];
  rules:any[]
};



export const isServiceValid = (
  service: FullService,
  startDate: string,
  endDate: string,
startTime:string,
endTime:string

  // parkingDays: number
) => {


  const {adjustedStartDate,adjustedEndDate} = getFinalDates(startDate,endDate,startTime,endTime)

      const isBlocked = findBlockingDates(
        service?.availability,
        adjustedStartDate,
        adjustedEndDate
      );

      if (!!isBlocked.length) return false;
    

      const busyPlaces = findBusyPlaces(service.bookings, adjustedStartDate, adjustedEndDate);
 

    

      const canBook = checkBookingAvailability(busyPlaces,adjustedStartDate,adjustedEndDate,service.spots)

      const availabelPlaces = service.spots - busyPlaces.length;
     

      if (canBook) {

    return  true
      }else{
        return false
      }

     
    

  

};





