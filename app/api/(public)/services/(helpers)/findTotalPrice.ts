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
    totalPrice = service.pricings
      .slice(0, parkingDays)
      .reduce((total, value) => total + value, 0);

    return totalPrice;
  }

  const { type, action, value:theValue, percentage } = rule;

  if (action === "TOTAL") {
    if (type === "FIXED") {
        totalPrice = service.pricings
        .slice(0, parkingDays)
        .reduce((total, value) => total + value, 0) + theValue!;

        return totalPrice < 0 ? 0 :totalPrice
    } else {
        totalPrice = service.pricings
        .slice(0, parkingDays)
        .reduce((total, value) => total + value, 0)

        return totalPrice < 0 ? 0 : totalPrice + totalPrice*percentage!/100
    }

  
  } else {

    if(type==="FIXED"){
        totalPrice = service.pricings
        .slice(0, parkingDays)
        .reduce((total, value) => total + value + theValue!, 0)
        return totalPrice < 0 ? 0 :totalPrice
    }else{
        totalPrice = service.pricings
        .slice(0, parkingDays)
        .reduce((total, value) => total + value + value*percentage!/100, 0)
        return totalPrice < 0 ? 0 :totalPrice
    }

    
  }
};
