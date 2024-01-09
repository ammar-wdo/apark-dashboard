import prisma from "@/lib/db";
import { NextResponse } from "next/server";



export const GET = async(req:Request)=>{

    try {


        const entities = await prisma.entity.findMany({
            include:{
                airport:{
                    select:{
                        slug:true
                    }
                }
            }
        })

        return NextResponse.json({entities},{status:200})
        
    } catch (error) {
        console.log(error)
        return NextResponse.json({error:'internal error'},{status:500})
    }
}