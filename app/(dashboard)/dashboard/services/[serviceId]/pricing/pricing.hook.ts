import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { pricingSchema } from "./pricing-schema";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

type Previous = number[];
export const usePricing = (pricings: number[]) => {
  const [myArray, setMyArray] = useState<number[]>();


  useEffect(() => {
    if (pricings?.length) {
      setMyArray(pricings);
    } else {
      setMyArray(Array(30).fill(0));
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

 const handleChange = (value: string, index: number) => {
  const floatValue = parseFloat(value.replace(',', '.'));
  const newArray = [...(myArray || [])];
  newArray[index] = isNaN(floatValue) ? 0 : floatValue;
  setMyArray(newArray);
};

  const addRow = () => {
    const newState = [...myArray!, 0];
    setMyArray(newState);

    // Save the new state and update the current state index

  };

  const deleteRow = (row: number) => {
    const newState = (myArray || []).filter((_, i) => i !== row);
    setMyArray(newState);

    // Save the new state and update the current state index

  };

  const addValue = (value: number, from: number, to: number) => {
    if (from > to || from === to || value === 0) return;

    const newState = (myArray || []).map((el, i) => {
      if (i + 1 >= from && i + 1 <= to) {
        return el + value < 0 ? 0 : +el + value;
      } else {
        return el;
      }
    });

    setMyArray(newState);

    // Save the new state and update the current state index
  

    // console.log(previousArray)

    toast.success("Successfully done!", {
      position: "top-center",
      style: { fontSize: "1.3rem" },
    });
  };

  const minusValue = (value: number, from: number, to: number) => {
    if (from > to || from === to || value === 0) return;

    const newState = (myArray || []).map((el, i) => {
      if (i + 1 >= from && i + 1 <= to) {
        return el - value < 0 ? 0 : +el - value;
      } else {
        return el;
      }
    });
    setMyArray(newState);

    // Save the new state and update the current state index
  

    toast.success("Successfully done!", {
      position: "top-center",
      style: { fontSize: "1.3rem" },
    });
  };

  const addPercentage = (value: number) => {
    if (value === 0) return;

    const newState = (myArray || []).map((el) =>
      el + (el * value) / 100 < 0
        ? 0
        : parseInt((el + (el * value) / 100).toString())
    );
    setMyArray(newState);

    // Save the new state and update the current state index
  

    toast.success("Successfully done!", {
      position: "top-center",
      style: { fontSize: "1.3rem" },
    });
  };

  const reset = (value: number) => {
    const newState = (myArray || []).map((el) =>
      value < 0 ? 0 : parseInt(value.toString())
    );
    setMyArray(newState);

    // Save the new state and update the current state index
  

    toast.success("Successfully done!", {
      position: "top-center",
      style: { fontSize: "1.3rem" },
    });
  };

  const addRows = (rows: number, value: number) => {
    if (rows === 0) return;

 

    const newState = [...(myArray || []), ...Array(rows).fill(value)];
    setMyArray(newState);

    // Save the new state and update the current state index
  

    toast.success("Successfully done!", {
      position: "top-center",
      style: { fontSize: "1.3rem" },
    });
  };

  const addIncrement = (from: number, to: number, value: number) => {
    if (from > to || from === to || !from || !to || !value || value < 0) return;
    let iv = 1;
    let newArry = myArray;

    for (let i = from - 1; i < to; i++) {
      const theValue = iv * value;

      newArry![i] = newArry![i]
        ? newArry![i] + theValue
        : 0 +
          theValue +
          (newArry![from - 2] !== undefined ? newArry![from - 2] : 0);
      console.log(newArry![from - 2]);

      iv++;
    }

    const newState = [...(myArray||[])];
    setMyArray(newState);

  



    toast.success("Successfully done!", {
      position: "top-center",
      style: { fontSize: "1.3rem" },
    });
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
      toast.success("Changes saved!", {
        position: "top-center",
        style: { fontSize: "1.3rem" },
      });
      router.refresh();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong", {
        position: "top-center",
        style: { fontSize: "1.3rem" },
      });
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
    minusValue,
    addPercentage,
    reset,
    addRows,
    addIncrement,

  };
};
