import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import { getCurrentCompany } from "@/lib/helpers";
import prisma from "@/lib/db";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const company = await getCurrentCompany();

    let notifications;

    if (session?.user?.name === "Company") {
      notifications = await prisma.notification.count({
        where: {
          entity: { companyId: company?.id },
          isRead: false,
        },
      });
    } else {
      notifications = await prisma.notification.count({
        where: { entityId: company?.id, isRead: false },
      });
    }

    return NextResponse.json({count:notifications},{status:200})
  } catch (error) {
    console.log(error);
    return new NextResponse("internal error", { status: 500 });
  }
}
