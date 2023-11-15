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
      try {
console.log(values)
        await axios.post(`/api/service/${params.serviceId}/availability`,values)
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