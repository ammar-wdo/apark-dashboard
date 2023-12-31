import { findBlockingDates } from "@/app/api/(public)/services/(helpers)/findBlockingDates";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import prisma from "@/lib/db";
import { getCurrentCompany } from "@/lib/helpers";
import { rulesSchema } from "@/schemas";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { ruleId: string; serviceId: string } }
) {
  try {
    const company = await getCurrentCompany();
    if (!company) return new NextResponse("Unauthenticated", { status: 401 });

    const { serviceId, ruleId } = params;
    if (!serviceId || !ruleId)
      return new NextResponse("serviceId and availability id are required", {
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
            rules: {
              delete: {
                id: ruleId,
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
            rules: {
              delete: {
                id: ruleId,
              },
            },
          },
        });
      }

   

    return NextResponse.json({ message: "success" }, { status: 200 });
  } catch (error) {
    console.log("rules delete error", error);
    return new NextResponse("internal error", { status: 500 });
  }
}


export async function PATCH(
  req: Request,
  { params }: { params: { ruleId: string; serviceId: string } }
) {

 
  try {
    const company = await getCurrentCompany();
    if (!company) return new NextResponse("Unauthenticated", { status: 401 });

    const { serviceId, ruleId } = params;
    if (!serviceId || !ruleId)
      return new NextResponse("serviceId and rule id are required", {
        status: 400,
      });
console.log(serviceId)
    const body = await req.json();
    console.log(body)

    const refinedBody = {...body,startDate:new Date(body.startDate),endDate:new Date(body.endDate)}
    
    console.log(refinedBody)
    const validBody = rulesSchema.safeParse(refinedBody);
    if (!validBody.success)
      return NextResponse.json(validBody.error, { status: 400 });

      const {serviceId:anything,...requiredDate} = validBody.data




const rules = await prisma.rule.findMany({
  where:{
      serviceId:params.serviceId,
      id:{not:ruleId}
  }
})


const isBlocked = findBlockingDates(rules,validBody.data.startDate,validBody.data.endDate)

if(!!isBlocked.length)  return NextResponse.json({customError:"can't add rules at the same date ranges"},{status:400})

const session = await getServerSession(authOptions)

if(session?.user?.name === "Company"){
  await prisma.service.update({
    where: {
      entity:{companyId:company.id},
      id: params.serviceId,
    },
    data: {
      rules: {
        update: {
          where:{
              id:ruleId
          },data:{
              ...requiredDate,
              endDate:new Date(validBody.data.endDate.setHours(23,45,0,0))
              
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
      rules: {
        update: {
          where:{
              id:ruleId
          },data:{
              ...requiredDate,
              endDate:new Date(validBody.data.endDate.setHours(23,45,0,0))
              
          }
        },
      },
    },
  });
}



    return NextResponse.json({ message: "success" }, { status: 200 });
  } catch (error) {
    console.log("rules delete error", error);
    return new NextResponse("internal error", { status: 500 });
  }
}
