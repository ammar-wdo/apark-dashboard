import prisma from "@/lib/db";
import { combineDateAndTimeToUTC } from "@/lib/utils";
import { availabilitySchema, listSchema } from "@/schemas";
import { NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export const PATCH = async (
  req: Request,
  { params }: { params: { productId: string; listId: string } }
) => {
  if (!params.productId)
    return NextResponse.json(
      { success: false, error: "productId is requred" },
      { status: 400, headers: corsHeaders }
    );
  if (!params.listId)
    return NextResponse.json(
      { success: false, error: "List Id is requred" },
      { status: 400, headers: corsHeaders }
    );

  try {
    const apiKey = req.headers.get("x-api-key");

    if (apiKey !== "PV+AIRVrjpu+r2k5M9rCPH62hOLYvrLjwo399Sc+b0I") {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401, headers: corsHeaders }
      );
    }

    const body = await req.json();
    console.log(body);

    if(!body.endDate || !body.startDate) return NextResponse.json(
      { error: "start date and end date are required" },
      { status: 500, headers: corsHeaders }
    )

    const validBody = listSchema.safeParse(body);
    if (!validBody.success)
      return NextResponse.json(
        { success: false, error: "Invalid Inputs" },
        { status: 400, headers: corsHeaders }
      );

    const { endDate, startDate, ...rest } = validBody.data;

    const fullStartDate = combineDateAndTimeToUTC(body.startDate, "00:00");
    const fullEndDate = combineDateAndTimeToUTC(body.endDate, "23:45");

    const list = await prisma.list.findUnique({
      where: {
        id: params.listId,
      },
    });

    if (!list)
      return NextResponse.json(
        { success: false, error: "List does not exist" },
        { status: 400, headers: corsHeaders }
      );
    if (list.serviceId !== params.productId)
      return NextResponse.json(
        { success: false, error: "List belongs to an other service" },
        { status: 400, headers: corsHeaders }
      );

    const overlapedDate = await prisma.list.findMany({
      where: {
        serviceId: params.productId,
        id: { not: params.listId },

        startDate: {
          lte: fullEndDate,
        },

        endDate: {
          gte: fullStartDate,
        },
      },
    });

    if (!!overlapedDate.length)
      return NextResponse.json(
        { success: false, error: "Date range overlapes with an other list" },
        { status: 400, headers: corsHeaders }
      );

    const updated = await prisma.list.update({
      where: {
        id: params.listId,
      },
      data: {
        startDate: fullStartDate,
        endDate: fullEndDate,
        ...rest,
      },
    });

    return NextResponse.json(
      {
        success: true,
        listId: updated.id,
        message: "successfully updated",
      },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500, headers: corsHeaders }
    );
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: { productId: string; listId: string } }
) => {
  if (!params.productId)
    return NextResponse.json(
      { success: false, error: "ProductId is requred" },
      { status: 400, headers: corsHeaders }
    );
  if (!params.listId)
    return NextResponse.json(
      { success: false, error: "List Id is requred" },
      { status: 400, headers: corsHeaders }
    );

  try {
    const apiKey = req.headers.get("x-api-key");

    if (apiKey !== "PV+AIRVrjpu+r2k5M9rCPH62hOLYvrLjwo399Sc+b0I") {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401, headers: corsHeaders }
      );
    }

    const list = await prisma.list.findUnique({
      where: {
        id: params.listId,
      },
    });

    if (!list)
      return NextResponse.json(
        { success: false, error: "List does not exist" },
        { status: 400, headers: corsHeaders }
      );
    if (list.serviceId !== params.productId)
      return NextResponse.json(
        { success: false, error: "List belongs to an other service" },
        { status: 400, headers: corsHeaders }
      );

    await prisma.list.delete({
      where: {
        id: params.listId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        listId: list.id,
        message: "successfully deleted",
      },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500, headers: corsHeaders }
    );
  }
};
