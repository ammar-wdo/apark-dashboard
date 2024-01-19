import { NextResponse } from "next/server";
import { z } from "zod";


const bodySchema = z.object({
  
    prices:z.array(z.coerce.number())
})

export const POST = async (req:Request) =>{
    try {

        const apiKey = req.headers.get('x-api-key');

        // Verify API key
        if (apiKey !== "my key") {
            return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
        }

        const body = await req.json()

       const validBody = bodySchema.parse(body)


        return NextResponse.json({prices:validBody.prices},{status:201})
        
    } catch (error) {
        console.log(error)
        return NextResponse.json({error:'Internal error'},{status:500})
    }
}