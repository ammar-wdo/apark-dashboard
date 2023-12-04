import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export const revalidate = 0

export async function GET(req:Request){

try {
    

    const {searchParams} = new URL(req.url)

const bookingId = searchParams.get('bookingId')

    if(!bookingId) return new NextResponse('Booking code is required')


    const booking = await prisma.booking.findUnique({
        where:{
            id:bookingId,
            departureDate:{
                gt:new Date()
            }
        }
    })


    return NextResponse.json({booking},{status:200})




} catch (error) {
    console.log(error)
    return new NextResponse('internal error',{status:500})
}
}


export async function POST(req:Request){

try {
    

   

const {email, bookingCode} = await req.json()
console.log(email,bookingCode)


    if(!email || !bookingCode) return new NextResponse('creadentials are required')


    const booking = await prisma.booking.findUnique({
        where:{
            email,
            bookingCode,
            paymentStatus:{in:['SUCCEEDED']},
            bookingStatus:'ACTIVE',
            departureDate:{
                gte:new Date(new Date().setHours(0,0,0,0))
            }
        }
    })

    console.log(booking?.departureDate, new Date())

    if(!booking) return new NextResponse('invalid creadentials',{status:400})


    return NextResponse.json({booking},{status:200})




} catch (error) {
    console.log(error)
    return new NextResponse('internal error',{status:500})
}
}