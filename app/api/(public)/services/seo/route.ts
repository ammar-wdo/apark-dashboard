import prisma from "@/lib/db";
import { NextResponse } from "next/server";



export const GET = async(req:Request)=>{

    try {


        const services = await prisma.service.findMany({
            include:{
              entity:{
                select:{
                    slug:true,
                    airport:{
                        select:{
                            slug:true
                        }
                    }
                }
              }
            }
        })

        return NextResponse.json({services},{status:200})
        
    } catch (error) {
        console.log(error)
        return NextResponse.json({error:'internal error'},{status:500})
    }
}