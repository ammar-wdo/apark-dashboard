export function calculateParkingDays(arrivalDate:Date,departureDate:Date) {
   
  
    // Calculate the time difference in milliseconds
  
const arrival = new Date(arrivalDate)
const departure = new Date(departureDate)

arrival.setHours(0,0,0,0)
departure.setHours(0,0,0,0)
    const timeDiff = departure.getTime() - arrival.getTime();
  
    // Calculate the number of days (rounded up)
    const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  
  console.log("parking days function",days )

    return days + 1;
    }