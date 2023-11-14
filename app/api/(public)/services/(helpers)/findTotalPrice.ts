import { Service } from "@prisma/client";

export const findTotalPrice = (service:Service,parkingDays:number)=>{

    const totalPrice = service.pricings
    .slice(0, parkingDays)
    .reduce((total, value) => total + value, 0);

    return totalPrice
}