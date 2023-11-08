import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { pricingSchema } from "./pricing-schema"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import axios from "axios"
import { useParams } from "next/navigation"
import { useRouter } from "next/navigation"

export const usePricing = (pricings:number[])=>{

    

    const [myArray, setMyArray] = useState<number[] >()
    useEffect(()=>{

if(pricings.length){
setMyArray(pricings)
}
else{
    setMyArray(Array(60).fill(0))
}
        

    },[pricings])

    useEffect(()=>{
       if(myArray?.length){
        const requiredRows = 60;
        const availableRows = myArray?.length 
         if(availableRows  < requiredRows) {
         const emptyRows = requiredRows - availableRows
         const emptyArray  = Array(emptyRows).fill(0)
       setMyArray((prev:number[]|undefined)=>[...(prev||[]),...emptyArray])
       }}
    },[myArray])



//     setMyArray(pricings)
// if(myArray && !!myArray.length){
//     const requiredRows = 60;
// const availableRows = myArray?.length 
// if(availableRows  < requiredRows) {
// const emptyRows = requiredRows - availableRows
// const emptyArray  = Array(emptyRows).fill(0)
// setMyArray((prev:number[]|undefined)=>[...(prev||[]),...emptyArray])
// }
// }
// if(myArray && !!myArray.length){

//     setMyArray(Array(60).fill(0))
// }

    useEffect(()=>{
form.setValue('pricings',myArray||[])
    },[myArray])

    const handleChange = (value:number,index:number)=>{
        const newArray = [...(myArray || [])]
        newArray[index]=value
        setMyArray(newArray)

    }

    const addRow = ()=>{
        setMyArray((prev:number[]|undefined)=>[...(prev||[]),0])
    }


    const form = useForm<z.infer<typeof pricingSchema>>({
        resolver: zodResolver(pricingSchema),
        defaultValues: {
          pricings:pricings || [],
        },
      })

      const params = useParams()
      const router = useRouter()

      async function onSubmit(values: z.infer<typeof pricingSchema>) {
       try {
        await axios.patch(`/api/service/${params.serviceId}`,values)
        toast.success("Changes saved!")
        router.refresh()

       } catch (error) {
        console.log(error)
        toast.error('Something went wrong')
       }
   
      }


      return{form,onSubmit,myArray,setMyArray,handleChange,addRow}

}