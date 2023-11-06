import prisma from "@/lib/db";
import { Service } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(req:Request){

try {
    const services = await prisma.service.findMany({where:{
        isActive:true
    }})

    return NextResponse.json(services as Service[])

} catch (error) {
    console.log('failded to fetch services',error)
    return new NextResponse('internal error',{status:500})
    
}

}