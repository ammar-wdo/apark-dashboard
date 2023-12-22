import prisma from "@/lib/db";
import { NextResponse,NextRequest } from "next/server";


export async function GET(req:NextRequest){


    try {
console.log('entitiy')
const searchParams = req.nextUrl.searchParams

const airportName = searchParams.get('airportName')
console.log(airportName)
if(!airportName) return NextResponse.json({error:"airport id is required"},{status:400})

const entities = await prisma.entity.findMany({
    where:{
        airport:{slug:airportName},
        isActive:true
    },
    select:{entityName:true,id:true,slug:true,

    images:true
    },

    orderBy:{
        createdAt:'desc'
    }
})

return NextResponse.json({entities},{status:200})

        
    } catch (error) {
        console.log(error)
        return NextResponse.json({error:'internal error'},{status:500})
    }
}