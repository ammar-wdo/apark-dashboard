import { Availability } from "@prisma/client";

export const findBlockingDates = (
  availabilitis: Availability[],
  startDate: string,
  endDate: string
) => {
  const result = availabilitis.reduce((accumolator: Availability[], value) => {
    if (
      (new Date(startDate) >= new Date(value.startDate) &&
        new Date(startDate) <= new Date(value.endDate)) ||
      (new Date(endDate) >= new Date(value.startDate) &&
        new Date(endDate) <= new Date(value.endDate)) ||
      (new Date(startDate) < new Date(value.startDate) &&
        new Date(endDate) > new Date(value.endDate))
    ) {
      accumolator.push(value);
    } else {
      return accumolator;
    }
    return accumolator;
  }, []);

  return result;
};



