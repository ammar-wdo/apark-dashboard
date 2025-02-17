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
import { Textarea } from '@/components/ui/textarea'

type Props = {}

const ExtraForm = (props: Props) => {

    const {form,onSubmit,file,setFile,uploadImage,ImagePlaceholder} = useExtra()
    const isLoadong = form.formState.isSubmitting
  return (
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className=" mt-10">
        <div className='grid grid-cols-1 gap-3'>

      
      <FormField
        control={form.control}
        name="label"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Naam*</FormLabel>
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
            <FormLabel>Beschrijving*</FormLabel>
            <FormControl>
              <Textarea placeholder="Beschrijving" {...field} />
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
            <FormLabel>
Prijs*</FormLabel>
            <FormControl>
              <Input placeholder="€ Prijs" {...field} value={field.value || ''} />
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
                Beschikbaar
                </FormLabel>
             
              </div>
            </FormItem>
          )}
        />

<FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <div className="flex flex-wrap  gap-4 items-center">
                <FormItem>
                  <FormLabel>Afbeelding*</FormLabel>
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
                    Uploaden
                  </Button>

                  <FormMessage />
                </FormItem>

                {<ImagePlaceholder />}
              </div>
            )}
          />
            </div>
      <Button disabled={isLoadong} className='mt-4 w-full' type="submit">Verstuur {isLoadong && <Loader className='ml-3 w-4 h-4 animate-spin' />}</Button>
    </form>
  </Form>
  )
}

export default ExtraForm