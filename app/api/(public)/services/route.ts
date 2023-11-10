import prisma from "@/lib/db";
import { Service } from "@prisma/client";
import { NextResponse } from "next/server";
import { calculateParkingDays } from "./(helpers)/findParkingDays";

export async function GET(req:Request){


    const {searchParams} = new URL( req.url)

    const startDate = searchParams.get('startDate') as string
    const endDate = searchParams.get('endDate') as string
    const startTime = searchParams.get('startTime') as string
    const endTime = searchParams.get('endTime') as string

try {
    const services = await prisma.service.findMany({where:{
        isActive:true,
       
    },
include:{
    bookings:true
}})

const parkingDays = calculateParkingDays(new Date(startDate),new Date(endDate)) +1



const validServices = services.map((service)=>{

const busyPlaces = service.bookings.map((booking)=>{
    const arrivalDate = new Date(booking.arrivalDate)
    const departureDate = new Date(booking.departureDate)

    if(arrivalDate <= new Date(startDate) && departureDate >=new Date(endDate)){
return booking
    }
    else return null
}
)

    const availabelPlaces = service.spots - busyPlaces.length

    if(availabelPlaces > 0){ 
        const totalPrice = service.pricings.slice(0,parkingDays).reduce((total,value)=>total + value,0)
       
        
        return { ...service,totalPrice} }
    else return null

})



    return NextResponse.json(validServices)

} catch (error) {
    console.log('failded to fetch services',error)
    return new NextResponse('internal error',{status:500})
    
}

}