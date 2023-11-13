'use client'

import { availabilitySchema } from "@/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"


type Props = {
    serviceId:string
}


export const useAvailability =({serviceId}:Props)=>{


    useEffect(()=>{
        form.setValue('serviceId',serviceId)
    },[])


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
      try {

        await axios.post(`/api/service/${serviceId}/availability`,values)
        toast.success('Successfull created')
        router.refresh()
        
      } catch (error) {
        console.log(error)
        toast.error('Something went wrong')
      }
        console.log(values)
      }



      return {form,onSubmit}

}