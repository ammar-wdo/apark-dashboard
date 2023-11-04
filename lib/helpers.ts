import prisma from "./db"






export const getCurrentCompany = async(userId:string)=>{

    const company = await prisma.company.findUnique({
        where:{
            userId
        }
    })

    if(!company) return null

    return company

}