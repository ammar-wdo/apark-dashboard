import * as z from "zod"
 
export const formSchema = z.object({
  email: z.string().min(2),
  password:z.string().min(1)
})