import prisma from "@/lib/db";
import { NextResponse } from "next/server";



export async function GET(req:Request,{params}:{params:{entityId:string}}){


    try {
        console

        const entityId = params.entityId
        if(!entityId) return NextResponse.json({error:"entity Id is required"},{status:400})

        const data = await prisma.service.findMany({
            where:{
                entityId,
                isActive:true
            },include:{
                entity:{
                    select:{entityName:true,slug:true,airport:{select:{name:true,slug:true}}}
                  },
                  reviews:{
                    where:{
                        status:'ACTIVE'
                    },select:{id:true,rate:true}
                  }
            }
        })

        const services = data.map((service)=>{
            let totalReviews = 0
            if(service.reviews.length){
              const  totalRate = service.reviews.reduce((total,val)=>total+val.rate,0)
              totalReviews = totalRate / service.reviews.length
            }

            const {reviews,...pureService} = service
            return ({...pureService,totalReviews})
        })

        return NextResponse.json({services},{status:200})

    } catch (error) {
        console.log(error)
        return NextResponse.json({error:'internal error'},{status:500})
    }

}