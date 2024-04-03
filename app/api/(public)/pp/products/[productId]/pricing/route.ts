import prisma from "@/lib/db";
import { listSchema } from "@/schemas";
import { NextResponse } from "next/server";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
  }
  
export const PATCH = async(req:Request,{params}:{params:{productId:string}})=>{

  if(!params.productId) return NextResponse.json({success:false,error:"product Id is required"},{status:400,headers: corsHeaders})


    try {
        const apiKey = req.headers.get("x-api-key");

        if (apiKey !== "PV+AIRVrjpu+r2k5M9rCPH62hOLYvrLjwo399Sc+b0I") {
            return NextResponse.json(
              { error: "Unauthorized access" },
              { status: 401 ,headers: corsHeaders}
            );
          }

        const body = await req.json()
        console.log(body)


        const service = await prisma.service.findUnique({
          where:{
            id:params.productId
          }
        })

        if(!service) return NextResponse.json({success:false,error:"Service does not exist"},{status:400,headers: corsHeaders})

const updated = await prisma.service.update({
  where:{
    id:params.productId
  },
  data:{
    pricings:body.pricings
  }
})


        return NextResponse.json({success:true,message:'Successfully Updated'},{status:200,headers: corsHeaders})
        
    } catch (error) {
        console.log(error)
        return NextResponse.json({error:'Internal error'},{status:500,headers: corsHeaders})
    }


}






export const POST = async(req:Request,{params}:{params:{productId:string}})=>{

  if(!params.productId) return NextResponse.json({success:false,error:"product Id is required"},{status:400,headers: corsHeaders})


    try {
        const apiKey = req.headers.get("x-api-key");

        if (apiKey !== "PV+AIRVrjpu+r2k5M9rCPH62hOLYvrLjwo399Sc+b0I") {
            return NextResponse.json(
              { error: "Unauthorized access" },
              { status: 401 ,headers: corsHeaders}
            );
          }

        const body = await req.json()
        console.log(body)


        const validBody = listSchema.safeParse(body)
        if(!validBody.success) return NextResponse.json({success:false,error:"Invalid Inputs"},{status:400,headers: corsHeaders})




        const service = await prisma.service.findUnique({
          where:{
            id:params.productId
          }
        })

        if(!service) return NextResponse.json({success:false,error:"Service does not exist"},{status:400,headers: corsHeaders})


        const {endDate,startDate,...rest} = validBody.data
const newList = await prisma.list.create({

  data:{
   serviceId:params.productId,
   startDate:new Date(startDate.setHours(0,0,0,0)),
   endDate:new Date(endDate.setHours(23,45,0,0)),
   ...rest,

  }
})


        return NextResponse.json({success:true,message:'Successfully Created',listId:newList.id},{status:200,headers: corsHeaders})
        
    } catch (error) {
        console.log(error)
        return NextResponse.json({error:'Internal error'},{status:500,headers: corsHeaders})
    }


}