import prisma from "@/lib/db";
import { NextResponse } from "next/server";


const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
  
  export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
  }


export async function POST(req:Request){

    console.log('done')

    try {
const {
    bookingOnBusinessName,
    extraServiceFee,
    status,
    address,
    arrivalDate,
    bookingCode,
    carColor,
    carLicense,
    carModel,
    serviceId,
    companyName,
    arrivalTime,
    departureTime,
    daysofparking,
    departureDate,
    discount,
    flightNumber,
    parkingId,
    parkingPrice,
    paymentStatus,
    paymentMethod,
    place,
    returnFlightNumber,
    total,
    vatNumber,
    zipcode
} = await req.json()

console.log('serviceId',serviceId)

if(!extraServiceFee || !status || !arrivalDate || !bookingCode || !carColor || !carLicense || !carModel || !arrivalTime || !departureTime
     || !daysofparking || !departureDate || !parkingPrice || !paymentMethod || !total || !zipcode)
     return new NextResponse('Enter all required fields',{status:400})


     const booking = await prisma.booking.create(
     {
        data:{
            bookingOnBusinessName,
            extraServiceFee,
   status,
    address,
    arrivalDate,
    bookingCode,
    carColor,
    carLicense,
    carModel,
    serviceId,
    companyName,
    arrivalTime,
    departureTime,
    daysofparking,
    departureDate,
    discount,
    flightNumber,
    parkingId,
    parkingPrice,
    paymentStatus,
   paymentMethod,
    place,
    returnFlightNumber,
    total,
    vatNumber,
    zipcode
        }
     })


     return NextResponse.json({message:'success'},{headers:corsHeaders})


        
    } catch (error) {
console.log('error-post-booking',error)
        return new NextResponse('internal error',{status:500})
        
    }


}