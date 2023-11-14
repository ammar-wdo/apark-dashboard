import prisma from "@/lib/db";
import { getCurrentCompany } from "@/lib/helpers";
import { rulesSchema } from "@/schemas";
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

    await prisma.service.update({
      where: {
        companyId: company.id,
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
    body.startDate = new Date(body.startDate);
    body.endDate = new Date(body.endDate);
    console.log(body);
    const validBody = rulesSchema.safeParse(body);
    if (!validBody.success)
      return NextResponse.json(validBody.error, { status: 400 });

      const {serviceId:anything,...requiredDate} = validBody.data

    await prisma.service.update({
      where: {
        companyId: company.id,
        id: params.serviceId,
      },
      data: {
        rules: {
          update: {
            where:{
                id:ruleId
            },data:{
                ...requiredDate,
                
            }
          },
        },
      },
    });

    return NextResponse.json({ message: "success" }, { status: 200 });
  } catch (error) {
    console.log("rules delete error", error);
    return new NextResponse("internal error", { status: 500 });
  }
}
