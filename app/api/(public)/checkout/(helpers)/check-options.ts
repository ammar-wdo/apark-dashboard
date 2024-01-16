import prisma from "@/lib/db";
import { ExraOption } from "@prisma/client";

export const checkOptions = async (ids:string[] | undefined,theServiceId:string)=>{


        
        let options: ExraOption[] | any[];
        if (ids && ids.length) {
          options = await prisma.exraOption.findMany({
            where: {
              serviceId: theServiceId,
              id: { in: ids as string[] },
            },
            select: {
              label: true,
              id: true,
              price: true,
              commession: true,
            },
          });
        } else {
          options = [];
        }
    
        let priceWithOptions = 0;
        if (!!options.length) {
          priceWithOptions = options.reduce((result, val) => result + val.price, 0);
        }

        return {priceWithOptions,options}

   
}