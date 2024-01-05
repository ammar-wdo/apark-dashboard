import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest,{params}:{params:{serviceName:string}}){
    try {

const name = params.serviceName
if(!name) return NextResponse.json({error:"service name is required"},{status:400})
const searchParams = req.nextUrl.searchParams
const entityName = searchParams.get('entityName')
const airportName = searchParams.get('airportName')

if(!entityName) return NextResponse.json({error:"entity name is required"},{status:400})
if(!airportName) return NextResponse.json({error:"airport name is required"},{status:400})

const service = await prisma.service.findFirst({
    where:{
        slug:name,
        isActive:true,
        entity:{slug:entityName,airport:{slug:airportName}}
    },
    include:{
        entity:{select:{entityName:true,slug:true,airport:{select:{name:true,slug:true}}}},
        reviews:{
            where:{
                status:'ACTIVE'
            },select:{
                id:true,rate:true
            }
        }
    }
})
let totalReviews = 0
if(service?.reviews.length){

    const totalRate = service.reviews.reduce((total,val)=>total + val.rate,0)
    totalReviews = totalRate / service.reviews.length
}



return NextResponse.json({service:{...service,totalReviews}},{status:200})
        
    } catch (error) {
        console.log(error)
        return NextResponse.json({error:"internal error"},{status:500})
    }
}