'use client'

import { useRouter } from "next/navigation";
import axios from 'axios'
import { useToast } from "@/components/ui/use-toast";
import * as z from "zod";
import { Company } from "@prisma/client";
import { formSchema } from "./form-schema";


export const useRegister = ()=>{


    const { toast } = useToast()
  const router = useRouter()

  async function onSubmit(values: z.infer<typeof formSchema>) {
  try {

const company:Company = await axios.post('/api/company',values)
toast({
    title: "Success",
    description: "Youre company is registerd",
  })
router.push(`/${company.id}`)
    
  } catch (error) {
    console.log(error)
    toast({
        title:'Error',
        description:'Something went wrong',
        variant:'destructive'
    })
  }
  }

  return {onSubmit}

}