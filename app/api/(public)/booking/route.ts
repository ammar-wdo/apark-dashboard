import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req:Request){

try {
    

    const {searchParams} = new URL(req.url)

const bookingId = searchParams.get('bookingId')

    if(!bookingId) return new NextResponse('Booking code is required')


    const booking = await prisma.booking.findUnique({
        where:{
            id:bookingId
        }
    })


    return NextResponse.json({booking},{status:200})




} catch (error) {
    console.log(error)
    return new NextResponse('internal error',{status:500})
}
}