import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { Company } from "@prisma/client";
import { NextResponse } from "next/server";


export async function POST(req:Request){

try {
    const {userId:authId} = auth()

    if(!authId) return new NextResponse('Unauthenticated',{status:401})

    const {userId,userEmail,address,contact,invoiceEmail,phone,place,zipcode} = await req.json()

    if(!userId) return new NextResponse('user ID is required',{status:404})
    if(!userEmail) return new NextResponse('email is required',{status:404})
    if(!address) return new NextResponse('address is required',{status:404})
    if(!contact) return new NextResponse('contact is  required',{status:404})
    if(!invoiceEmail) return new NextResponse('invoice mail is  required',{status:404})
    if(!phone) return new NextResponse('phone is  required',{status:404})
    if(!place) return new NextResponse('place is  required',{status:404})
    if(!zipcode) return new NextResponse('zipcode is  required',{status:404})

    const company = await prisma.company.create({
        data:{
            userId,
            address,
            email:userEmail,
            contact,
            invoiceEmail,
            place,
            phone,
            zipcode
        }
    })

    return NextResponse.json(company)
   


} catch (error) {
    console.log('CREATE_COMPANY',error)
    return new NextResponse('internal error ',{status:500})
    
}
   
    

}