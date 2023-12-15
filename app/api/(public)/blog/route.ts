import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
export const GET = async (req:NextRequest)=>{
    try {
        
const searchParams = req.nextUrl.searchParams
const category = searchParams.get('category')

const blogs = await prisma.blog.findMany({
    where:{
        ...(category && {category:{label:category}})
    },orderBy:{createdAt:'desc'},include:{category:{select:{label:true}}}
})

return NextResponse.json({blogs},{status:200})

    } catch (error) {
        console.log(error)
        return NextResponse.json({error:'internal error'},{status:500})
    }
}