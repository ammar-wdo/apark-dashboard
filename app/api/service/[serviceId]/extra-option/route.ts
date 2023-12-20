
import { authOptions } from "@/app/api/auth/[...nextauth]/options"
import prisma from "@/lib/db"
import { extraSchema } from "@/schemas"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

export const POST = async (req:Request,{params}:{params:{serviceId:string}})=>{

    try {

console.log("extra")
        const session = await getServerSession(authOptions)

        if(!session) return NextResponse.json({error:'Unauthorized'},{status:401})

        const serviceId = params.serviceId
        if(!serviceId) return NextResponse.json({error:'service id is required'},{status:400})

        const body = await req.json()

        const refinedBody = extraSchema.safeParse(body)
        if(!refinedBody.success) return NextResponse.json({error:refinedBody.error},{status:400})

        const extraOption = await prisma.exraOption.create({
            data:{
                serviceId,
                ...refinedBody.data
            }
        })

        return NextResponse.json({message:'success'},{status:201})

        
    } catch (error) {
        console.log(error)
        return NextResponse.json({error:'internal error'},{status:500})
    }
}
