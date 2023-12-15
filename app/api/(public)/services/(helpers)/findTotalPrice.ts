import { Rule, Service } from "@prisma/client";
import { findBlockingDates } from "./findBlockingDates";

export const findTotalPrice = (
  service: Service & { rules: Rule[] },
  parkingDays: number,
  startDate: string,
  endDate: string
) => {
  let totalPrice;

  const rules = findBlockingDates(service.rules, startDate, endDate) as Rule[];
  const rule = rules[0];

  if (!rule) {
    totalPrice = service.pricings[parkingDays-1]
   

    return totalPrice;
  }

  const { type, value:theValue, percentage } = rule;

  
    if (type === "FIXED") {
        totalPrice = service.pricings[parkingDays-1] + theValue!;

        return totalPrice < 0 ? 0 : +totalPrice
    } else {
        totalPrice = service.pricings[parkingDays-1]

        return totalPrice < 0 ? 0 : totalPrice + totalPrice*percentage!/100
    }

  

};
