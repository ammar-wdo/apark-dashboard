import { getServerSession } from "next-auth"
import prisma from "./db"
import { authOptions } from "@/app/api/auth/[...nextauth]/options"






export const getCurrentCompany = async()=>{

    const session = await getServerSession(authOptions)
    if(!session?.user?.email) return null 

    const company = await prisma.company.findUnique({
        where:{
            email:session?.user?.email 
        }
    })

    if(!company) return null

    return company

}