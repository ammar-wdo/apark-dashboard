"use client";

import React, { useEffect, useRef } from "react";
import { v4 as uuidv4 } from 'uuid';
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { serviceDefaultValues, serviceSchema } from "../service-schema";
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
import { MultiImageDropzone } from "@/components/multi-image-dropzone";

type Props = { service: Service | null };

const ServiceForm = ({ service }: Props) => {



useEffect(()=>{
  const handleEnterPress = (e:KeyboardEvent)=>{
 
if(e.key==='Enter'){
  e.preventDefault()
  handleFacilityAdd()
}
}

document.addEventListener('keydown',handleEnterPress)

return ()=>document.removeEventListener('keydown',handleEnterPress)
 
},[])



  const form = useForm<z.infer<typeof serviceSchema>>({
    resolver: zodResolver(serviceSchema),
    defaultValues: serviceDefaultValues(service),
  });

  const facilityRef = useRef<HTMLInputElement | null>(null);

  const handleFacilityAdd = () => {
    if (!facilityRef.current?.value.trim()) return;
    const facilities = form.getValues("facilities");
    form.setValue("facilities", [...facilities, facilityRef.current.value]);
    facilityRef.current.value = "";
  };

  const handleDeleteFacility = (input: string) => {
    form.setValue("facilities", [
      ...form.getValues("facilities").filter((facility) => facility !== input),
    ]);
  };

  const MyFacilities = () => {
    return !form.getValues("facilities").length ? (
      <p className="p-2 text-gray-500 capitalize">No facilities added</p>
    ) : (
      <div className="flex flex-wrap gap-4">
        {form.getValues("facilities").map((facility) => (
          <div
            className="p-2 capitalize flex gap-4 border rounded-sm text-s"
            key={uuidv4()}
          >
            {facility}
            <XIcon
              className="cursor-pointer"
              onClick={() => handleDeleteFacility(facility)}
            />
          </div>
        ))}
      </div>
    );
  };

  const setImage = (url: string) => {
    form.setValue("logo", url);
  };

  const setImages = (url: string) => {
    const images = form.getValues("images");
    form.setValue("images", [...images!, url]);
  };

  const deleteImages = (url: string) => {
    const images = form.getValues("images");
    form.setValue("images", [...images!.filter((image) => image !== url)]);
  };

  const ImagePlaceholder = () => {
    
      if(!!form.watch("logo")) return (
        <div className="w-[150px] h-[150px] overflow-hidden  relative">
          {deleteLoader ? (
            <div className="flex items-center justify-center w-full h-full ">
              <Loader className="w-5 h-5 animate-spin" />
            </div>
          ) : (
            <Image
              alt="added logo"
              src={form.getValues("logo")}
              fill
              className="object-cover rounded-lg"
            />
          )}

          <XIcon
            className="absolute top-1 right-1 cursor-pointer text-white bg-rose-400 p-1 rounded-md"
            onClick={() => {
              deleteImage(form.getValues("logo"));
            }}
          />
        </div>
      )
      if(imageLoader) return <div
           
      className="w-[150px] h-[150px] overflow-hidden flex items-center justify-center  relative"
    >  <Loader className="w-5 h-5 animate-spin" /></div>

   
  };
  const ImagesPlaceholder = () => {
    return (
      <div className="flex items-center gap-3">
      {!!form.watch("images")?.length && (
        <div className="flex items-center gap-3">
          {form.getValues("images")?.map((image) => (
            <div
              key={image}
              className="w-[150px] h-[150px] overflow-hidden  relative"
            >
              {deleteImagesLoader === image ? (
                <div className="flex items-center justify-center w-full h-full ">
                  <Loader className="w-5 h-5 animate-spin" />
                </div>
              ) : (
                <Image
                  alt="added logo"
                  src={image}
                  fill
                  className="object-cover rounded-lg"
                />
              )}

              <XIcon
                className="absolute top-1 right-1 cursor-pointer text-white bg-rose-400 p-1 rounded-md"
                onClick={() => {
                  deleteanImage(image);
                }}
              />
            
            </div>
          ))}
         
        </div>
      )}
         {imagesLoader &&  <div
           
           className="w-[150px] h-[150px] overflow-hidden flex items-center justify-center  relative"
         >  <Loader className="w-5 h-5 animate-spin" /></div>}
   </div> );
  };

  const {
    file,
    setFile,
    uploadImage,
    deleteImage,
    deleteLoader,
    onSubmit,
    uploadImages,
    deleteImagesLoader,
    setImagesFile,
    imagesFile,
    deleteanImage,
    imageLoader,
    imagesLoader,
  } = useService({ setImage, setImages, deleteImages });

  const isLoading = form.formState.isSubmitting;



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
                <FormLabel>Departure todos</FormLabel>
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
                      <Button onClick={handleFacilityAdd} type="button">
                        Add facility
                      </Button>
                    </div>
                    {MyFacilities()}
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
                    variant={"secondary"}
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
                    variant={"secondary"}
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
            name="zipcode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Zipcode" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button disabled={isLoading} type="submit">
          {isLoading ? (
            <>
              Submitting
              <Loader className="ml-3 w-3 h-3 animate-spin" />
            </>
          ) : (
            "Submit"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default ServiceForm;
