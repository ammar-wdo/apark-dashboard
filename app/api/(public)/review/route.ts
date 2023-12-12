import prisma from "@/lib/db";
import { reviewSchema } from "@/schemas";
import { NextResponse } from "next/server";


const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };


  export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
  }

export const POST = async (req:Request)=>{

    try {
const body = await req.json()

const validBody = reviewSchema.safeParse(body)


if(!validBody.success){
    return NextResponse.json({error:validBody.error},{status:400})
}

console.log(validBody.data.rate)

const booking = await prisma.booking.findUnique({
    where:{id:validBody.data.bookingId},
    include:{
        reivew:{
            select:{id:true}
        }
    }
})

if(booking?.reivew) return NextResponse.json({error:'Already has a review'},{status:400})

const review  = await prisma.review.create({
    data:{
        ...validBody.data,
        
    }
})

return NextResponse.json({review},{status:200})
        
    } catch (error) {
        console.log(error)
        return NextResponse.json({error:'Internal error'},{status:500})

    }
}