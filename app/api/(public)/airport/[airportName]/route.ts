import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export const revalidate = 0
export async function GET(req:Request,{params}:{params:{airportName:string}}){


    try {
const airportName = params.airportName

if(!airportName) return NextResponse.json({error:"airport name is required"},{status:400})
console.log("name",airportName)

const airport = await prisma.airport.findUnique({
    where:{
      slug:airportName
    }
})

console.log(airport)

return NextResponse.json({airport},{status:200})
        
        
    } catch (error) {
        console.log(error)
        return NextResponse.json({error:'internal error'},{status:500})
    }
}