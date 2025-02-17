"use client";

import { Button } from "@/components/ui/button";
import { usePricing } from "../pricing.hook";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader, XIcon } from "lucide-react";
import Control from "./control";
import { cn } from "@/lib/utils";

type Props = {
  pricings: number[];
};

const PricingForm = ({ pricings }: Props) => {
  const {
    onSubmit,
    form,
    myArray,
    addRow,
    handleChange,
    deleteRow,
    addValue,
    addPercentage,
    reset,
    addRows,
    addIncrement,
    minusValue,
    save,
    setSaveFn,
  } = usePricing(pricings);

  const [mount, setMount] = useState(false);
  useEffect(() => {
    setMount(true);
  }, []);

  if (!mount) return null;

  const isLoading = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <div className="flex gap-8 2xl:flex-row flex-col-reverse relative items-start ">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-3 max-w-[600px] w-full separate"
        >
          <div className="flex items-center gap-3 sticky top-12 z-10 bg-background p-2  border ">
            <Button disabled={isLoading} type="submit">
              Opslaan{" "}
              {isLoading && <Loader className="animate-spin w-3 h-3 ml-2" />}
            </Button>
            <Button type="button" onClick={addRow} variant={"secondary"}>
              {" "}
              Voeg dag toe
            </Button>
          </div>
          <FormField
            control={form.control}
            name="pricings"
            render={({ field }) => (
              <>
                <Table className="w-full border  rounded-sm">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center">Dag</TableHead>

                      <TableHead className="text-center">Prijs</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {myArray!.map((val, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium text-center p-0">
                          {i + 1}
                        </TableCell>

                        <TableCell className="text-right py-[5px] ">
                          <div className="flex items-center  rounded-md  relative gap-1">
                            <span className="italic text-gray-400 absolute left-4">
                              €{" "}
                            </span>
                            <Input
                              className="border-0 p-0 px-8 outline-none h-8"
                              placeholder="0"
                              value={val.toString().replace(".", ",") || ""}
                              onChange={(e) => {
                                handleChange(e.target.value, i);
                              }}
                            />
                            <span className="italic text-gray-400 ml-3">
                              <XIcon
                                onClick={() => deleteRow(i)}
                                className="h-4 w-4 cursor-pointer"
                              />{" "}
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </>
            )}
          />

          {form.getFieldState("pricings").error && (
            <p className="p-1 text-sm text-red-400">
              {form.getFieldState("pricings").error?.message}
            </p>
          )}
        </form>
        <div className={cn("2xl:sticky top-3  max-w-[500px] w-full separate ")}>
          <Control
          save={save}
          setSaveFn={setSaveFn}
            addValue={addValue}
            addPercentage={addPercentage}
            reset={reset}
            addRows={addRows}
            addIncrement={addIncrement}
            minusValue={minusValue}
          />
        </div>
      </div>
    </Form>
  );
};

export default PricingForm;
