'use client'

import { useModal } from "@/hooks/use-modal"
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
         
const startDate = new Date(values.startDate);
const endDate = new Date(values.endDate);

const timezoneOffsetStart = startDate.getTimezoneOffset() * 60000; // Convert minutes to milliseconds
const timezoneOffsetEnd = endDate.getTimezoneOffset() * 60000; // Convert minutes to milliseconds

const adjustedStartDate = new Date(startDate.getTime() - timezoneOffsetStart);
const adjustedEndDate = new Date(endDate.getTime() - timezoneOffsetEnd);

const startDateString = adjustedStartDate.toISOString().split('T')[0];
const endDateString = adjustedEndDate.toISOString().split('T')[0];
      
      const refinedValues = {...values,startDate:startDateString,endDate:endDateString}

      console.log(refinedValues)
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