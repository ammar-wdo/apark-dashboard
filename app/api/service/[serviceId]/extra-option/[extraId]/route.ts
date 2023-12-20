import { findBlockingDates } from "@/app/api/(public)/services/(helpers)/findBlockingDates";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import prisma from "@/lib/db";
import { getCurrentCompany } from "@/lib/helpers";
import { extraSchema, rulesSchema } from "@/schemas";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { extraId: string; serviceId: string } }
) {
  try {
    console.log('extra')
    const company = await getCurrentCompany();
    if (!company) return new NextResponse("Unauthenticated", { status: 401 });

    const { serviceId, extraId } = params;
    if (!serviceId || !extraId)
      return new NextResponse("serviceId and extra option id are required", {
        status: 400,
      });

      const session = await getServerSession(authOptions)

      if(session?.user?.name==="Company"){
        await prisma.service.update({
          where: {
            entity:{companyId:company.id},
            id: params.serviceId,
          },
          data: {
            extraOptions: {
              delete: {
                id: extraId,
              },
            },
          },
        });
      }else{
        await prisma.service.update({
          where: {
            entityId:company.id,
            id: params.serviceId,
          },
          data: {
            extraOptions: {
              delete: {
                id: extraId,
              },
            },
          },
        });
      }

   

    return NextResponse.json({ message: "success" }, { status: 200 });
  } catch (error) {
    console.log("extra option delete error", error);
    return new NextResponse("internal error", { status: 500 });
  }
}


export async function PATCH(
  req: Request,
  { params }: { params: { extraId: string; serviceId: string } }
) {

 
  try {
    const company = await getCurrentCompany();
    if (!company) return new NextResponse("Unauthenticated", { status: 401 });

    const { serviceId, extraId } = params;
    if (!serviceId || !extraId)
      return new NextResponse("serviceId and extra option  id are required", {
        status: 400,
      });
console.log(serviceId)
    const body = await req.json();

    const validBody = extraSchema.safeParse(body);
    if (!validBody.success)
      return NextResponse.json(validBody.error, { status: 400 });

     






const session = await getServerSession(authOptions)

if(session?.user?.name === "Company"){
  await prisma.service.update({
    where: {
      entity:{companyId:company.id},
      id: params.serviceId,
    },
    data: {
      extraOptions: {
        update: {
          where:{
              id:extraId
          },data:{
              ...validBody.data,
              
          }
        },
      },
    },
  });
}else{
  await prisma.service.update({
    where: {
      entityId:company.id,
      id: params.serviceId,
    },
    data: {
      extraOptions: {
        update: {
          where:{
              id:extraId
          },data:{
              ...validBody.data,
              
          }
        },
      },
    },
  });
}



    return NextResponse.json({ message: "success" }, { status: 200 });
  } catch (error) {
    console.log("extra delete error", error);
    return new NextResponse("internal error", { status: 500 });
  }
}
