import { Availability, Booking, List, Rule, Service } from "@prisma/client";
import { calculateParkingDays } from "../../../services/(helpers)/findParkingDays";
import { findTotalPrice } from "../../../services/(helpers)/findTotalPrice";




type Props = {
    bookingArrival:Date,
    bookingDeparture:Date,
parkingDays:number,
totalPrice:number
    service:Service &{bookings:Booking[],rules:Rule[],availability:Availability[],lists:List[]}
}

export const calculateNewUpdate = ({bookingArrival,bookingDeparture,service,parkingDays,totalPrice}:Props)=>{



    const userParkingDays = calculateParkingDays(
       bookingArrival,
        bookingDeparture
      );
  
      const userTotalPrice = findTotalPrice(
        service,
        userParkingDays,
        bookingArrival,
        bookingDeparture
      );
  
      const newParkingDays = parkingDays > userParkingDays;
      const additionalDays = newParkingDays ? parkingDays - userParkingDays : 0;
  
      let additionalPrice = newParkingDays ? totalPrice - userTotalPrice : 0;
      if (additionalPrice < 0) {
        additionalPrice = 0;
      }


      return {additionalDays,additionalPrice:+additionalPrice.toFixed(2)}
}