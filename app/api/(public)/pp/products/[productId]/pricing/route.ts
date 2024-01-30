import { NextResponse } from "next/server";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
  }
  
export const POST = async(req:Request)=>{


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

        return NextResponse.json({message:'Request recieved'},{status:200,headers: corsHeaders})
        
    } catch (error) {
        console.log(error)
        return NextResponse.json({error:'Internal error'},{status:500})
    }


}