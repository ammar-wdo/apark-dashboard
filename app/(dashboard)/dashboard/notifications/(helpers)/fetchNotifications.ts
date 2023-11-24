import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import prisma from "@/lib/db";
import { getCurrentCompany } from "@/lib/helpers";
import { getServerSession } from "next-auth";

export async function fetchNotifications(){


    try {
        
        const session = await getServerSession(authOptions)
        const currentCompany = await getCurrentCompany()
    
        let notifications
    
        if(session?.user?.name==="Company"){
            notifications = await prisma.notification.findMany({
                where:{
                    entity:{companyId:currentCompany?.id}
                },orderBy:{
                    createdAt:"desc"
                }
            })
        }else{
            notifications = await prisma.notification.findMany({
                where:{
                    entityId:currentCompany?.id
                },orderBy:{
                    createdAt:'desc'
                }
            })
        }
    
        return notifications

    } catch (error) {
        console.log("fetch notifications error",error)
        return []
    }

   
}