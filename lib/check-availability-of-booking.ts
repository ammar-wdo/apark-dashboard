import { Booking } from "@prisma/client";
import { calculateBookingsPerDay } from "./calculate-bookings-per-day";



export const checkBookingAvailability = (bookings: Booking[], startDate: Date, endDate: Date, availableRooms: number): boolean => {
    const bookingsPerDay = calculateBookingsPerDay(bookings, startDate, endDate);

  
   for(const theDate in bookingsPerDay){
    console.log('places',bookingsPerDay[theDate])
    if(bookingsPerDay[theDate] && bookingsPerDay[theDate] >= availableRooms)
    {
        console.log('places',bookingsPerDay[theDate])
        return false
    }
   }
  
    return true;
  };