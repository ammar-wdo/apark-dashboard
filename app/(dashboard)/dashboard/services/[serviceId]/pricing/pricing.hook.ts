import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { pricingSchema } from "./pricing-schema";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

export const usePricing = (pricings: number[]) => {
  const [myArray, setMyArray] = useState<number[]>();
  useEffect(() => {
    if (pricings.length) {
      setMyArray(pricings);
    } else {
      setMyArray(Array(15).fill(0));
    }
  }, [pricings]);

  useEffect(() => {
    if (myArray?.length) {
      const requiredRows = 30;
      const availableRows = myArray?.length;
      if (availableRows < requiredRows) {
        const emptyRows = requiredRows - availableRows;
        const emptyArray = Array(emptyRows).fill(0);
        setMyArray((prev: number[] | undefined) => [
          ...(prev || []),
          ...emptyArray,
        ]);
      }
    }
  }, [myArray]);

  //     setMyArray(pricings)
  // if(myArray && !!myArray.length){
  //     const requiredRows = 60;
  // const availableRows = myArray?.length
  // if(availableRows  < requiredRows) {
  // const emptyRows = requiredRows - availableRows
  // const emptyArray  = Array(emptyRows).fill(0)
  // setMyArray((prev:number[]|undefined)=>[...(prev||[]),...emptyArray])
  // }
  // }
  // if(myArray && !!myArray.length){

  //     setMyArray(Array(60).fill(0))
  // }

  useEffect(() => {
    form.setValue("pricings", myArray || []);
  }, [myArray]);

  const handleChange = (value: number, index: number) => {
    const newArray = [...(myArray || [])];
    newArray[index] = value;
    setMyArray(newArray);
  };

  const addRow = () => {
    setMyArray((prev: number[] | undefined) => [...(prev || []), 0]);
    toast.success('Successfully done!',{position:'top-center',style:{fontSize:"1.3rem"}})
  };

  const deleteRow = (row: number) => {
    setMyArray((prev: number[] | undefined) =>
      prev?.filter((_, i) => i !== row)
    );
    toast.success('Successfully done!',{position:'top-center',style:{fontSize:"1.3rem"}})
  };

  const addValue = (value: number) => {
    setMyArray((prev: number[] | undefined) =>
      prev?.map((el) => (el + value < 0 ? 0 : +el + value))
    );
    toast.success('Successfully done!',{position:'top-center',style:{fontSize:"1.3rem"}})
  };
  const addPercentage = (value: number) => {
    setMyArray((prev: number[] | undefined) =>
      prev?.map((el) =>
        el + (el * value) / 100 < 0
          ? 0
          : parseInt((el + (el * value) / 100).toString())
      )
    );
    toast.success('Successfully done!',{position:'top-center',style:{fontSize:"1.3rem"}})
  };
  const reset = (value: number) => {
    setMyArray((prev: number[] | undefined) =>
      prev?.map((el) => (value < 0 ? 0 : parseInt(value.toString())))
    );
    toast.success('Successfully done!',{position:'top-center',style:{fontSize:"1.3rem"}})
  };

  const addRows = (rows: number, value: number) =>
  {  setMyArray((prev: number[] | undefined) => [
      ...(prev || []),
      ...Array(rows).fill(value),
    ])
    toast.success('Successfully done!',{position:'top-center',style:{fontSize:"1.3rem"}})};

  const addIncrement = (from: number, to: number, value=0) => {
    
    if (from > to || from === to) return;

  

    let iv = 1;
    let newArry = myArray;
    console.log(newArry)

    for (let i = from-1; i < to; i++) {
      const theValue = iv * value;
   

      newArry![i] =  newArry![i]? newArry![i] + theValue : 0 +theValue;
      console.log(newArry![i])

      iv++;
    }

    setMyArray(()=>[...(newArry||[])]);

    toast.success('Successfully done!',{position:'top-center',style:{fontSize:"1.3rem"}})
  };

  const form = useForm<z.infer<typeof pricingSchema>>({
    resolver: zodResolver(pricingSchema),
    defaultValues: {
      pricings: pricings || [],
    },
  });

  const params = useParams();
  const router = useRouter();

  async function onSubmit(values: z.infer<typeof pricingSchema>) {
    try {
      await axios.patch(`/api/service/${params.serviceId}`, values);
      toast.success("Changes saved!",{position:'top-center',style:{fontSize:"1.3rem"}});
      router.refresh();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong",{position:'top-center',style:{fontSize:"1.3rem"}});
    }
  }

  return {
    form,
    onSubmit,
    myArray,
    setMyArray,
    handleChange,
    addRow,
    deleteRow,
    addValue,
    addPercentage,
    reset,
    addRows,
    addIncrement,
  };
};
