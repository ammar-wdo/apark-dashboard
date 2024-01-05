'use client'

import { useModal } from "@/hooks/use-modal"
import { availabilitySchema, rulesSchema } from "@/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { Rule } from "@prisma/client"
import axios from "axios"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
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


const [startOpen, setStartOpen] = useState(false)
const [endOpen, setEndOpen] = useState(false)
    const form = useForm<z.infer<typeof rulesSchema>>({
        resolver: zodResolver(rulesSchema),
        defaultValues: {
          startDate:data.rule ?new Date (new Date(data.rule.startDate).setUTCHours(0,0,0,0)) : new Date(Date.now()),
          endDate:data.rule ? new Date (new Date(data.rule.endDate).setUTCHours(0,0,0,0)) :new Date(Date.now()),
          label:data.rule?.label || "",
         
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
if(form.watch('startDate')){
  setStartOpen(false)
}
    },[form.watch('startDate')])


    useEffect(()=>{
      if(form.watch('endDate')){
        setEndOpen(false)
      }
    },[form.watch('endDate')])


    useEffect(()=>{
      if(form.watch('type')==="FIXED"){
        form.setValue('percentage',0)
      }else{
        form.setValue('value',0)
      }
    },[form.watch('type')])



      const router = useRouter()

     

     async function onSubmit(values: z.infer<typeof availabilitySchema>) {
   


const {startDateString,endDateString} = handleTimezone(values.startDate,values.endDate)
      
      const refinedValues = {...values,startDate:startDateString,endDate:endDateString}

   
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



      return {form,onSubmit,startOpen,endOpen,setStartOpen,setEndOpen}

}