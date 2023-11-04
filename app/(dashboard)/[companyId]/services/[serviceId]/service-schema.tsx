"use client";

import { Service, ParkingType } from "@prisma/client";
import { XIcon } from "lucide-react";
import { UseFormReturn, useForm } from "react-hook-form";
import * as z from "zod";
import { v4 as uuidv4 } from "uuid";
import { zodResolver } from "@hookform/resolvers/zod";

export const serviceSchema = z.object({
  address: z.string().min(1),
  arrivalTodos: z.string().optional(),
  city: z.string(),
  departureTodos: z.string().optional(),
  description: z.string().min(1),
  distanceToAirport: z.string().optional(),
  facilities: z.array(z.string()).min(1),
  images: z.array(z.string()).optional(),
  importantInfo: z.string().optional(),
  latitude: z.string().min(1),
  logo: z.string().min(1),
  longitude: z.string().min(1),
  parkingType: z.enum(["shuttle", "valet"]),
  timeToAirport: z.string().optional(),
  title: z.string().min(1),
  zipcode: z.string().min(1),
});

export const serviceDefaultValues = (service: Service | null) => ({
  address: service?.address || "",
  arrivalTodos: service?.arrivalTodos || "",
  city: service?.city || "",
  departureTodos: service?.departureTodos || "",
  description: service?.description || "",
  distanceToAirport: service?.distanceToAirport || "",
  facilities: service?.facilities || [],
  importantInfo: service?.importantInfo || "",
  images: !!service?.images.length ? service.images : [],
  latitude: service?.latitude || "123",
  logo: service?.logo || "",
  longitude: service?.longitude || "123",
  parkingType: service?.parkingType || ParkingType.shuttle,
  timeToAirport: service?.timeToAirport || "",
  title: service?.title || "",
  zipcode: service?.zipcode || "",
});

type myForm = UseFormReturn<z.infer<typeof serviceSchema>>;

export const handleFacilityAdd = (
  facilityRef: React.MutableRefObject<HTMLInputElement | null>,
  form: myForm
) => {
  if (!facilityRef.current?.value.trim()) return;
  const facilities = form.getValues("facilities");
  form.setValue("facilities", [...facilities, facilityRef.current.value]);
  facilityRef.current.value = "";
};

export const handleDeleteFacility = (input: string, form: myForm) => {
  form.setValue("facilities", [
    ...form.getValues("facilities").filter((facility) => facility !== input),
  ]);
};

export const MyFacilities = (form: myForm) => {
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
            onClick={() => handleDeleteFacility(facility, form)}
          />
        </div>
      ))}
    </div>
  );
};
