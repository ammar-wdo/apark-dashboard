
import prisma from "@/lib/db";
import { getCurrentCompany } from "@/lib/helpers";
import { rulesSchema } from "@/schemas";
import { NextResponse } from "next/server";



export async function POST(req:Request){


    try {
const company = await getCurrentCompany()

if(!company) return new NextResponse('Unauthenticated',{status:401})

const body = await req.json()
body.startDate=new Date(body.startDate)
body.endDate=new Date(body.endDate)
console.log(body)
const validBody = rulesSchema.safeParse(body)
if(!validBody.success) return NextResponse.json(validBody.error,{status:400})


await prisma.rule.create({
    data:{
  ...validBody.data
    }
})


return NextResponse.json({message:'Success'},{status:201})


        
    } catch (error) {
        console.log('rule post error',error)
        return new NextResponse('internal error',{status:500})
    }

}