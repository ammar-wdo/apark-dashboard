import { NextResponse } from "next/server";
import { z } from "zod";


const bodySchema = z.object({
    key:z.literal('the-secret-key'),
    prices:z.array(z.coerce.number())
})

export const POST = async (req:Request) =>{
    try {

        const body = await req.json()

       const validBody = bodySchema.parse(body)


        return NextResponse.json({key:validBody.key,prices:validBody.prices},{status:201})
        
    } catch (error) {
        console.log(error)
        return NextResponse.json({error:'Internal error'},{status:500})
    }
}