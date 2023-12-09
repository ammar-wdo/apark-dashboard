import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest,{params}:{params:{serviceName:string}}){
    try {

const name = params.serviceName
if(!name) return NextResponse.json({error:"service name is required"},{status:400})
const searchParams = req.nextUrl.searchParams
const entityName = searchParams.get('entityName')

if(!entityName) return NextResponse.json({error:"entity name is required"},{status:400})

const service = await prisma.service.findFirst({
    where:{
        name,
        isActive:true,
        entity:{entityName}
    },
    include:{
        entity:{select:{entityName:true,airport:{select:{name:true}}}}
    }
})



return NextResponse.json({service},{status:200})
        
    } catch (error) {
        console.log(error)
        return NextResponse.json({error:"internal error"},{status:500})
    }
}