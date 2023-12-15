import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export const revalidate = 0

export const GET = async (Req:Request) =>{

    try {

        const faqs = await prisma.fAQ.findMany({
            orderBy:{
                createdAt:'desc'
            }
        })

        console.log(faqs)

        return NextResponse.json({faqs},{status:200})
        
    } catch (error) {
        console.log(error)
        return NextResponse.json({error:'internal error'})
    }
}