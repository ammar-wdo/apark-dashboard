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
import { Key, ParkingLocation, ParkingType, Service } from "@prisma/client";
import { Loader, XIcon } from "lucide-react";
import { SingleImageDropzone } from "@/components/single-image-dropezone";
import { useService } from "../service.hook";
import Image from "next/image";
import { useModal } from "@/hooks/use-modal";
import { useParams } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type Props = { service: Service | null ,airports:{id:string,name:string}[],entities:{id:string,entityName:string}[],isCompany:boolean,entityId:string | undefined};

const ServiceForm = ({ service,airports,entities ,isCompany,entityId}: Props) => {

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
          <div className="p-8 border rounded-lg separate">
            <h3 className="font-bold mb-8 text-xl">Service details</h3>
            <div className="grid grid-cols-2 gap-3 ">
        
              {isCompany && <FormField
                control={form.control}
                name="entityId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kies uw entiteit*</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Kies entiteit" />
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
                    <FormLabel>Link naar de voorwaarden*</FormLabel>
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
                    <FormLabel>Service naam*</FormLabel>
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
                    <FormLabel>Reserverings e-mail</FormLabel>
                    <FormControl>
                      <Input placeholder="Reserverings e-mail" {...field} />
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
                      <FormLabel>Beschikbaarheid</FormLabel>
                      <FormDescription>
                      Beschikbaarheid beheeren{" "}
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="p-8 border rounded-lg separate">
            <h3 className="font-bold mb-8 text-xl">Parking details</h3>
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="parkingAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>adres*</FormLabel>
                    <FormControl>
                      <Input placeholder="adres" {...field} />
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
                    <FormLabel>Postcode*</FormLabel>
                    <FormControl>
                      <Input placeholder="Postcode" {...field} />
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
                    <FormLabel>Plaats*</FormLabel>
                    <FormControl>
                      <Input placeholder="Plaats" {...field} />
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
                    <FormLabel>Land*</FormLabel>
                    <FormControl>
                      <Input placeholder="Land" {...field} />
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
                    <FormLabel>Parkeerplaatsen Beschikbaar* </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Parkeerplaatsen Beschikbaar"
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
                    <FormLabel>Parkeertype</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Kies type" />
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
                    <FormLabel>Wat te doen bij aankomst</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Wat te doen bij aankomst"
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
                    <FormLabel>Wat te doen bij terugkomst</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Wat te doen bij terugkomst"
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
          name="electricCharging"
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
                 Electrisch laden
                </FormLabel>
           
              </div>
            </FormItem>
          )}
        />

<FormField
          control={form.control}
          name="parkingLocation"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Parkeer locatie</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value={ParkingLocation.INDOOR} />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Binnen
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value={ParkingLocation.OUTDOOR} />
                    </FormControl>
                    <FormLabel className="font-normal">
                     Buiten
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
          name="keyStatus"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Sleutels</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value={Key.KEEP} />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Meenemen
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value={Key.LEAVE} />
                    </FormControl>
                    <FormLabel className="font-normal">
                    Afgeven
                    </FormLabel>
                  </FormItem>
              
                </RadioGroup>
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
                {service ? "Opslaan.." : "  Indienen"}

                <Loader className="ml-3 w-3 h-3 animate-spin" />
              </>
            ) : service ? (
              "Wizigingen opslaan"
            ) : (
              "Indienen"
            )}
          </Button>
      
        </div>
      </form>
    </Form>
  );
};

export default ServiceForm;


