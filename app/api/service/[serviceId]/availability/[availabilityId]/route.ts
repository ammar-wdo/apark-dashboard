import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import prisma from "@/lib/db";
import { getCurrentCompany } from "@/lib/helpers";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function DELETE(req:Request,{params}:{params:{availabilityId:string,serviceId:string}}){

    try {

        const company = await getCurrentCompany()
        if(!company) return new NextResponse("Unauthenticated",{status:401})

        const {serviceId,availabilityId} = params
        if(!serviceId || !availabilityId) return new NextResponse('serviceId and availability id are required',{status:400})

 console.log(serviceId,availabilityId,company.id)

 const session = await getServerSession(authOptions)
 if(session?.user?.name === "Entity"){
    await prisma.service.update({
        where:{
            entityId:company.id,
            id:params.serviceId
            

        },data:{
            availability:{
                delete:{
                    id:availabilityId
                }
            }

        }
    })
 }else{
    await prisma.service.update({
        where:{
            id:params.serviceId,
            entity:{
                companyId:company.id
            }
        },
        data:{
            availability:{
                delete:{
                    id:availabilityId
                }
            }
        }
    })
 }
      

        return NextResponse.json({message:'success'},{status:200})
        
    } catch (error) {
        console.log("availability delete error",error)
        return new NextResponse('internal error',{status:500})
    }
}