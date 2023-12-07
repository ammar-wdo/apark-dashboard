import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req:Request){

    try {
        
        const airports = await prisma.airport.findMany({select:{id:true,name:true,images:true}
        })

        return NextResponse.json({airports},{status:200})

    } catch (error) {
        console.log(error)

        return NextResponse.json({error:'Internal error'},{status:500})
    }


}