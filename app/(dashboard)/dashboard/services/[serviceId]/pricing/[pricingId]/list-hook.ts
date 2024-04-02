import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { listSchema } from "@/schemas";
import { List } from "@prisma/client";
import { convertDateToISOString } from "@/lib/utils";
import { addList, editList } from "@/actions/list-actions";

;
export const useList = (list:List | null) => {
  const [myArray, setMyArray] = useState<(number | string)[]>();


  useEffect(() => {
    if (list?.pricings?.length) {
      setMyArray(list.pricings);
    } else {
      setMyArray(Array(30).fill(0));
    }
  }, [list?.pricings]);

  useEffect(() => {
    if (myArray?.length) {
      const requiredRows = 30;
      const availableRows = myArray?.length;
      if (availableRows < requiredRows) {
        const emptyRows = requiredRows - availableRows;
        const emptyArray = Array(emptyRows).fill(0);
        setMyArray((prev: (number|string)[] | undefined) => [
          ...(prev || []),
          ...emptyArray,
        ]);
      }
    }
  }, [myArray]);




  

  useEffect(() => {
    form.setValue("pricings", myArray?.map(el=>+Number(el).toFixed(2)) || []);
  }, [myArray]);







 const handleChange = (value: string, index: number) => {
  
  const newArray:(string | number)[] = [...(myArray || [])];
  newArray[index] = isNaN(+value.replace(',','.')) ? 0 : value.replace(',','.')
  setMyArray(newArray);
};

  const addRow = () => {
    const newState = [...myArray!, 0];
    setMyArray(newState.map(el=>+Number(el).toFixed(2)));



  };

  const deleteRow = (row: number) => {
    const newState = (myArray || []).filter((_, i) => i !== row);
    setMyArray(newState.map(el=>+Number(el).toFixed(2)));



  };

  const addValue = (value: number, from: number, to: number) => {
    if (from > to || from === to || value === 0) return;

    const newState = (myArray?.map(el=>+el) || []).map((el, i) => {
      if (i + 1 >= from && i + 1 <= to) {
        return el + value < 0 ? 0 : +el + value;
      } else {
        return el;
      }
    });

    setMyArray(newState.map(el=>+Number(el).toFixed(2)));


  

    // console.log(previousArray)

    toast.success("Successfully done!", {
      position: "top-center",
      style: { fontSize: "1.3rem" },
    });
  };

  const minusValue = (value: number, from: number, to: number) => {
    if (from > to || from === to || value === 0) return;

    const newState = (myArray?.map(el=>+el) || []).map((el, i) => {
      if (i + 1 >= from && i + 1 <= to) {
        return el - value < 0 ? 0 : +el - value;
      } else {
        return el;
      }
    });
    setMyArray(newState.map(el=>+Number(el).toFixed(2)));


  

    toast.success("Successfully done!", {
      position: "top-center",
      style: { fontSize: "1.3rem" },
    });
  };

  const addPercentage = (value: number) => {
    if (value === 0) return;

    const newState = (myArray?.map(el=>+el) || []).map((el) =>
      el + (el * value) / 100 < 0
        ? 0
        : parseInt((el + (el * value) / 100).toString())
    );
    setMyArray(newState.map(el=>+Number(el).toFixed(2)));


  

    toast.success("Successfully done!", {
      position: "top-center",
      style: { fontSize: "1.3rem" },
    });
  };

  const reset = (value: number) => {
    const newState = (myArray || []).map((el) =>
      +value < 0 ? 0 : value
    );
    setMyArray(newState.map(el=>+Number(el).toFixed(2)));


  

    toast.success("Successfully done!", {
      position: "top-center",
      style: { fontSize: "1.3rem" },
    });
  };

  const addRows = (rows: number, value: number) => {
    if (rows === 0) return;

 

    const newState = [...(myArray || []), ...Array(rows).fill(value)];
    setMyArray(newState.map(el=>+Number(el).toFixed(2)));


  

    toast.success("Successfully done!", {
      position: "top-center",
      style: { fontSize: "1.3rem" },
    });
  };

  const addIncrement = (from: number, to: number, value: number) => {
    if (from > to || from === to || !from || !to || !value || value < 0) return;
    let iv = 1;
    let newArry = myArray?.map(el=>+el);

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

  
    setMyArray(newArry?.map(el=>+Number(el).toFixed(2)));

  



    toast.success("Successfully done!", {
      position: "top-center",
      style: { fontSize: "1.3rem" },
    });
  };

 
  
 

  const form = useForm<z.infer<typeof listSchema>>({
    resolver: zodResolver(listSchema),
    defaultValues: {
      pricings: list?.pricings || [],
      startDate:list?.startDate || undefined,
        endDate:list?.endDate || undefined,
        label:list?.label || ''
    },
  });


  useEffect(()=>{
    console.log(form.watch('startDate'),form.watch('endDate'))
  },[form.watch('startDate'),form.watch('endDate')])

  const params = useParams();
  const router = useRouter();

  async function onSubmit(values: z.infer<typeof listSchema>) {
    try {
  let res 

  if(!list) {
    res = await addList(params.serviceId as string,values)
  }else if (list){
    res = await editList(params.serviceId as string,list.id,values)
  }

  if(!res?.success){
    toast.error(res?.error, {
        position: "top-center",
        style: { fontSize: "1.3rem" },
      });
  }else if (res.success){
    toast.success(res.message, {
        position: "top-center",
        style: { fontSize: "1.3rem" },
      });
      router.refresh();
      router.push(`/dashboard/services/${params.serviceId}/pricing`)
  }

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
