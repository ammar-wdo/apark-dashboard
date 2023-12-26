import { Availability, Booking, Rule, Service } from "@prisma/client";
import { calculateParkingDays } from "../../../services/(helpers)/findParkingDays";
import { findTotalPrice } from "./findNewTotal";



type Props = {
    bookingArrival:Date,
    bookingDeparture:Date,
parkingDays:number,
totalPrice:number
    service:Service &{bookings:Booking[],rules:Rule[],availability:Availability[]}
}

export const calculateNewUpdate = ({bookingArrival,bookingDeparture,service,parkingDays,totalPrice}:Props)=>{



    const userParkingDays = calculateParkingDays(
        new Date(bookingArrival),
        new Date(bookingDeparture)
      );
  
      const userTotalPrice = findTotalPrice(
        service,
        userParkingDays,
        bookingArrival.toString(),
        bookingDeparture.toString()
      );
  
      const newParkingDays = parkingDays > userParkingDays;
      const additionalDays = newParkingDays ? parkingDays - userParkingDays : 0;
  
      let additionalPrice = newParkingDays ? totalPrice - userTotalPrice : 0;
      if (additionalPrice < 0) {
        additionalPrice = 0;
      }


      return {additionalDays,additionalPrice}
}