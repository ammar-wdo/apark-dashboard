import { NextResponse } from "next/server";
import { sendMail } from "../webhook/(helpers)/send-email";
import { contactSchema } from "@/schemas";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
  }

export async function POST(req:Request){
console.log('contact')
    try {
        const values = await req.json()
        const validValues = contactSchema.safeParse(values)
        if(!validValues.success){
            return NextResponse.json({error:validValues.error},{status:500})
        }

        await sendMail(validValues.data.email,validValues.data.message,"ammar@wdodigital.com","Ammar")
        return NextResponse.json({message:'success'},{status:200})


    } catch (error) {
        console.log(error)

        return NextResponse.json({error:'internal error'},{status:500})
    }

}