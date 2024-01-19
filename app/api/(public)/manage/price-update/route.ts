import { NextResponse } from "next/server";


export const POST = async (req:Request) =>{
    try {

        const body = await req.json()

        console.log(body)

        return NextResponse.json({success:'request done'},{status:201})
        
    } catch (error) {
        console.log(error)
        return NextResponse.json({error:'Internal error'},{status:500})
    }
}