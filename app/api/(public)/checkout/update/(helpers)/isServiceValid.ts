import { Service } from "@prisma/client";
import { findBlockingDates } from "../../../services/(helpers)/findBlockingDates";

import { getFinalDates } from "../../../services/(helpers)/getFinalDates";
import { findBusyPlaces } from "../../../services/(helpers)/findBusyPlaces";




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
      console.log("service")

      const busyPlaces = findBusyPlaces(service.bookings, adjustedStartDate, adjustedEndDate);
      // console.log("busy places",busyPlaces.length)

      const availabelPlaces = service.spots - busyPlaces.length;
      // console.log("available places",availabelPlaces)

      if (availabelPlaces > 0) {

    return  true
      }else{
        return false
      }

     
    

  

};





