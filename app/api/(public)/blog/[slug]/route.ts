import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export const revalidate = 0
export const GET = async(req:Request,{params}:{params:{slug:string}})=>{
    try {

const slug = params.slug
if(!slug) return NextResponse.json({error:"slug is reuired"},{status:400})

const blog = await prisma.blog.findUnique({
    where:{
        slug
    }
})

return NextResponse.json({blog},{status:200})

        
    } catch (error) {
        console.log(error)
        return NextResponse.json({error:'Internal error'},{status:500})
    }
}