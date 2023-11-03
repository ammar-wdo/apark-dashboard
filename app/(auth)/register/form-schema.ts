"use client"
 
import * as z from "zod"
 
export const formSchema = z.object({
    userEmail:z.string().email(),
    userId:z.string(),
  address: z.string().min(2).max(50),
  contact:z.string().min(2).max(50),
  invoiceEmail:z.string().email(),
  phone: z.string().refine((value) => {
    const phoneRegex = /^\+(?:[0-9]){1,3}(?:[ -]*[0-9]){6,14}$/;
    return phoneRegex.test(value);
  }, "Invalid phone number"),
  place:z.string().min(2).max(50),
  zipcode:z.string().min(1),


  
})