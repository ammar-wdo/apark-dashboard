import { Attempt, Booking } from "@prisma/client";


export const setLog = (payed:number,attempt:Attempt,message:string,order:Booking)=>{

    return {
        bookingId:order.id,
        payed:payed,
        attempt,
        message,
      arrivalDate:order.arrivalDate,
      arrivalTime:order.arrivalTime,
      bookingCode:order.bookingCode,
      carColor:order.carColor,
      carLicense:order.carLicense,
      carModel:order.carModel,
      daysofparking:order.daysofparking,
      departureDate:order.departureDate,
      departureTime:order.departureTime,
      email:order.email,
      firstName:order.firstName,
      lastName:order.lastName,
      parkingPrice:order.parkingPrice,
      phoneNumber:order.phoneNumber,
      address:order.address,
      bookingOnBusinessName:order.bookingOnBusinessName,
      bookingStatus:order.bookingStatus,
      companyName:order.companyName,
     
      extraServiceFee:order.extraServiceFee,
      flightNumber:order.flightNumber,
      isCompany:order.isCompany,
      paymentMethod:order.paymentMethod,
      paymentStatus:order.paymentStatus,
      place:order.place,
      returnFlightNumber:order.returnFlightNumber,
      status:order.status,
      vatNumber:order.vatNumber,
      zipcode:order.zipcode,
    }

}