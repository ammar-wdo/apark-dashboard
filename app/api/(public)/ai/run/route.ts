import { NextRequest, NextResponse } from "next/server"
import OpenAI from 'OpenAI'




export const GET = async(req:NextRequest)=>{

    const openai = new OpenAI()

    const searchParams = req.nextUrl.searchParams

    const threadId = searchParams.get('threadId')



    if(!threadId ) return NextResponse.json({success:false,error:'thread Id and Message are required'},{status:200})

    try {

        const run = await openai.beta.threads.runs.create(
            threadId,
            { assistant_id: "asst_k6cOSpHWjvrhR76ptKGP4QHz",tools:[{"type": "file_search"} ]},
            
          );

        return NextResponse.json({success:true,run},{status:200})
        
    } catch (error) {
        console.log(error)
        return NextResponse.json({success:false,error:'Internal server error'},{status:200})
    }
}