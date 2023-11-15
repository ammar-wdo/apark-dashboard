
import prisma from "@/lib/db";
import { getCurrentCompany } from "@/lib/helpers";
import { availabilitySchema } from "@/schemas";
import { NextResponse } from "next/server";



export async function POST(req:Request){


    try {
const company = await getCurrentCompany()

if(!company) return new NextResponse('Unauthenticated',{status:401})

const body = await req.json()
console.log(body.startDate)
body.startDate=new Date(body.startDate)
body.endDate=new Date(body.endDate)
console.log(body.startDate.toISOString())

const validBody = availabilitySchema.safeParse(body)
if(!validBody.success) return NextResponse.json(validBody.error,{status:400})


await prisma.availability.create({
    data:{
  ...validBody.data
    }
})


return NextResponse.json({message:'Success'},{status:201})


        
    } catch (error) {
        console.log('availability post error',error)
        return new NextResponse('internal error',{status:500})
    }

}