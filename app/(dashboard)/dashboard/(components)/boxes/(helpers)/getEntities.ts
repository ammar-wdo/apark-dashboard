import prisma from "@/lib/db"
import { getCurrentCompany } from "@/lib/helpers"

export  async function getEntities(entity:string){

const company = await getCurrentCompany()


    let entities



    if(entity==="all"){
        entities = await prisma.entity.findMany({
            where:{
                companyId:company?.id
            }
        })
    }



}