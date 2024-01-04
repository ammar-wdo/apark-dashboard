import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";



export const revalidate = 0

export const GET = async (req:NextRequest)=>{
    try {
        
const searchParams = req.nextUrl.searchParams


const categories = await prisma.category.findMany({
    orderBy:{createdAt:'desc'}
})

return NextResponse.json({categories},{status:200})

    } catch (error) {
        console.log(error)
        return NextResponse.json({error:'internal error'},{status:500})
    }
}