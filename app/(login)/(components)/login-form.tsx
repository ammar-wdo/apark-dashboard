'use client'

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useLoginHook } from "../login.hook"
import { Loader } from "lucide-react"

type Props = {}

const LoginForm = (props: Props) => {



    const {form,onSubmit,error,loading} = useLoginHook()
  return (
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6 p-10 border rounded-md min-w-[350px]">
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input placeholder="email" {...field} />
            </FormControl>
      
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Passowrd</FormLabel>
            <FormControl>
              <Input type="password" placeholder="password" {...field} />
            </FormControl>
      
            <FormMessage />
          </FormItem>
        )}
      />
      <Button disabled={loading} type="submit">Submit {loading && <Loader className="animate-spin h-3 w-3 ml-3" />}</Button>

      {error && <p className="p-2 text-xs text-rose-400">Invalid credintials</p>}
    </form>
  </Form>
  )
}

export default LoginForm