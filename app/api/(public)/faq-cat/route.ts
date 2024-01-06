import prisma from "@/lib/db"
import { NextResponse } from "next/server"

export const GET = async (req:Request) =>{



    try {


        const faqCat = await prisma.categoryFAQ.findMany({
            orderBy:{createdAt:'desc'}
        })


        return NextResponse.json({faqCat},{status:200})
        
    } catch (error) {
        console.log(error)

        return NextResponse.json({message:'Internal error'},{status:500})
    }


}