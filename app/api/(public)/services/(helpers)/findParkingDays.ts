export function calculateParkingDays(arrivalDate:Date,departureDate:Date) {
   
  
    // Calculate the time difference in milliseconds
  
  departureDate.setHours(0,0,0,0)
  arrivalDate.setHours(0,0,0,0)
    const timeDiff = departureDate.getTime() - arrivalDate.getTime();
  
    // Calculate the number of days (rounded up)
    const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  
    return days + 1;
    }