import { Availability, Booking, Rule, Service } from "@prisma/client";
import { findBlockingDates } from "./findBlockingDates";
import { findBusyPlaces } from "./findBusyPlaces";
import { findTotalPrice } from "./findTotalPrice";
import { getFinalDates } from "./getFinalDates";

type FullService = Service & {
  availability: Availability[];
  bookings: Booking[];
  rules:Rule[]
};

type ReturnedService = FullService & {
  totalPrice: number;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  parkingDays:number
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
      console.log("service")

      const busyPlaces = findBusyPlaces(service.bookings,adjustedStartDate,adjustedEndDate);
      // console.log("busy places",busyPlaces.length)

      const availabelPlaces = service.spots - busyPlaces.length;
      // console.log("available places",availabelPlaces)

      if (availabelPlaces > 0) {
        const totalPrice = +findTotalPrice(service, parkingDays,adjustedStartDate,adjustedEndDate);

     
        accumolator.push({
          ...service,
          totalPrice,
          startDate,
          endDate,
          startTime,
          endTime,
          parkingDays
          
        });
      }

      return accumolator;
    },
    []
  );

  return validServices
};





