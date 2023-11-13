import prisma from "@/lib/db"
import { calculateParkingDays } from "../../services/(helpers)/findParkingDays"

export const daysAndTotal = async(startDate:Date,endDate:Date,serviceId:string)=>{

const serivce = await prisma.service.findUnique({
    where:{
        id:serviceId
    }
})
   


    const pricings = serivce?.pricings

    const daysofparking = calculateParkingDays(startDate,endDate)

    const total = pricings?.slice(0,daysofparking).reduce((total,value)=>total + value ,0)

    return {total :total as number, daysofparking}

}