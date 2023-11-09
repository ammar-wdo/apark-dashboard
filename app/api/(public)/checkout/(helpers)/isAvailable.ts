import prisma from "@/lib/db"


export const isAvailable = async (serviceId:string)=>{
    
try {
    const isValid = await prisma.service.findUnique({
        where:{
            id:serviceId,
            available:true
        }
    })

    if(!isValid) return null

    return true



} catch (error) {
    console.log(error)

    return null
}
  
}