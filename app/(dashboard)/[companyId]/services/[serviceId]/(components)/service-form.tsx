"use client";

import React, { useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { serviceDefaultValues, serviceSchema } from "../service-schema";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Service } from "@prisma/client";
import { Loader, XIcon } from "lucide-react";
import { SingleImageDropzone } from "@/components/single-image-dropezone";
import { useService } from "../service.hook";
import Image from "next/image";

type Props = { service: Service | null };

const ServiceForm = ({ service }: Props) => {
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
            key={facility}
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

  const onSubmit = () => {};
  const setImage = (url: string) => {
    form.setValue("logo", url);
  };

  const ImagePlaceholder = ()=>{
    return         !!form.watch("logo") && (
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
  }

  const { file, setFile, uploadImage, deleteImage, deleteLoader } =
    useService(setImage);

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
                  <Button type="button" onClick={uploadImage} variant={'secondary'}>
                    Upload
                  </Button>

                  <FormMessage />
                </FormItem>

        {ImagePlaceholder()}
              </div>
            )}
          />
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default ServiceForm;
