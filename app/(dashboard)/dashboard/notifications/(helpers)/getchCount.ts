import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import prisma from "@/lib/db";
import { getCurrentCompany } from "@/lib/helpers";
import { getServerSession } from "next-auth";

export async function fetchCount( ){


    try {
        
        const session = await getServerSession(authOptions)
        const currentCompany = await getCurrentCompany()
    
        let count
    
        if(session?.user?.name==="Company"){
            count = await prisma.notification.count({
                where:{
                    companyId:currentCompany?.id
                },
            })
        }else{
            count = await prisma.notification.count({
                where:{
                    entityId:currentCompany?.id
                },
         
            })
        }
  
        return count

    } catch (error) {
        console.log("fetch count error",error)
        return 0
    }

   
}