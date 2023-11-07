'use client'

import { Button } from "@/components/ui/button"
import { usePricing } from "../pricing.hook"

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"

type Props = {
    pricings:number[] 
}

const PricingForm = ({pricings}: Props) => {


    const {onSubmit,form,myArray,setMyArray} = usePricing(pricings)

 
    const [mount, setMount] = useState(false)
    useEffect(()=>{setMount(true)},[])

    if(!mount) return null
   




   
  return (

    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="pricings"
          render={({ field }) => (
            <Table className="max-w-[1600px] mx-auto border " >
            <TableCaption>A list of your service pricing</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">Day</TableHead>
               
                <TableHead className="text-center">Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
                {myArray!.map((val,i)=>
                <TableRow key={i}>
                <TableCell className="font-medium text-center">{i+1}</TableCell>
                
                <TableCell className="text-right ">
                    <div>
                        <Input type="number" value={myArray![i]} onChange={(e)=>{setMyArray(prev=>prev?.map((val,j)=>{if(i!==j){ return val} else{return +e.target.value }}));form.clearErrors('pricings')}} /> 
                    </div></TableCell>
              </TableRow>)}
              
            </TableBody>
          {form.formState.errors && <p className="text-red-400">{form.getFieldState('pricings').error &&'invalid values'}</p>}
            <Button type="button" onClick={() => setMyArray((prev: number[] | undefined) => [...(prev || []), 0])} variant={'secondary'}> Add day</Button>
          </Table>
          
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>



   
  )
}

export default PricingForm