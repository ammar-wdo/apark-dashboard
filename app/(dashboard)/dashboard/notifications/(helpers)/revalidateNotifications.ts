import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import prisma from "@/lib/db";
import { getCurrentCompany } from "@/lib/helpers";
import { getServerSession } from "next-auth";

export async function revalidateNotifications () {


    try {
        const session = await getServerSession(authOptions)
        const currentCompany = await getCurrentCompany()
    
    
        if(session?.user?.name==="Company"){
    await prisma.notification.updateMany({
        where:{
           companyId:currentCompany?.id
            
        },data:{
            isRead:true
        }
    })
        }else{
            await prisma.notification.updateMany({
                where:{
                    entityId:currentCompany?.id
                    
                },data:{
                    isRead:true
                }
            })
        }
    } catch (error) {
        console.log("revalidate notifications error",error)
    }

}