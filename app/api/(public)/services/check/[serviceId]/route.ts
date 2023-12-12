import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { calculateParkingDays } from "../../(helpers)/findParkingDays";
import { isServiceValid } from "../../../checkout/update/(helpers)/isServiceValid";
import { findTotalPrice } from "../../(helpers)/findTotalPrice";


export const GET = async (req:NextRequest,{params}:{params:{serviceId:string}})=>{


    try {

console.log('work')
        const seriviceId = params.serviceId
        if(!seriviceId) return NextResponse.json({error:'service Id is required'},{status:400})

        const searchParams = req.nextUrl.searchParams


        const startDate = searchParams.get("startDate") as string;
        const endDate = searchParams.get("endDate") as string;
        const startTime = searchParams.get("startTime") as string;
        const endTime = searchParams.get("endTime") as string;
        const bookingId = searchParams.get("bookingId")
       
        const userStart = searchParams.get("userStart") as string;
        const userEnd = searchParams.get("userEnd") as string;
        console.log("bookingId",bookingId,userStart,userEnd)


        if(!startDate || !endDate || !startTime || !endTime) return NextResponse.json({ignore:'not provided parameters'},{status:200})


        const service = await prisma.service.findUnique({
            where: {
             id:seriviceId,
              isActive: true,
              available:true
            
            },
            include: {
              bookings: {
                where: { paymentStatus: { in: ['SUCCEEDED', 'PENDING'] }, bookingStatus: 'ACTIVE',...(bookingId && {id:{not:bookingId}}) },
                
              },
              entity:{
                select:{entityName:true,airport:{select:{name:true}}}
              },
              availability: true,
              rules: true,
            },
          });

     


        if(!service) return NextResponse.json({response:'service is not available'},{status:200})
        console.log('bookings',service?.bookings.length)
          const validService  = isServiceValid(service,startDate,endDate)

          console.log(validService)


if(!validService) return NextResponse.json({response:'Service is not available'},{status:200})

const parkingDays = calculateParkingDays(new Date(startDate), new Date(endDate));
const totalPrice = findTotalPrice(service,parkingDays,startDate,endDate)

console.log(totalPrice)

if(totalPrice===0 || totalPrice === undefined || !totalPrice) return NextResponse.json({response:'service is not available'},{status:200})



const {rules,bookings,...theService}=service

if(bookingId && userStart && userEnd){
const userParkingDays = calculateParkingDays(new Date(userStart), new Date(userEnd));
const userTotalPrice = findTotalPrice(service,userParkingDays,userStart,userEnd)

const newParkingDays = parkingDays > userParkingDays
const additionalDays = newParkingDays ? parkingDays - userParkingDays : undefined
let additionalPrice = newParkingDays ? totalPrice - userTotalPrice : 0 
if(additionalPrice < 0 ){
    additionalPrice = 0
}

console.log(additionalPrice,newParkingDays)
return NextResponse.json({available:true,additionalPrice,additionalDays},{status:200})

}

return NextResponse.json({service:{...theService,totalPrice:totalPrice,parkingDays:parkingDays,startDate:startDate,endDate:endDate,startTime:startTime,endTime:endTime}},{status:200})


    } catch (error) {
        console.log(error)
        return NextResponse.json({error:'internal error'},{status:400})
    }

}