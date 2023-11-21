import prisma from "@/lib/db";
import { getCurrentCompany } from "@/lib/helpers";
import { serviceSchema } from "@/schemas";
import { auth } from "@clerk/nextjs";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function PATCH(
  req: Request,
  { params }: { params: {  serviceId: string } }
) {
  try {
  
 const session = await getServerSession(authOptions)

    const currentCompany = await getCurrentCompany();
    if (!currentCompany)
      return new NextResponse("Unauthenticated", { status: 401 });



    const body= await req.json();

    if(!!body.pricings) {
      try {

        if(session?.user?.name === "Company"){
          await prisma.service.update({
            where:{ id: params.serviceId, entity:{companyId:currentCompany.id} },
            data:{
             pricings: body.pricings
            }
    
          })
        }else{
          await prisma.service.update({
            where:{ id: params.serviceId, entityId: currentCompany.id },
            data:{
             pricings: body.pricings
            }
    
          })
        }
       

        return NextResponse.json({
          message:'success'
        })
      } catch (error) {
        console.log(error)
        return new NextResponse('internal error',{status:500})
      }
    
    }

    const validBody = serviceSchema.safeParse(body)
    console.log(body)
    if(!validBody.success) return  NextResponse.json({error:validBody.error},{status:400})
       
  
     if(session?.user?.name === "Company"){
      await prisma.service.update({
        where: { id: params.serviceId,entity:{companyId:currentCompany.id}},
        data: {
        
          ...validBody.data,
          spots :Number(validBody.data.spots),
         
        },
      });
     }else{
      await prisma.service.update({
        where: { id: params.serviceId,entityId:currentCompany.id},
        data: {
        
          ...validBody.data,
          spots :Number(validBody.data.spots),
         
        },
      });
     }
  
   
  
      // TODO inform users if service has lower price
  
      return NextResponse.json({message:"Success"},{status:201});
  
   
    

  
  } catch (error) {
    console.log("SERVICE_PATCH_ERROR", error);
    return new NextResponse("internal error", { status: 500 });
  }
}


export async function DELETE(req:Request,{params}:{ params: { companyId: string; serviceId: string } }){

    try {

  
    const session = await getServerSession(authOptions)
        const currentCompany = await getCurrentCompany();
        if (!currentCompany)
          return new NextResponse("Unauthenticated", { status: 401 });

          

if(session?.user?.name ==="Company"){
  await prisma.service.delete({
    where:{
      entity:{companyId:currentCompany.id},
        id:params.serviceId,
 
    }
  })
}else{
  await prisma.service.delete({
    where:{
      entityId:currentCompany.id,
        id:params.serviceId,
 
    }
  })
}
      

          return NextResponse.json({message:"success"},{status:201})
        
    } catch (error) {
        console.log("SERVICE_DELETE_ERROR", error);
        return new NextResponse("internal error", { status: 500 });
    }


}
