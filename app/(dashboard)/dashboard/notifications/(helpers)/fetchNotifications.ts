import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import prisma from "@/lib/db";
import { getCurrentCompany } from "@/lib/helpers";
import { getServerSession } from "next-auth";

export async function fetchNotifications(list:string ){


    try {
        
        const session = await getServerSession(authOptions)
        const currentCompany = await getCurrentCompany()
        if (!currentCompany) throw Error("Unauthenticated");
    
        let notifications
    
        if(session?.user?.name==="Company"){
            notifications = await prisma.notification.findMany({
                where:{
                    companyId:currentCompany?.id
                },orderBy:{
                    createdAt:"desc"
                },
                take:12 * +list 
            })
        }else{
            notifications = await prisma.notification.findMany({
                where:{
                    entityId:currentCompany?.id
                },orderBy:{
                    createdAt:'desc'
                },
                take:12 * +list 
            })
        }
  
        return notifications

    } catch (error) {
        console.log("fetch notifications error",error)
        return []
    }

   
}