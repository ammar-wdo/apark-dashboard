

import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { formSchema } from "./login-schema"
import { signIn } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export const useLoginHook = ()=>{

  const [error,setError] = useState(false)
  const [loading, setLoading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          username: "",
          password:""
          
        },
      })
     

      const router = useRouter()
      async function onSubmit(values: z.infer<typeof formSchema>) {
       try {
        setLoading(true)
   setError(false)
      const response =   await signIn('credentials',{username:values.username,password:values.password,redirect:false,callbackUrl:'/dashboard'})
      console.log(response)
   
      if(!response?.ok) {
        setError(true)
      }else{
        router.push('/dashboard')
      }
       } catch (error) {
        console.log(error)
      
       }finally{
        setLoading(false)
       }
      }


      return {form,onSubmit,error,loading}
    }
