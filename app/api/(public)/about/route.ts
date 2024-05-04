import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export const revalidate = 0

export const GET = async(req:Request)=>{

    try {


        const about = await prisma.about.findUnique({
            where:{
                id:'about',

            }
        })

        return NextResponse.json({success:true,about},{status:200})
        
    } catch (error) {
        console.log(error)

        return NextResponse.json({success:false,error:'Internal error'},{status:200})
    }
}