'use client'

import { useModal } from "@/hooks/use-modal"
import { handleTimezone } from "@/lib/timezone-handler"
import { availabilitySchema } from "@/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { useParams, useRouter } from "next/navigation"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"





export const useAvailability =()=>{

  const params = useParams()
    useEffect(()=>{
        form.setValue('serviceId',params.serviceId as string)
    },[])

const {setClose}= useModal()
    const form = useForm<z.infer<typeof availabilitySchema>>({
        resolver: zodResolver(availabilitySchema),
        defaultValues: {
          startDate:new Date(Date.now()),
          endDate:new Date(Date.now()),
          label:""
        },
      })

      const router = useRouter()

     

     async function onSubmit(values: z.infer<typeof availabilitySchema>) {
         


const {startDateString,endDateString} = handleTimezone(values.startDate,values.endDate)
      
      const refinedValues = {...values,startDate:startDateString,endDate:endDateString}

   
      try {

        await axios.post(`/api/service/${params.serviceId}/availability`,refinedValues)
        toast.success('Successfull created')
        router.refresh()
        setClose()
        
      } catch (error) {
        console.log(error)
        toast.error('Something went wrong')
      }
    
      }



      return {form,onSubmit}

}