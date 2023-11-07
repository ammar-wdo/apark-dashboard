import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { pricingSchema } from "./pricing-schema"
import { useEffect, useState } from "react"

export const usePricing = (pricings:number[])=>{

    

    const [myArray, setMyArray] = useState<number[] >()
    useEffect(()=>{
setMyArray(pricings)
        

    },[])

    useEffect(()=>{
if(myArray)
        {form.setValue('pricings',myArray)}
    },[myArray])


    const form = useForm<z.infer<typeof pricingSchema>>({
        resolver: zodResolver(pricingSchema),
        defaultValues: {
          pricings:pricings || [],
        },
      })


      function onSubmit(values: z.infer<typeof pricingSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
      }


      return{form,onSubmit,myArray,setMyArray}

}