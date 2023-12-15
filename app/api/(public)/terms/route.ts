import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export const revalidate = 0

export const GET = async(req:Request)=>{

    try {


        const terms = await prisma.term.findUnique({
            where:{
                id:'term'
            }
        })

        return NextResponse.json({terms},{status:200})
        
    } catch (error) {
        console.log(error)

        return NextResponse.json({error:'Internal error'},{status:500})
    }
}