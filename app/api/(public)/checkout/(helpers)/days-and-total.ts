import prisma from "@/lib/db"
import { calculateParkingDays } from "../../services/(helpers)/findParkingDays"
import { findTotalPrice } from "../../services/(helpers)/findTotalPrice"

export const daysAndTotal = async(startDate:Date,endDate:Date,serviceId:string)=>{

const serivce = await prisma.service.findUnique({
    where:{
        id:serviceId
    },
    include:{
        rules:true
    }
})
   


    

    const daysofparking = calculateParkingDays(startDate,endDate)

    const total = findTotalPrice(serivce!,daysofparking,startDate.toString(),endDate.toString())

    return {total :total as number, daysofparking}
}