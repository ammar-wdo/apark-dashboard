"use client"
 
import * as z from "zod"
 
export const pricingSchema = z.object({
    pricings: z
    .array(z.number().refine((val) => val >= 0, { message: "Price must be a non-negative number" }))
})