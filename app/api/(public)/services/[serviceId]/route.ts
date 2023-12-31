import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req:Request,{params}:{params:{serviceId:string}}){
console.log('service')
    try {
        const service = await prisma.service.findUnique({
            where:{
                id:params.serviceId,
                isActive:true
            },
            include:{
                rules:true,
                availability:true,
                bookings:{where:{
                    paymentStatus:{in:['SUCCEEDED','PENDING']},
                    bookingStatus:'ACTIVE'
                },
            }
            }
        })

        return NextResponse.json(service)
    } catch (error) {
        console.log('fetch single service error',error)

        return new NextResponse('something went wrong',{status:400})
    }
}