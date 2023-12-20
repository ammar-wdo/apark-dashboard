'use client'

import React from 'react'
import { useExtra } from '../extra.hook'

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from '@/components/ui/checkbox'
import { SingleImageDropzone } from '@/components/single-image-dropezone'
import { Loader } from 'lucide-react'

type Props = {}

const ExtraForm = (props: Props) => {

    const {form,onSubmit,file,setFile,uploadImage,ImagePlaceholder} = useExtra()
    const isLoadong = form.formState.isSubmitting
  return (
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className=" mt-10">
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>

      
      <FormField
        control={form.control}
        name="label"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Label*</FormLabel>
            <FormControl>
              <Input placeholder="label" {...field} />
            </FormControl>
         
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description*</FormLabel>
            <FormControl>
              <Input placeholder="description" {...field} />
            </FormControl>
         
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="price"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Price*</FormLabel>
            <FormControl>
              <Input placeholder="€ price" {...field} value={field.value || ''} />
            </FormControl>
         
            <FormMessage />
          </FormItem>
        )}
      />
       <FormField
          control={form.control}
          name="available"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
               Available
                </FormLabel>
             
              </div>
            </FormItem>
          )}
        />

<FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <div className="flex flex-wrap md:col-span-2 gap-4 items-center">
                <FormItem>
                  <FormLabel>Image*</FormLabel>
                  <FormControl>
                    <SingleImageDropzone
                      width={200}
                      height={200}
                      value={file}
                      onChange={(file) => {
                        setFile(file);
                      }}
                    />
                  </FormControl>
                  <Button
                  disabled={!file || !!form.watch('image')}
                    type="button"
                    onClick={uploadImage}
             
                  >
                    Upload
                  </Button>

                  <FormMessage />
                </FormItem>

                {<ImagePlaceholder />}
              </div>
            )}
          />
            </div>
      <Button disabled={isLoadong} className='mt-4 w-full' type="submit">Submit {isLoadong && <Loader className='ml-3 w-4 h-4 animate-spin' />}</Button>
    </form>
  </Form>
  )
}

export default ExtraForm