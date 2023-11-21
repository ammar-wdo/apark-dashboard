import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import prisma from "@/lib/db";
import { getCurrentCompany } from "@/lib/helpers";
import { getServerSession } from "next-auth";

export const getServices = async (
  searchParams: string,
  companyId: string,
  entityId?: string
) => {
  const session = await getServerSession(authOptions);
  const currentCompany = await getCurrentCompany();
  if (searchParams === "all") {
    let services;

    if (entityId) {
      if (entityId === "all") {
        services = await prisma.service.findMany({
            where:{
                entity:{companyId:currentCompany?.id}
            },  include: {
                bookings: {
                  where: {
                    paymentStatus: "SUCCEEDED",
                  },
                },
              },
        })
      } else {
        services = await prisma.service.findMany({
            where:{
                entityId
            },  include: {
                bookings: {
                  where: {
                    paymentStatus: "SUCCEEDED",
                  },
                },
              },
        })
      }
    } else {
      services = await prisma.service.findMany({
        where: {
          entityId: companyId as string,
        },
        include: {
          bookings: {
            where: {
              paymentStatus: "SUCCEEDED",
            },
          },
        },
      });
    }

    return {
      services,
      bookings: services
        .flatMap((el) => el.bookings.length)
        .reduce((total, val) => total + val, 0),
    };
  } else {
    let services;

    if(session?.user?.name==="Company"){
        services = await prisma.service.findUnique({
            where: {
              entity: {companyId:currentCompany?.id},
              id: searchParams,
            },
            include: {
              bookings: {
                where: {
                  paymentStatus: "SUCCEEDED",
                },
              },
            },
          });
    }else{
        services = await prisma.service.findUnique({
            where: {
              entityId:companyId,
              id: searchParams,
            },
            include: {
              bookings: {
                where: {
                  paymentStatus: "SUCCEEDED",
                },
              },
            },
          });
    }
   

    return { services, bookings: services?.bookings.length };
  }
};
