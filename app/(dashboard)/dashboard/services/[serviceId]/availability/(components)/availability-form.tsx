'use client'

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import React from 'react'
import { useAvailability } from '../availability.hook'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'
import { CalendarIcon, Loader } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'

type Props = {serviceId:string}

const AvailabilityForm = ({serviceId}: Props) => {
const {form,onSubmit} = useAvailability({serviceId})

const loading = form.formState.isSubmitting

  return (
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-20">
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
                        "w-[240px] pl-3 text-left font-normal",
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
                        "w-[240px] pl-3 text-left font-normal",
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
      <FormField
        control={form.control}
        name="label"
        render={({ field }) => (
          <FormItem className='flex flex-col gap-4'>
            <FormLabel>Label</FormLabel>
            <FormControl>
           <Input {...field} className='w-fit' placeholder='Label your range' />
            </FormControl>
    
            <FormMessage />
          </FormItem>
        )}
      />
      <Button disabled={loading} type="submit">Submit{loading && <Loader className='ml-2 w-3 h-3 animate-spin' />}</Button>
    </form>
  </Form>
  )
}

export default AvailabilityForm