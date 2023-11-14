'use client'

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import React from 'react'

import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'
import { CalendarIcon, Loader } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { useRules } from '../rules.hook'
import { Rule } from '@prisma/client'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'


type Props = {
  
}


const RulesForm = () => {
const {form,onSubmit} = useRules()

const loading = form.formState.isSubmitting

  return (
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-20">
    <FormField
        control={form.control}
        name="label"
        render={({ field }) => (
          <FormItem className='flex flex-col gap-4 w-full'>
            <FormLabel>Label</FormLabel>
            <FormControl>
           <Input {...field} className='' placeholder='Label your range' />
            </FormControl>
    
            <FormMessage />
          </FormItem>
        )}
      />
      <div></div>
       <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Rule type</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex justify-between space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="FIXED" />
                    </FormControl>
                    <FormLabel className="font-normal">
                     Fixed
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="PERCENTAGE" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      PERCENTAGE
                    </FormLabel>
                  </FormItem>
                  
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {
            form.watch('type')==="FIXED" &&    <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem className='flex flex-col gap-4 w-full'>
                <FormLabel>Value</FormLabel>
                <FormControl>
               <Input {...field} className='' placeholder='Value' type='number' />
                </FormControl>
        
                <FormMessage />
              </FormItem>
            )}
          />
        }
        {
            form.watch('type')==="PERCENTAGE" &&    <FormField
            control={form.control}
            name="percentage"
            render={({ field }) => (
              <FormItem className='flex flex-col gap-4 w-full'>
                <FormLabel>Percentage</FormLabel>
                <FormControl>
               <Input {...field} className='' placeholder='percentage' type='number' />
                </FormControl>
        
                <FormMessage />
              </FormItem>
            )}
          />
        }
          <FormField
          control={form.control}
          name="action"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Action</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex justify-between space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="TOTAL" />
                    </FormControl>
                    <FormLabel className="font-normal">
                     Apply to total price
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="DAY" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Apply to pricing days
                    </FormLabel>
                  </FormItem>
                  
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      <FormField
        control={form.control}
        name="startDate"
        render={({ field }) => (
          <FormItem className='flex flex-col gap-4'>
            <FormLabel>Start date</FormLabel>
            <FormControl>
            <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
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
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date()
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </FormControl>
    
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="endDate"
        render={({ field }) => (
          <FormItem className='flex flex-col gap-4'>
            <FormLabel>End date</FormLabel>
            <FormControl>
            <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
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
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date() || date < form.getValues('startDate')
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </FormControl>
    
            <FormMessage />
          </FormItem>
        )}
      />
    
      <Button  disabled={loading} type="submit">Submit{loading && <Loader className='ml-2 w-3 h-3 animate-spin' />}</Button>
   
    </form>
  </Form>
  )
}

export default RulesForm