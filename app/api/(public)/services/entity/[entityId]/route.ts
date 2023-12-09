import prisma from "@/lib/db";
import { NextResponse } from "next/server";



export async function GET(req:Request,{params}:{params:{entityId:string}}){


    try {
        console

        const entityId = params.entityId
        if(!entityId) return NextResponse.json({error:"entity Id is required"},{status:400})

        const services = await prisma.service.findMany({
            where:{
                entityId
            },include:{
                entity:{
                    select:{entityName:true,airport:{select:{name:true}}}
                  },
            }
        })

        return NextResponse.json({services},{status:200})

    } catch (error) {
        console.log(error)
        return NextResponse.json({error:'internal error'},{status:500})
    }

}