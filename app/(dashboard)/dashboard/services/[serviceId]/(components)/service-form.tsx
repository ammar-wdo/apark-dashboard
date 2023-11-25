"use client";

import React, { useEffect, useRef } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import * as z from "zod";

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

type Props = { service: Service | null ,airports:{id:string,name:string}[],entities:{id:string,entityName:string}[],isCompany:boolean,entityId:string | undefined};

const ServiceForm = ({ service,airports,entities ,isCompany,entityId}: Props) => {
  // useEffect(()=>{
  //   const handleEnterPress = (e:KeyboardEvent)=>{

  // if(e.key==='Enter'){
  //   e.preventDefault()
  //   handleFacilityAdd(facilityRef,form)
  // }
  // }

  // document.addEventListener('keydown',handleEnterPress)

  // return ()=>document.removeEventListener('keydown',handleEnterPress)

  // },[])

  // const facilityRef = useRef<HTMLInputElement | null>(null);

  //set the logo function

  const {
    onSubmit,

    form,
  } = useService({ service, isCompany,entityId});

  const isLoading = form.formState.isSubmitting;
  const { setOpen } = useModal();
  const params = useParams();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="  max-w-[1200px] ">
        <div className="space-y-12 pt-8">
          <div className="p-8 border rounded-lg">
            <h3 className="font-bold mb-8 text-xl">Service details</h3>
            <div className="grid grid-cols-2 gap-3 ">
           {  !service && <FormField
                control={form.control}
                name="airportId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Choose your airport*</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an airport" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {airports.map((airport)=>   <SelectItem key={airport.id} value={airport.id} className="cursor-pointer">{airport.name}</SelectItem>)}
               
                 
                </SelectContent>
              </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />}
              {isCompany && <FormField
                control={form.control}
                name="entityId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Choose your entity*</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an entity" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {entities.map((entity)=>   <SelectItem key={entity.id} value={entity.id} className="cursor-pointer">{entity.entityName}</SelectItem>)}
               
                 
                </SelectContent>
              </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />}
              <FormField
                control={form.control}
                name="terms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link to the Terms*</FormLabel>
                    <FormControl>
                      <Input placeholder="https://" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service name*</FormLabel>
                    <FormControl>
                      <Input placeholder="Indoor park" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bookingsEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bookings e-mail</FormLabel>
                    <FormControl>
                      <Input placeholder="bookings email" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="available"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 ">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Current availability</FormLabel>
                      <FormDescription>
                        You can enable or desable your availability{" "}
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="p-8 border rounded-lg">
            <h3 className="font-bold mb-8 text-xl">Parking details</h3>
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="parkingAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address*</FormLabel>
                    <FormControl>
                      <Input placeholder="Address" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="parkingZipcode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Zipcode*</FormLabel>
                    <FormControl>
                      <Input placeholder="Zipcode" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="parkingPlace"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Place*</FormLabel>
                    <FormControl>
                      <Input placeholder="Place" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="parkingCountry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country*</FormLabel>
                    <FormControl>
                      <Input placeholder="Country" {...field} />
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
                    <FormLabel>Total parking spots available* </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="total spots"
                        type="number"
                        {...field}
                      />
                    </FormControl>

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
                name="arrivalTodos"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What to do on arrival</FormLabel>
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
                name="departureTodos"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What to do on arrival</FormLabel>
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
            </div>
          </div>


         
        </div>
        <div className="flex items-center gap-4 mt-8">
          <Button disabled={isLoading} type="submit">
            {isLoading ? (
              <>
                {service ? "Saving.." : "  Submitting"}

                <Loader className="ml-3 w-3 h-3 animate-spin" />
              </>
            ) : service ? (
              "Save changes"
            ) : (
              "Submit"
            )}
          </Button>
      
        </div>
      </form>
    </Form>
  );
};

export default ServiceForm;

/* <FormField
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
        /> */
