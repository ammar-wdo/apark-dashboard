import prisma from "@/lib/db"

export const getServices = async(searchParams:string,companyId:string)=>{

   
if(searchParams==="all"){
const    services =await prisma.service.findMany({
        where:{
            companyId:companyId as string,
          
        },
        include:{
            bookings:{where:{
                paymentStatus:'SUCCEEDED'
            }}
        }
    })
    return {services,bookings:services.flatMap(el=>el.bookings.length).reduce((total,val)=>total+val,0)}
}else{

  const  services =await prisma.service.findUnique({
        where:{
            companyId:companyId,
            id:searchParams,
       
        },
        include:{
            bookings:{
                where:{
                    paymentStatus:'SUCCEEDED'
                }
            }
        }
    })
    
return {services,bookings:services?.bookings.length}
    
}


}