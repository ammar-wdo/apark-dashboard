import prisma from "@/lib/db";
import { getCurrentCompany } from "@/lib/helpers";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { companyId: string; serviceId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("not loggedin", { status: 401 });

    const currentCompany = await getCurrentCompany(userId);
    if (!currentCompany)
      return new NextResponse("Unauthenticated", { status: 401 });

    const {
      address,
      arrivalTodos,
      city,
      departureTodos,
      description,
      distanceToAirport,
      facilities,
      importantInfo,
      latitude,
      logo,
      longitude,
      parkingType,
      timeToAirport,
      title,
      zipcode,
      images,
      isActive,
      spots
    } = await req.json();

    if (!address)
      return new NextResponse("address is required", { status: 400 });
    if (!city) return new NextResponse("city is required", { status: 400 });
    if (!description)
      return new NextResponse("description is required", { status: 400 });
    if (facilities.length === 0)
      return new NextResponse("facilities are required", { status: 400 });
    if (!logo) return new NextResponse("logo is required", { status: 400 });
    if (!latitude || !longitude)
      return new NextResponse("latitude and longitude are required", {
        status: 400,
      });
    if (!parkingType)
      return new NextResponse("parkingtype is required", { status: 400 });
    if (!title)
      return new NextResponse("parkingtype is required", { status: 400 });
    if (!zipcode)
      return new NextResponse("parkingtype is required", { status: 400 });

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
        companyId: currentCompany.id,
        address,
        arrivalTodos,
        city,
        departureTodos,
        description,
        distanceToAirport,
        facilities,
        importantInfo,
        latitude,
        logo,
        longitude,
        parkingType,
        timeToAirport,
        title,
        zipcode,
        images,
        isActive,
        spots :Number(spots)
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

        const { userId } = auth();
        if (!userId) return new NextResponse("not loggedin", { status: 401 });
    
        const currentCompany = await getCurrentCompany(userId);
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
