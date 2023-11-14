import { Availability, Rule } from "@prisma/client";

export const findBlockingDates = (
  entity: any[] ,
  startDate: string,
  endDate: string
) => {


  const result = entity.reduce((accumolator: any[], value) => {

    if (
      (new Date(startDate) >= new Date(value.startDate) &&
        new Date(startDate) <= new Date(value.endDate)) ||
      (new Date(endDate) >= new Date(value.startDate) &&
        new Date(endDate) <= new Date(value.endDate)) ||
      (new Date(startDate) < new Date(value.startDate) &&
        new Date(endDate) > new Date(value.endDate))
    ) {
      console.log('block')
      accumolator.push(value);
    } else {
      return accumolator;
    }
    return accumolator;
  }, []);

  return result;
};



