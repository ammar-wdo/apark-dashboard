import prisma from "@/lib/db";
import { combineDateAndTimeToUTC } from "@/lib/utils";
import { listSchema } from "@/schemas";
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
  { params }: { params: { productId: string } }
) => {
  if (!params.productId)
    return NextResponse.json(
      { success: false, error: "product Id is required" },
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
    if (!body.pricings)
      return NextResponse.json(
        { success: false, error: "pricings is required" },
        { status: 400, headers: corsHeaders }
      );

      if(!body.endDate || !body.startDate) return NextResponse.json(
        { error: "start date and end date are required" },
        { status: 500, headers: corsHeaders }
      )

    const service = await prisma.service.findUnique({
      where: {
        id: params.productId,
      },
    });

    if (!service)
      return NextResponse.json(
        { success: false, error: "Service does not exist" },
        { status: 400, headers: corsHeaders }
      );

    const updated = await prisma.service.update({
      where: {
        id: params.productId,
      },
      data: {
        pricings: body.pricings,
      },
    });

    return NextResponse.json(
      { success: true, message: "Successfully Updated" },
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

export const POST = async (
  req: Request,
  { params }: { params: { productId: string } }
) => {
  if (!params.productId)
    return NextResponse.json(
      { success: false, error: "product Id is required" },
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

    const service = await prisma.service.findUnique({
      where: {
        id: params.productId,
      },
    });

    if (!service)
      return NextResponse.json(
        { success: false, error: "Service does not exist" },
        { status: 400, headers: corsHeaders }
      );

    const { endDate, startDate, ...rest } = validBody.data;

   

    const fullStartDate = combineDateAndTimeToUTC(body.startDate, "00:00");
    const fullEndDate = combineDateAndTimeToUTC(body.endDate, "23:45");
    const overlapedDate = await prisma.list.findMany({
      where: {
        serviceId: params.productId,

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

    const newList = await prisma.list.create({
      data: {
        serviceId: params.productId,
        startDate: fullStartDate,
        endDate: fullEndDate,
        ...rest,
      },
    });

    return NextResponse.json(
      { success: true, message: "Successfully Created", listId: newList.id },
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
