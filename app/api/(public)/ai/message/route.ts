import { NextResponse } from "next/server"
import OpenAI from 'OpenAI'




export const POST = async(req:Request)=>{

    const openai = new OpenAI()

    const {threadId,message} = await req.json()

    if(!threadId || !message) return NextResponse.json({success:false,error:'thread Id and Message are required'},{status:200})

    try {

        const messageThread = await openai.beta.threads.messages.create(
            threadId,
            { role: "user", content: message }
          );

        return NextResponse.json({success:true,messageThread},{status:200})
        
    } catch (error) {
        console.log(error)
        return NextResponse.json({success:false,error:'Internal server error'},{status:200})
    }
}