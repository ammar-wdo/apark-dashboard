"use client";

import { formSchema } from "../form-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from 'axios'
import { Company } from "@prisma/client";

type Props = {
  userEmail: string;
  userId: string;
};

const RegisterForm = ({ userEmail, userId }: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userEmail,
      userId,
      address: "",
      contact: "",
      invoiceEmail: "",
      phone: "",
      place: "",
      zipcode: "",
    },
  });
  const { toast } = useToast()
  const router = useRouter()

  async function onSubmit(values: z.infer<typeof formSchema>) {
  try {

const company:Company = await axios.post('/api/company',values)
toast({
    title: "Success",
    description: "Youre company is registerd",
  })
router.push(`/${company.id}`)
    
  } catch (error) {
    console.log(error)
    toast({
        title:'Error',
        description:'Something went wrong',
        variant:'destructive'
    })
  }
  }

  const isLoading = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-10">
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contact"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="invoiceEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Invoice-mail</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="place"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Place</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="zipcode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Zipcode</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button disabled={isLoading} type="submit">
          {isLoading ? (
            <>
              Submitting
              <Loader className="ml-3 w-3 h-3 animate-spin" />
            </>
          ) : (
            "Submit"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default RegisterForm;
