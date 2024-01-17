import { z } from "zod";

export const bookingSchema = z
  .object({
    bookingOnBusinessName: z.string().optional(),
    extraServiceFee: z.coerce.number(),

    address: z.string().optional(),

    arrivalDate: z.date(),

    firstName: z.string().min(1,{message:'First name is required'}),
    lastName: z.string().min(1,{message:'Last name is required'}),
    email: z.string().email({message:"E-mail is required"}),
    carColor: z.string().optional(),
    carLicense: z.string().min(1,{message:'Car license is required'}),
    carModel: z.string().min(1,{message:'Car model is required'}),
    serviceId: z.string().min(1),
    numberOfPeople:z.coerce.number().min(1),

    companyName: z.string().optional(),
    arrivalTime: z.string(),
    departureTime: z.string(),

    departureDate: z.date(),
   
    flightNumber: z.string().optional(),
    isCompany: z.boolean(),
    phoneNumber: z.string().refine((value) => {
      const phoneRegex = /^(?:[0-9]){1,3}(?:[ -]*[0-9]){6,14}$/;
      return phoneRegex.test(value);
    }, "Invalid phone number"),

    parkingPrice: z.coerce.number(),

    paymentMethod: z.enum(["IDEAL", "CREDIT_CARD", "PAYPAL"]),
    place: z.string().optional(),
    returnFlightNumber: z.coerce.number().optional(),

    vatNumber: z.string().optional(),
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
  .refine((data) => !data.isCompany || data.place, {
    message: "place is required",
    path: ["place"],
  })
  .refine((data) => !data.isCompany || data.vatNumber, {
    message: "vat  is required",
    path: ["vat"],
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
    label: z.string().min(1,{message:'Enter a label for this period'}),
    startDate: z.date(),
    endDate: z.date(),
  })
  .refine(
    (date) =>
      new Date(date.startDate).getTime() <= new Date(date.endDate).getTime(),
    { message: "Invalid blocking range", path: ["startDate"] }
  );


  const emailSchema = z.string().email({message:"E-mail is required"})
export const serviceSchema = z.object({
  name:z.string().min(1,{message:'Name is required'}),
 terms:z.string().min(1,{message:'This field is required'}),
 bookingsEmail:z.union([z.string(), z.undefined()])
 .refine((val) => !val || emailSchema.safeParse(val).success),
 parkingAddress:z.string().min(1,{message:'Parking address is required'}),
 parkingZipcode:z.string().min(1,{message:'Parking zipcode is required'}),
 parkingCountry:z.string().min(1,{message:'Parking country is required'}),
 parkingPlace:z.string().min(1,{message:'Parking place is required'}),
 spots:z.coerce.number().positive({message:"Negative values are not allowed"}).default(1),
 parkingType:z.enum(['shuttle','valet']).default('valet'),
 arrivalTodos:z.string().optional(),
 departureTodos:z.string().optional(),
 electricCharging:z.boolean().default(false),
 keyStatus:z.enum(["LEAVE","KEEP"]).default('LEAVE'),
 parkingLocation:z.enum(['INDOOR',"OUTDOOR"]).default('INDOOR'),
 available:z.boolean().default(false),

 entityId:z.string().min(1)












});

export const rulesSchema = z
  .object({
    label: z.string().min(1,{message:'Enter a label for this payment rule'}),
    serviceId: z.string().min(1),
    startDate: z.date(),
    endDate: z.date(),
    type: z.enum(["FIXED", "PERCENTAGE"]).optional(),

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


  export const contactSchema = z.object({
    firstName: z.string().min(2,{message:'First name isrequired'}).max(50),
    lastname: z.string().min(2,{message:'Last name is required'}).max(50),
    email: z.string().email({message:"E-mail is required"}),
    subject: z.string().optional(),
    message:z.string().min(2,{message:'Message is required'})
  })


  export const reviewSchema = z.object({
    bookingId:z.string().min(1),
    entityId:z.string().min(1),
    serviceId:z.string().min(1),
    reviewContent:z.string().optional(),
    rate:z.coerce.number().min(0.5,{message:'Rate i required'}).max(5),
    status:z.enum(["PENDING","ACTIVE"]).default('PENDING'),
    visibility:z.enum(["FIRSTNAME","FULLNAME","ANOUNYMOS"]).default('FULLNAME'),
    
    
    })


    export const extraSchema = z.object({
   
      label:z.string().min(1,{message:'Enter a label for the extra option'}),
      description:z.string().min(1,{message:'Description is required'}),
      image:z.string().min(1,{message:'Upload an image'}),
      price:z.coerce.number().min(1,{message:'price is required'}),
     
      available:z.boolean().default(false)
    })