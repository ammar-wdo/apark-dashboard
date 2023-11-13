import prisma from "@/lib/db";
import { getCurrentCompany } from "@/lib/helpers";
import { NextResponse } from "next/server";

export async function DELETE(req:Request,{params}:{params:{availabilityId:string,serviceId:string}}){

    try {
console.log('delete')
console.log('delete')
console.log('delete')
console.log('delete')
        const company = await getCurrentCompany()
        if(!company) return new NextResponse("Unauthenticated",{status:401})

        const {serviceId,availabilityId} = params
        if(!serviceId || !availabilityId) return new NextResponse('serviceId and availability id are required',{status:400})

 console.log(serviceId,availabilityId,company.id)
        await prisma.service.update({
            where:{
                companyId:company.id,
                id:params.serviceId
                

            },data:{
                availability:{
                    delete:{
                        id:availabilityId
                    }
                }

            }
        })

        return NextResponse.json({message:'success'},{status:200})
        
    } catch (error) {
        console.log("availability delete error",error)
        return new NextResponse('internal error',{status:500})
    }
}