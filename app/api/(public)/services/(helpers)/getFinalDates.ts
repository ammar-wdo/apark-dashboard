import { handleTimezone } from "@/lib/timezone-handler"
import { getClientDates } from "./getClientDates"

export const getFinalDates = (startDate:string,endDate:string,startTime:string,endTime:string)=>{


    const {clientArrivalDate,clientDepartureDate} = getClientDates(startDate,endDate,startTime,endTime)
    const {adjustedStartDate,adjustedEndDate} = handleTimezone(clientArrivalDate,clientDepartureDate)


    return {adjustedStartDate,adjustedEndDate}

}