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
    flightNumber: z.string().min(3, { message: "this field is mandatory" }),
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
  })
  .refine(
    (data) =>
      new Date(data.arrivalDate).getTime() <=
      new Date(data.departureDate).getTime(),
    {
      message: "departure time should be greater or equal to arrival time",
      path: ["paymentMethod"],
    }
  );

export const availabilitySchema = z
  .object({
    serviceId: z.string().min(1),
    label: z.string().min(1),
    startDate: z.date(),
    endDate: z.date(),
  })
  .refine(
    (date) =>
      new Date(date.startDate).getTime() <= new Date(date.endDate).getTime(),
    { message: "Invalid blocking range", path: ["startDate"] }
  );


  const emailSchema = z.string().email()
export const serviceSchema = z.object({
  name:z.string().min(1),
 terms:z.string().min(1),
 bookingsEmail:z.union([z.string(), z.undefined()])
 .refine((val) => !val || emailSchema.safeParse(val).success),
 parkingAddress:z.string().min(1),
 parkingZipcode:z.string().min(1),
 parkingCountry:z.string().min(1),
 parkingPlace:z.string().min(1),
 spots:z.coerce.number().positive().default(1),
 parkingType:z.enum(['shuttle','valet']).default('valet'),
 arrivalTodos:z.string().optional(),
 departureTodos:z.string().optional(),
 electricCharging:z.boolean().default(false),
 keyStatus:z.enum(['BOTH',"LEAVE","KEEP"]).default('BOTH'),
 parkingLocation:z.enum(['INDOOR',"OUTDOOR","BOTH"]).default('BOTH'),
 available:z.boolean().default(false),
 airportId:z.string().min(1),
 entityId:z.string().min(1)












});

export const rulesSchema = z
  .object({
    label: z.string().min(1),
    serviceId: z.string().min(1),
    startDate: z.date(),
    endDate: z.date(),
    type: z.enum(["FIXED", "PERCENTAGE"]).optional(),
    action: z.enum(["TOTAL", "DAY"]),
    percentage: z.coerce.number().min(-50).max(150).optional(),
    value: z.coerce.number().optional(),
  })
  .refine((data) => data.type !== "FIXED" ||  !!data.value, {
    message: "Value is required",
    path: ["value"],
  })
  .refine((data) => data.type !== "PERCENTAGE" || !!data.percentage, {
    message: "percentage is required",
    path: ["percentage"],
  }).refine(
    (date) =>
      new Date(date.startDate).getTime() <= new Date(date.endDate).getTime(),
    { message: "Invalid blocking range", path: ["startDate"] }
  );
