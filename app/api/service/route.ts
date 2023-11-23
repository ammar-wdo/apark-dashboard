import prisma from "@/lib/db";
import { getCurrentCompany } from "@/lib/helpers";
import { serviceSchema } from "@/schemas";
import { getServerSession } from "next-auth";

import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(req: Request) {
  try {
 


    const currentCompany = await getCurrentCompany()
    if (!currentCompany)
      return new NextResponse("Unauthenticated", { status: 401 });

    const body = await req.json();


   const validBody = serviceSchema.safeParse(body)
   if(!validBody.success) return NextResponse.json({message:validBody.error},{status:400})

 

   const session = await getServerSession(authOptions)
   const {entityId,...rest} = validBody.data
   let service

   if(session?.user?.name==="Entity"){
    service = await prisma.entity.update({
      where:{
        id:currentCompany.id
      },
      data:{
        services:{
          create:{
            ...rest,
      
          }
        }
      }
     })
   }else{

    console.log(validBody.data)
    
    service = await prisma.entity.update({
      where:{
        companyId:currentCompany.id,
        id:validBody.data.entityId
      },
      data:{
        services:{
          create:{
          ...rest
          }
        }
      }
    })
   }

   await prisma.notification.create({
    data:{
      isAdmin:true,
      message:'New service has been created and wating for approvement',
      IdHolder:service.id,
      type:'SERVICE',
      
    }
   })

   

    // TODO inform users if service has lower price

    return NextResponse.json(service);
  } catch (error) {
    console.log("SERVICE_POST_ERROR", error);
    return new NextResponse("internal error", { status: 500 });
  }
}
