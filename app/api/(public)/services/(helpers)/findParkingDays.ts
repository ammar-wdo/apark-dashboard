export function calculateParkingDays(arrivalDate:Date,departureDate:Date) {
   
  
    // Calculate the time difference in milliseconds
  
const arrival = new Date(arrivalDate)
const departure = new Date(departureDate)

  console.log("departure date",arrival)
  console.log("arrival date",departure)
    const timeDiff = arrival.getTime() - departure.getTime();
  
    // Calculate the number of days (rounded up)
    const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  
    return days + 1;
    }