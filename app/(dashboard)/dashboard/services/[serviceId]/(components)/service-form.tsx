"use client";

import React, { useEffect, useRef } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { MyFacilities, handleFacilityAdd, serviceDefaultValues, serviceSchema } from "../service-schema";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ParkingType, Service } from "@prisma/client";
import { Loader, XIcon } from "lucide-react";
import { SingleImageDropzone } from "@/components/single-image-dropezone";
import { useService } from "../service.hook";
import Image from "next/image";
import { useModal } from "@/hooks/use-modal";
import { useParams } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";


type Props = { service: Service | null };

const ServiceForm = ({ service }: Props) => {



useEffect(()=>{
  const handleEnterPress = (e:KeyboardEvent)=>{
 
if(e.key==='Enter'){
  e.preventDefault()
  handleFacilityAdd(facilityRef,form)
}
}

document.addEventListener('keydown',handleEnterPress)

return ()=>document.removeEventListener('keydown',handleEnterPress)
 
},[])



  

  const facilityRef = useRef<HTMLInputElement | null>(null);

  

 

//set the logo function


  const {
    file,
    setFile,
    uploadImage,
  
    onSubmit,
    uploadImages,
  
    setImagesFile,
    imagesFile,
    
  ImagePlaceholder,ImagesPlaceholder,
    form
  } = useService( {service});

  const isLoading = form.formState.isSubmitting;
const {setOpen} = useModal()
const params = useParams()


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="address" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="arrivalTodos"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Arrival todos</FormLabel>
                <FormControl>
                  <Input placeholder="arrival todos" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="City" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="departureTodos"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Departure todos</FormLabel>
                <FormControl>
                  <Input placeholder="departure todos" {...field} />
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
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us a little bit about yourself"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="distanceToAirport"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Distance to airport</FormLabel>
                <FormControl>
                  <Input placeholder="distance to airport" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="facilities"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Facilities</FormLabel>
                <FormControl>
                  <div className="space-y-3">
                    <div className="flex items-center gap-5">
                      <Input ref={facilityRef} />
                      <Button onClick={()=>handleFacilityAdd(facilityRef,form)} type="button">
                        Add facility
                      </Button>
                    </div>
                    {MyFacilities(form)}
                  </div>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="importantInfo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Important info</FormLabel>
                <FormControl>
                  <Input placeholder="important info" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="spots"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total spots </FormLabel>
                <FormControl>
                  <Input placeholder="total spots" type="number" {...field}  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="logo"
            render={({ field }) => (
              <div className="flex gap-4 items-center">
                <FormItem>
                  <FormLabel>Logo</FormLabel>
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
                  disabled={!file || !!form.watch('logo')}
                    type="button"
                    onClick={uploadImage}
             
                  >
                    Upload
                  </Button>

                  <FormMessage />
                </FormItem>

                {ImagePlaceholder()}
              </div>
            )}
          />
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Add images</FormLabel>
                <div className="space-y-4">
                  <FormControl>
                    <SingleImageDropzone
                      width={200}
                      height={200}
                      value={imagesFile}
                      onChange={(imagesFile) => {
                        setImagesFile(imagesFile);
                      }}
                    />
                  </FormControl>
                  <Button
                  disabled={!imagesFile}
                    type="button"
                    onClick={uploadImages}
                   
                  >
                    Upload
                  </Button>
                  {ImagesPlaceholder()}
                </div>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="parkingType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Parking type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a verified email to display" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={ParkingType.shuttle}>
                      {ParkingType.shuttle}
                    </SelectItem>
                    <SelectItem value={ParkingType.valet}>
                      {ParkingType.valet}
                    </SelectItem>
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="timeToAirport"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time to airport</FormLabel>
                <FormControl>
                  <Input placeholder="time" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="title" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
          control={form.control}
          name="isActive"
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
                  Activate your sevice
                </FormLabel>
                <FormDescription>
                  You can enable or desable your service{" "}
               
                </FormDescription>
              </div>
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
                Current availability
                </FormLabel>
                <FormDescription>
                  You can enable or desable your availability{" "}
               
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
          <FormField
            control={form.control}
            name="zipcode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Zipcode</FormLabel>
                <FormControl>
                  <Input placeholder="Zipcode" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex items-center gap-4">
        <Button disabled={isLoading} type="submit">
          {isLoading ? (
            <>
            {service?'Saving..':'  Submitting'}
            
              <Loader className="ml-3 w-3 h-3 animate-spin" />
            </>
          ) : (
            service ?"Save changes":'Submit'
          )}
        </Button>
        {service && <Button type="button" variant={'destructive'} onClick={()=>setOpen('delete-modal',{url:`/api/service/${service.id}`})}>Delete</Button>}
        </div>
       
      </form>
    </Form>
  );
};

export default ServiceForm;
