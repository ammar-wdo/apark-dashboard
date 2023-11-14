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
  spots: z.coerce.number().gte(1, "Must  above 0"),
  isActive: z.boolean(),
  available: z.boolean(),
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
  });
