import { z } from "zod";

export const bookingSchema = z
  .object({
    bookingOnBusinessName: z.string().optional(),
    extraServiceFee: z.coerce.number(),

    address: z.string().optional(),

    arrivalDate: z.date(),

    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    carColor: z.string().min(1),
    carLicense: z.string().min(1),
    carModel: z.string().min(1),
    serviceId: z.string().min(1),

    companyName: z.string().optional(),
    arrivalTime: z.string(),
    departureTime: z.string(),
  
    departureDate: z.date(),
    discount: z.coerce.number(),
    flightNumber: z.string().min(3,{message:'this field is mandatory'}),
    isCompany: z.boolean(),
    phoneNumber: z.string().refine((value) => {
      const phoneRegex = /^(?:[0-9]){1,3}(?:[ -]*[0-9]){6,14}$/;
      return phoneRegex.test(value);
    }, "Invalid phone number"),

    parkingPrice: z.coerce.number(),

    paymentMethod: z.enum(["IDEAL", "CREDIT_CARD", "PAYPAL"]),
    place: z.string().optional(),
    returnFlightNumber: z.coerce.number().optional(),

    vatNumber: z.coerce.number().optional(),
    zipcode: z.string().optional(),
  })
  .refine((data) => !data.isCompany || data.zipcode, {
    message: "company name is required",
    path: ["companyName"],
  })
  .refine((data) => !data.isCompany || data.address, {
    message: "address is required",
    path: ["address"],
  })
  .refine((data) => !data.isCompany || data.zipcode, {
    message: "zipcode is required",
    path: ["zipcode"],
  }).refine((data)=>new Date(data.arrivalDate).getTime() <= new Date(data.departureDate).getTime(),{message:'departure time should be greater or equal to arrival time',path:["paymentMethod"]})
  ;
