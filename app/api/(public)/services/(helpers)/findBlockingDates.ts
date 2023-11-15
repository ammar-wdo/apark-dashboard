import { Availability, Rule } from "@prisma/client";

export const findBlockingDates = (
  entity: any[] ,
  startDate: string,
  endDate: string
) => {


  const result = entity.reduce((accumolator: any[], value) => {
console.log(value)
    if (
      (new Date(new Date(startDate).setHours(0,0,0,0)) >= new Date(new Date(value.startDate).setHours(0,0,0,0)) &&
        new Date(new Date(startDate).setHours(0,0,0,0)) <= new Date(new Date(value.endDate).setHours(0,0,0,0))) ||
      (new Date(new Date(endDate).setHours(0,0,0,0)) >= new Date(new Date(value.startDate).setHours(0,0,0,0)) &&
        new Date(new Date(endDate).setHours(0,0,0,0)) <= new Date(new Date(value.endDate).setHours(0,0,0,0))) ||
      (new Date(new Date(startDate).setHours(0,0,0,0)) < new Date(new Date(value.startDate).setHours(0,0,0,0)) &&
        new Date(new Date(endDate).setHours(0,0,0,0)) > new Date(new Date(value.endDate).setHours(0,0,0,0)))
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



