'use client'

import { useModal } from "@/hooks/use-modal"
import { availabilitySchema, rulesSchema } from "@/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { Rule } from "@prisma/client"
import axios from "axios"
import { useParams, useRouter } from "next/navigation"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import {format,parse} from 'date-fns'
import { handleTimezone } from "@/lib/timezone-handler"




type Props = {

}
export const useRules =()=>{

  const {data} = useModal()
  const {setClose}= useModal()
    const form = useForm<z.infer<typeof rulesSchema>>({
        resolver: zodResolver(rulesSchema),
        defaultValues: {
          startDate:data.rule ? new Date(data.rule.startDate) : new Date(Date.now()),
          endDate:data.rule ? new Date(data.rule.endDate) :new Date(Date.now()),
          label:data.rule?.label || "",
          action:data.rule?.action || "TOTAL",
          type:data.rule?.type || "FIXED",
          percentage:data.rule?.percentage || 0,
          value:data.rule?.value || 0
        },
      })

  const params = useParams()

    useEffect(()=>{
        form.setValue('serviceId',params.serviceId as string)
    },[])


    useEffect(()=>{
      if(form.watch('type')==="FIXED"){
        form.setValue('percentage',0)
      }else{
        form.setValue('value',0)
      }
    },[form.watch('type')])



      const router = useRouter()

     

     async function onSubmit(values: z.infer<typeof availabilitySchema>) {
   
// const startDate = new Date(values.startDate);
// const endDate = new Date(values.endDate);

// const timezoneOffsetStart = startDate.getTimezoneOffset() * 60000; // Convert minutes to milliseconds
// const timezoneOffsetEnd = endDate.getTimezoneOffset() * 60000; // Convert minutes to milliseconds

// const adjustedStartDate = new Date(startDate.getTime() - timezoneOffsetStart);
// const adjustedEndDate = new Date(endDate.getTime() - timezoneOffsetEnd);

// const startDateString = adjustedStartDate.toISOString().split('T')[0];
// const endDateString = adjustedEndDate.toISOString().split('T')[0];

const {startDateString,endDateString} = handleTimezone(values.startDate,values.endDate)
      
      const refinedValues = {...values,startDate:startDateString,endDate:endDateString}

      console.log(refinedValues)
      try {
let res;
if(!data.rule){
res=  await axios.post(`/api/service/${params.serviceId}/rules`,refinedValues)
}else{
 res= await axios.patch(`/api/service/${params.serviceId}/rules/${data.rule.id}`,refinedValues)
}
      
        toast.success(!data.rule ? 'Successfull created' : 'Successfully updated')
        router.refresh()
        setClose()
        
      } catch (error:any) {
        console.log(error)
        
        toast.error(error?.response?.data?.customError ?error?.response?.data?.customError : 'Something went wrong')
      }
    
      }



      return {form,onSubmit}

}