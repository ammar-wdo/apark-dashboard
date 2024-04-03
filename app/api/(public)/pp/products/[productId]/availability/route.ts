import prisma from "@/lib/db";
import { availabilitySchema } from "@/schemas";
import { NextResponse } from "next/server";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
  }
  
export const POST = async(req:Request,{params}:{params:{productId:string}})=>{

  if(!params.productId) return NextResponse.json({success:false,error:"productId is requred"},{status:400,headers: corsHeaders})

    try {
        const apiKey = req.headers.get("x-api-key");

        if (apiKey !== "PV+AIRVrjpu+r2k5M9rCPH62hOLYvrLjwo399Sc+b0I") {
            return NextResponse.json(
              { error: "Unauthorized access" },
              { status: 401 }
            );
          }

        const body = await req.json()
        console.log(body)

        const validBody = availabilitySchema.safeParse(body)
        if(!validBody.success) return NextResponse.json({success:false,error:'Invalid Inputs'},{status:400,headers: corsHeaders})

        const {serviceId,startDate,endDate,...rest} = validBody.data

        const availability = await prisma.availability.create({
          data:{
            serviceId:params.productId,
            startDate:new Date(startDate.setHours(0,0,0,0)),
            endDate:new Date(endDate.setHours(23,45,0,0)),
            ...rest
          }
        })

        

        return NextResponse.json({success:true,availabilityId:availability.id,message:'successfully created'},{status:200,headers: corsHeaders})
        
    } catch (error) {
        console.log(error)
        return NextResponse.json({error:'Internal error'},{status:500,headers: corsHeaders})
    }


}