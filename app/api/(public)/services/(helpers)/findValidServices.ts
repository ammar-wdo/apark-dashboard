import { Availability, Booking, Rule, Service } from "@prisma/client";
import { findBlockingDates } from "./findBlockingDates";
import { findBusyPlaces } from "./findBusyPlaces";
import { findTotalPrice } from "./findTotalPrice";
import { getFinalDates } from "./getFinalDates";
import { checkBookingAvailability } from "@/lib/check-availability-of-booking";

type FullService = Service & {
  availability: Availability[];
  bookings: Booking[];
  rules:Rule[]
  reviews?:{id:string,rate:number}[]
};

type ReturnedService = FullService & {
  totalPrice: number;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  parkingDays:number
  totalReviews?:number
};

export const findValidServices = (
  services: FullService[],
  startDate: string,
  endDate: string,
  startTime: string,
  endTime: string,
  parkingDays: number
) => {
  const {adjustedStartDate,adjustedEndDate} = getFinalDates(startDate,endDate,startTime,endTime)


  const validServices = services.reduce(
    (accumolator: ReturnedService[], service) => {
      const isBlocked = findBlockingDates(
        service.availability,
        adjustedStartDate,
        adjustedEndDate
      );

      if (!!isBlocked.length) return accumolator;
      // console.log("service")

      const busyPlaces = findBusyPlaces(service.bookings,adjustedStartDate,adjustedEndDate);
      // console.log("busy places",busyPlaces.length)

      const canBook = checkBookingAvailability(busyPlaces,adjustedStartDate,adjustedEndDate,service.spots)


      // const availabelPlaces = service.spots - busyPlaces.length;

      // // console.log("available places",availabelPlaces)

      // if (availabelPlaces > 0) {
      //   const totalPrice = +findTotalPrice(service, parkingDays,adjustedStartDate,adjustedEndDate);
      
      if (canBook) {
        const totalPrice = +findTotalPrice(service, parkingDays,adjustedStartDate,adjustedEndDate);

        let totalReviews = 0
        if(!!service.reviews?.length){
          const reviewsTotal = service.reviews.reduce((total,val)=>total + val.rate,0)
          totalReviews = reviewsTotal/service.reviews.length
        }
    

      

     
        accumolator.push({
          ...service,
          totalPrice,
          startDate,
          endDate,
          startTime,
          endTime,
          parkingDays,
          totalReviews
          
        });
      }

      return accumolator;
    },
    []
  );
// console.log("valid services",validServices.length)
  return validServices
};





