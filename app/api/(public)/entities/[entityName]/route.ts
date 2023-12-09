import prisma from "@/lib/db";
import { NextResponse } from "next/server";


export async function GET(req:Request,{params}:{params:{entityName:string}}){
console.log('done')

    try {
const entityName = params.entityName
console.log("entityName",entityName)

if(!entityName) return NextResponse.json({error:'entity name is required'},{status:400})


const entity =await  prisma.entity.findFirst({
    where:{
        entityName,
        isActive:true
    },
    include:{
        airport:{
            select:{name:true}
        }
    }
})
console.log(entity)
return NextResponse.json({entity},{status:200})
        
        
    } catch (error) {
        console.log(error)
        return NextResponse.json({error:"internal error"},{status:500})
    }


}