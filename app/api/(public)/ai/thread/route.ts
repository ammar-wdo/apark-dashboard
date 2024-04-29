// import { NextResponse } from "next/server"
// import OpenAI from 'OpenAI'




// export const GET = async()=>{

//     const openai = new OpenAI()

//     try {

//         const thread = await openai.beta.threads.create();

//         return NextResponse.json({success:true,thread},{status:200})
        
//     } catch (error) {
//         console.log(error)
//         return NextResponse.json({success:false,error:'Internal server error'},{status:200})
//     }
// }