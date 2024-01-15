import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import prisma from "@/lib/db";
import { getCurrentCompany } from "@/lib/helpers";
import { getServerSession } from "next-auth";


export const getBookingsAndCount = async (ITEMS_PER_PAGE:number,page:string | string[] | undefined,bookingCode?:string | undefined)=>{

    const session = await getServerSession(authOptions)
    const company = await getCurrentCompany()


    let bookingsCount
    let bookings
    if(session?.user?.name==="Company"){

      bookingsCount = await prisma.booking.count({
        where:{
            service:{
                entity:{companyId:company?.id}
            }
        }
      });

 
      bookings = await prisma.booking.findMany({
        where: {
          service: {
            entity:{companyId:company?.id},
          },
          ...(bookingCode && {bookingCode})
        },
        include: {
          service: true,
        },
        take: ITEMS_PER_PAGE,
        skip: ITEMS_PER_PAGE * (+page! -1),
        orderBy:{
          createdAt:'desc'
        }
      });

    }else{

      bookingsCount = await prisma.booking.count({
        where:{
            service:{
                entityId:company?.id
            }
        }
      });




       
     bookings = await prisma.booking.findMany({
      where: {
        service: {
          entityId: company?.id,
        },
        ...(bookingCode && {bookingCode})
      },
      include: {
        service: true,
      },
      take: ITEMS_PER_PAGE,
      skip: ITEMS_PER_PAGE * (+page! -1),
      orderBy:{
        createdAt:'desc'
      }
    });
    }


    return {bookingsCount,bookings}
}