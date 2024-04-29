// import { NextRequest, NextResponse } from "next/server"
// import OpenAI from 'OpenAI'




// export const GET = async(req:NextRequest)=>{

//     const openai = new OpenAI()

//     const searchParams = req.nextUrl.searchParams

//     const threadId = searchParams.get('threadId')
//     const runId = searchParams.get('runId')



//     if(!threadId || ! runId) return NextResponse.json({success:false,error:'thread Id and runId are required'},{status:200})

//     try {

//         const run = await openai.beta.threads.runs.retrieve(
//             threadId,
//           runId
//           )

//           if(run.status!=='completed'){
//             return NextResponse.json({success:false,error:'Not completed'},{status:200})
//           }

//           const threadMessages = await openai.beta.threads.messages.list(
//            threadId
//           )

          

//         return NextResponse.json({success:true,threadMessages},{status:200})
        
//     } catch (error) {
//         console.log(error)
//         return NextResponse.json({success:false,error:'Internal server error'},{status:200})
//     }
// }