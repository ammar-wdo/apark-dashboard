import prisma from "@/lib/db";
import { getCurrentCompany } from "@/lib/helpers";
import { serviceSchema } from "@/schemas";

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
 


    const currentCompany = await getCurrentCompany()
    if (!currentCompany)
      return new NextResponse("Unauthenticated", { status: 401 });

    const body = await req.json();


   const validBody = serviceSchema.safeParse(body)
   if(!validBody.success) return NextResponse.json({message:validBody.error},{status:400})

   const service = await prisma.company.update({
    where:{
      id:currentCompany.id
    },
    data:{
      services:{
        create:{
          ...validBody.data
        }
      }
    }
   })

    // TODO inform users if service has lower price

    return NextResponse.json(service);
  } catch (error) {
    console.log("SERVICE_POST_ERROR", error);
    return new NextResponse("internal error", { status: 500 });
  }
}
