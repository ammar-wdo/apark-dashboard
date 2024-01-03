import { Booking } from "@prisma/client";
import { calculateBookingsPerDay } from "./calculate-bookings-per-day";



export const checkBookingAvailability = (bookings: Booking[], startDate: Date, endDate: Date, availableRooms: number): boolean => {
    const bookingsPerDay = calculateBookingsPerDay(bookings, startDate, endDate);

  
   for(const theDate in bookingsPerDay){
    if(bookingsPerDay[theDate] && bookingsPerDay[theDate] >= availableRooms)
    {
        return false
    }
   }
  
    return true;
  };