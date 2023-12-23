import { Availability, Rule } from "@prisma/client";

export const findBlockingDates = (
  entity: any[] ,
  startDate: string,
  endDate: string
) => {


  const result = entity.reduce((accumolator: any[], value) => {
console.log(value)
    if (
      (new Date(new Date(startDate)) >= new Date(new Date(value.startDate)) &&
        new Date(new Date(startDate)) <= new Date(new Date(value.endDate))) ||
      (new Date(new Date(endDate)) >= new Date(new Date(value.startDate)) &&
        new Date(new Date(endDate)) <= new Date(new Date(value.endDate))) ||
      (new Date(new Date(startDate)) < new Date(new Date(value.startDate)) &&
        new Date(new Date(endDate)) > new Date(new Date(value.endDate)))
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



