"use client";

import { Service, ParkingType } from "@prisma/client";
import { XIcon } from "lucide-react";
import { UseFormReturn, useForm } from "react-hook-form";
import * as z from "zod";
import { v4 as uuidv4 } from "uuid";
import { zodResolver } from "@hookform/resolvers/zod";
import { serviceSchema } from "@/schemas";

export const serviceDefaultValues = (service: Service | null) => ({
  name: service?.name || "",
  terms: service?.name || "",
  bookingsEmail: service?.bookingsEmail || "",
  parkingAddress: service?.parkingAddress || "",
  parkingZipcode: service?.parkingZipcode || "",
  parkingCountry: service?.parkingCountry || "",
  parkingPlace: service?.parkingPlace || "",
  arrivalTodos: service?.arrivalTodos || "",
  departureTodos: service?.departureTodos || "",
  contactPerson: service?.contactPerson || "",
  invoiceEmail: service?.invoiceEmail || "",
  companyName: service?.companyName || "",
  invoiceAddress: service?.invoiceAddress || "",
  invoiceZipcode: service?.invoiceZipcode || "",
  invoicePlace: service?.invoicePlace || "",
  invoiceCountry: service?.invoiceCountry || "",
  vatNO: service?.vatNO || "",
  IBAN: service?.IBAN || "",
  parkingType: service?.parkingType || ParkingType.shuttle,
  spots: service?.spots || 1,
  available: service?.available || false,
  airportid:service?.airportId || ''
});

type myForm = UseFormReturn<z.infer<typeof serviceSchema>>;

// export const handleFacilityAdd = (
//   facilityRef: React.MutableRefObject<HTMLInputElement | null>,
//   form: myForm
// ) => {
//   if (!facilityRef.current?.value.trim()) return;
//   const facilities = form.getValues("facilities");
//   form.setValue("facilities", [...facilities, facilityRef.current.value]);
//   facilityRef.current.value = "";
// };

// export const handleDeleteFacility = (input: string, form: myForm) => {
//   form.setValue("facilities", [
//     ...form.getValues("facilities").filter((facility) => facility !== input),
//   ]);
// };

// export const MyFacilities = (form: myForm) => {
//   return !form.getValues("facilities").length ? (
//     <p className="p-2 text-gray-500 capitalize">No facilities added</p>
//   ) : (
//     <div className="flex flex-wrap gap-4">
//       {form.getValues("facilities").map((facility) => (
//         <div
//           className="p-2 capitalize flex gap-4 border rounded-sm text-s"
//           key={uuidv4()}
//         >
//           {facility}
//           <XIcon
//             className="cursor-pointer"
//             onClick={() => handleDeleteFacility(facility, form)}
//           />
//         </div>
//       ))}
//     </div>
//   );
// };
