import { getServerSession } from "next-auth"
import prisma from "./db"
import { authOptions } from "@/app/api/auth/[...nextauth]/options"
import { Company, Entity } from "@prisma/client"






export const getCurrentCompany = async() =>{

    const session = await getServerSession(authOptions)
    if(!session?.user?.email || !session) throw new Error('auth')

    if(session?.user?.name === "Company"){
        const company = await prisma.company.findUnique({
            where:{
                email:session?.user?.email ,
                isActive:true
            }
        })
    
        if(!company) return null
        return company 
    }

    if(session?.user?.name === "Entity"){


        const entity = await prisma.entity.findUnique({
            where:{
                email:session?.user?.email ,
                isActive:true
            },
            include:{
                company:true
            }
        })
    
        if(!entity) return null
        return entity 
    }

  

   

}