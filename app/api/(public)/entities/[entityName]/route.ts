import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req:NextRequest,{params}:{params:{entityName:string}}){
console.log('done')

    try {
const entityName = params.entityName
const searchParams = req.nextUrl.searchParams
const airportName = searchParams.get('airportName')
if(!airportName)return NextResponse.json({error:'airport name is required'},{status:400})
console.log("entityName",entityName)

if(!entityName) return NextResponse.json({error:'entity name is required'},{status:400})


const entity =await  prisma.entity.findFirst({
    where:{
        airport:{slug:airportName},
       slug: entityName,
        isActive:true
    },
    include:{
        airport:{
            select:{name:true,slug:true}
        }
    }
})
console.log(entity)
return NextResponse.json({entity},{status:200})
        
        
    } catch (error) {
        console.log(error)
        return NextResponse.json({error:"internal error"},{status:500})
    }


}