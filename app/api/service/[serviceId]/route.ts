import prisma from "@/lib/db";
import { getCurrentCompany } from "@/lib/helpers";
import { serviceSchema } from "@/schemas";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: {  serviceId: string } }
) {
  try {
  
 

    const currentCompany = await getCurrentCompany();
    if (!currentCompany)
      return new NextResponse("Unauthenticated", { status: 401 });



    const body= await req.json();

    if(!!body.pricings) {
      try {
        await prisma.service.update({
          where:{ id: params.serviceId, companyId: currentCompany.id },
          data:{
           pricings: body.pricings
          }
  
        })

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
       
  
      const service = await prisma.service.findUnique({
        where: {
          id: params.serviceId,
          companyId: currentCompany.id,
        },
      });
  
      if (!service) return new NextResponse("Unauthorized", { status: 404 });
  
      const editedService = await prisma.service.update({
        where: { id: params.serviceId, companyId: currentCompany.id },
        data: {
          companyId:currentCompany.id,
          ...validBody.data,
          spots :Number(validBody.data.spots),
         
        },
      });
  
      // TODO inform users if service has lower price
  
      return NextResponse.json(editedService);
  
   
    

  
  } catch (error) {
    console.log("SERVICE_PATCH_ERROR", error);
    return new NextResponse("internal error", { status: 500 });
  }
}


export async function DELETE(req:Request,{params}:{ params: { companyId: string; serviceId: string } }){

    try {

  
    
        const currentCompany = await getCurrentCompany();
        if (!currentCompany)
          return new NextResponse("Unauthenticated", { status: 401 });

          const service = await prisma.service.findUnique({
            where:{
                id:params.serviceId,
                companyId:currentCompany.id
            }
          })

          if(!service) return new NextResponse('Unauthorized',{status:403})


          const deletedService = await prisma.service.delete({
            where:{
                id:params.serviceId,
                companyId:currentCompany.id
            }
          })

          return NextResponse.json(deletedService)
        
    } catch (error) {
        console.log("SERVICE_DELETE_ERROR", error);
        return new NextResponse("internal error", { status: 500 });
    }


}
