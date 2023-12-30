import { Booking } from "@prisma/client";
import { calculateBookingsPerDay } from "./calculate-bookings-per-day";



export const checkBookingAvailability = (bookings: Booking[], startDate: Date, endDate: Date, availableRooms: number): boolean => {
    const bookingsPerDay = calculateBookingsPerDay(bookings, startDate, endDate);
    console.log("booking per day",bookingsPerDay)
  
    const startDateTime = startDate.getTime();
    const endDateTime = endDate.getTime();
  
    for (let date = new Date(startDateTime); date <= new Date(endDateTime); date.setDate(date.getDate() + 1)) {
      const dateString = date.toISOString().split('T')[0];
  
      if (bookingsPerDay[dateString] && bookingsPerDay[dateString] >= availableRooms) {
        return false;
      }
    }
  
    return true;
  };