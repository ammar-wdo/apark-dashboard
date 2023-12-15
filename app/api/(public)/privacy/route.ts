import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export const revalidate = 0

export const GET = async(req:Request)=>{

    try {


        const privacy = await prisma.privacy.findUnique({
            where:{
                id:'privacy'
            }
        })

        return NextResponse.json({privacy},{status:200})
        
    } catch (error) {
        console.log(error)

        return NextResponse.json({error:'Internal error'},{status:500})
    }
}