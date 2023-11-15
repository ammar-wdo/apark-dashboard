import { Availability, Booking, Rule, Service } from "@prisma/client";
import { findBlockingDates } from "./findBlockingDates";
import { findBusyPlaces } from "./findBusyPlaces";
import { findTotalPrice } from "./findTotalPrice";

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
};

export const findValidServices = (
  services: FullService[],
  startDate: string,
  endDate: string,
  startTime: string,
  endTime: string,
  parkingDays: number
) => {
  const validServices = services.reduce(
    (accumolator: ReturnedService[], service) => {
      const isBlocked = findBlockingDates(
        service.availability,
        startDate,
        endDate
      );

      if (!!isBlocked.length) return accumolator;

      const busyPlaces = findBusyPlaces(service.bookings, startDate, endDate);

      const availabelPlaces = service.spots - busyPlaces.length;

      if (availabelPlaces > 0) {
        const totalPrice = findTotalPrice(service, parkingDays,startDate,endDate);
        accumolator.push({
          ...service,
          totalPrice,
          startDate,
          endDate,
          startTime,
          endTime,
        });
      }

      return accumolator;
    },
    []
  );

  return validServices
};





