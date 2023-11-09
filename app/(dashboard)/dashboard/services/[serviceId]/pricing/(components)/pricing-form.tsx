"use client";

import { Button } from "@/components/ui/button";
import { usePricing } from "../pricing.hook";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader } from "lucide-react";

type Props = {
  pricings: number[];
};

const PricingForm = ({ pricings }: Props) => {
  const { onSubmit, form, myArray, addRow,handleChange } = usePricing(pricings);

  const [mount, setMount] = useState(false);
  useEffect(() => {
    setMount(true);
  }, []);

  if (!mount) return null;

  const isLoading = form.formState.isSubmitting

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="pricings"
          render={({ field }) => (
            <>
            <Table className="max-w-[1600px] mx-auto border ">
              <TableCaption>A list of your service pricing</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">Day</TableHead>

                  <TableHead className="text-center">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myArray!.map((val, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium text-center">
                      {i + 1}
                    </TableCell>

                    <TableCell className="text-right ">
                      <div className="flex items-center border rounded-md p-1  relative gap-1">
                        <span className="italic text-gray-400 absolute left-4">$ {" "}</span>
                        <Input
                        className="border-0  p-0 px-8 outline-none "
                          type="number"
                          value={parseFloat(myArray![i].toString()).toFixed(2)}
                          onChange={(e) => {
                         handleChange(+e.target.value,i)
                          }}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              
          
            </Table>
           
            </>
            
          )}
        
        />
    
      {form.getFieldState('pricings').error && <p className="p-1 text-sm text-red-400">Negative values are not allowed</p>}
      <div className="flex items-center gap-3">
    
        <Button disabled={isLoading} type="submit">Save changes {isLoading && <Loader className="animate-spin w-3 h-3 ml-2" />}</Button>
        <Button
                type="button"
                onClick={addRow}
                variant={"secondary"}
              >
                {" "}
                Add a day
              </Button>
      </div>
        
      </form>
    </Form>
  );
};

export default PricingForm;
