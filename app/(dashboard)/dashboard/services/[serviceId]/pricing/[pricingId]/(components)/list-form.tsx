"use client";

import { Button } from "@/components/ui/button";


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

import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon, Loader, XIcon } from "lucide-react";
import Control from "../../(components)/control";
import { cn, convertDateToISOString } from "@/lib/utils";
import { useList } from "../list-hook";
import { List } from "@prisma/client";
import { format } from "date-fns";

type Props = {
 list:List | null
};

const ListForm = ({ list }: Props) => {
  const { onSubmit, form, myArray, addRow, handleChange, deleteRow, addValue ,addPercentage,reset,addRows,addIncrement,minusValue} =
    useList(list);

  const [mount, setMount] = useState(false);
  useEffect(() => {
    setMount(true);
  }, []);

  if (!mount) return null;

  const isLoading = form.formState.isSubmitting;

  return (
    <Form {...form}>
         
      <div className="flex gap-8 2xl:flex-row flex-col-reverse relative items-start ">
   
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-3 max-w-[600px] w-full separate"
        >

            <div>
            <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Label</FormLabel>
              <FormControl>
                <Input placeholder="Label" {...field} />
              </FormControl>
            
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="mt-4 flex items-center justify-between">
        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Start Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(new Date(field.value), "dd-MM-yyyy")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    fromMonth={form.watch('startDate') ? new Date(form.watch('startDate')) : new Date()}
                    mode="single"
                    selected={new Date(new Date(field.value).setHours(0,0,0,0))}
                    onSelect={(val)=>{field.onChange(convertDateToISOString(val));}}
                    disabled={(date) =>
                      date <  new Date(new Date().setHours(0,0,0,0)) 
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
          
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="endDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>End Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(new Date(field.value), "dd-MM-yyyy")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    fromMonth={form.watch('endDate') ? new Date(form.watch('endDate')) : new Date()}
                    selected={new Date(new Date(field.value).setHours(0,0,0,0))}
                    onSelect={(val)=>{field.onChange(convertDateToISOString(val));console.log(form.watch('endDate'))}}
                    disabled={(date) =>
                        date <  new Date(new Date().setHours(0,0,0,0)) || date <= new Date(new Date(form.watch('startDate')).setHours(0,0,0,0))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
          
              <FormMessage />
            </FormItem>
          )}
        />
        </div>
            </div>
             <div className="flex items-center gap-3 sticky top-12 z-10 bg-background p-2  border ">
            <Button disabled={isLoading} type="submit">
              Opslaan{" "}
              {isLoading && <Loader className="animate-spin w-3 h-3 ml-2" />}
            </Button>
            <Button type="button" onClick={addRow} variant={"secondary"}>
              {" "}
              Voeg dag toe
            </Button>
          </div>
          <FormField
            control={form.control}
            name="pricings"
            render={({ field }) => (
              <>
                <Table className="w-full border  rounded-sm">
               
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center">Dag</TableHead>

                      <TableHead className="text-center">Prijs</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {myArray!.map((val, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium text-center p-0">
                          {i + 1}
                        </TableCell>

                        <TableCell className="text-right py-[5px] ">
                          <div className="flex items-center  rounded-md  relative gap-1">
                            <span className="italic text-gray-400 absolute left-4">
                              €{" "}
                            </span>
                            <Input
                         className="border-0 p-0 px-8 outline-none h-8"
                      
                         placeholder="0"
                         value={val.toString().replace('.',',') || ''}
                         onChange={(e) => {
                           handleChange(e.target.value, i);
                         }}
                            />
                            <span className="italic text-gray-400 ml-3">
                              <XIcon
                                onClick={() => deleteRow(i)}
                                className="h-4 w-4 cursor-pointer"
                              />{" "}
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </>
            )}
          />

          {form.getFieldState("pricings").error && (
            <p className="p-1 text-sm text-red-400">
            { form.getFieldState("pricings").error?.message}
            </p>
          )}
       
        </form>
        <div className={cn("2xl:sticky top-3  max-w-[500px] w-full separate ")} >
        <Control addValue={addValue} addPercentage={addPercentage} reset={reset} addRows={addRows} addIncrement={addIncrement}    minusValue={minusValue} />
        </div>
       
   
       
      </div>
    </Form>
  );
};

export default ListForm;
