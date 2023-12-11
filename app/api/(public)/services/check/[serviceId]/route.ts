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


        if(!startDate || !endDate || !startTime || !endTime) return NextResponse.json({ignore:'not provided parameters'},{status:200})


        const service = await prisma.service.findUnique({
            where: {
             id:seriviceId,
              isActive: true,
              available:true
            
            },
            include: {
              bookings: {
                where: { paymentStatus: { in: ['SUCCEEDED', 'PENDING'] }, bookingStatus: 'ACTIVE' },
                
              },
              entity:{
                select:{entityName:true,airport:{select:{name:true}}}
              },
              availability: true,
              rules: true,
            },
          });


        if(!service) return NextResponse.json({response:'service is not available'},{status:200})

          const validService  = isServiceValid(service,startDate,endDate)

          console.log(validService)


if(!validService) return NextResponse.json({response:'Service is not available'},{status:200})

const parkingDays = calculateParkingDays(new Date(startDate), new Date(endDate));
const totalPrice = findTotalPrice(service,parkingDays,startDate,endDate)

if(totalPrice===0 || totalPrice === undefined || !totalPrice) return NextResponse.json({response:'service is not available'},{status:200})

console.log(totalPrice)

const {rules,bookings,...theService}=service

return NextResponse.json({service:{...theService,totalPrice:totalPrice,parkingDays:parkingDays,startDate:startDate,endDate:endDate,startTime:startTime,endTime:endTime}},{status:200})


    } catch (error) {
        console.log(error)
        return NextResponse.json({error:'internal error'},{status:400})
    }

}