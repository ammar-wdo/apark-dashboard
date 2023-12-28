import { Availability, Rule } from "@prisma/client";

export const findBlockingDates = (
  entity: any[] ,
  startDate: Date,
  endDate: Date
) => {


  const result = entity.reduce((accumolator: any[], value) => {
console.log(value)



const arrivalDate = value.startDate;
const departureDate = value.endDate;
    if (
      (startDate >= arrivalDate) &&
        (startDate <= departureDate) ||
      (endDate >= arrivalDate) &&
       (endDate <=departureDate) ||
      (startDate < arrivalDate) &&
       (endDate > departureDate)
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



