import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { calculateParkingDays } from "../../(helpers)/findParkingDays";
import { isServiceValid } from "../../../checkout/update/(helpers)/isServiceValid";


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


        if(!service) return NextResponse.json({error:'service is not available'},{status:400})

          const validService  = isServiceValid(service,startDate,endDate)

          console.log(validService)


if(!validService) return NextResponse.json({customError:'Service is not available'},{status:400})

return NextResponse.json({url:`/checkout/${service.id}`},{status:200})


    } catch (error) {
        console.log(error)
        return NextResponse.json({error:'internal error'},{status:400})
    }

}