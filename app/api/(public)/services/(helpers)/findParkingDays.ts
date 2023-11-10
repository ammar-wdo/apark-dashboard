export function calculateParkingDays(arrivalDate:Date,departureDate:Date) {
    const arrival = new Date(arrivalDate);
    const departure = new Date(departureDate);
  
    // Calculate the time difference in milliseconds
  
  
    const timeDiff = departure.getTime() - arrival.getTime();
  
    // Calculate the number of days (rounded up)
    const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  
    return days;
    }