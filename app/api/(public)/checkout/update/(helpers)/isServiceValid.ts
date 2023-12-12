import { Service } from "@prisma/client";
import { findBlockingDates } from "../../../services/(helpers)/findBlockingDates";
import { findBusyPlaces } from "./findBusyPlaces";




type FullService = Service & {
  availability: any[];
  bookings: any[];
  rules:any[]
};



export const isServiceValid = (
  service: FullService,
  startDate: string,
  endDate: string,
  bookingId?:string,

  // parkingDays: number
) => {


      const isBlocked = findBlockingDates(
        service?.availability,
        startDate,
        endDate
      );

      if (!!isBlocked.length) return false;
      console.log("service")

      const busyPlaces = findBusyPlaces(service.bookings, startDate, endDate);
      // console.log("busy places",busyPlaces.length)

      const availabelPlaces = service.spots - busyPlaces.length;
      // console.log("available places",availabelPlaces)

      if (availabelPlaces > 0) {

    return  true
      }else{
        return false
      }

     
    

  

};





