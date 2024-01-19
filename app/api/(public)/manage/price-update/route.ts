import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";

const bodySchema = z.object({
  id: z.string().min(1),
  prices: z.array(z.coerce.number()),
});

export const POST = async (req: Request) => {
  try {
    const apiKey = req.headers.get("x-api-key");

    // Verify API key
    if (apiKey !== "my key") {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const validBody = bodySchema.safeParse(body);
    if (!validBody.success)
      return NextResponse.json({ error: validBody.error }, { status: 400 });

    const serviceId = validBody.data.id;

    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });
    if (!service)
      return NextResponse.json(
        { error: "service does not exist" },
        { status: 400 }
      );

    await prisma.service.update({
      where: { id: serviceId },
      data: { pricings: validBody.data.prices },
    });


return NextResponse.json(null,{status:201})

  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
};
