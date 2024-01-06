import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const revalidate = 0

export const GET = async (req:NextRequest) =>{

    try {
        const searchParams = req.nextUrl.searchParams
        const category = searchParams.get('category')

        const faqs = await prisma.fAQ.findMany({
            where:{
                ...(category && {categoryFaq:{label:category}})
            },

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