"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usePricing } from "../pricing.hook";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type Props = {
  previousArray:number[]|undefined
  addValue: (value: number,from:number,to:number) => void;
  minusValue: (value: number,from:number,to:number) => void;
  addPercentage: (value: number) => void;
  reset: (value: number) => void;
  addRows: (rows: number, value: number) => void;
  addIncrement:(from:number,to:number,value:number)=>void
  undo:()=>void
};

const Control = ({ addValue, addPercentage, reset, addRows ,addIncrement,minusValue,undo,previousArray}: Props) => {
  const [dayValue, setDayValue] = useState(0);
  const [fromValue, setFromValue] = useState(0)
  const [toValue, setToValue] = useState(0)
  const [substractValue, setSubstractValue]=useState(0)
  const [fromSubstract, setFromSubstract]=useState(0)
  const [toSubstract, setTooSubstract]=useState(0)
  const [percentage, setPercentage] = useState(0);
  const [resetValue, setResetValue] = useState(0);
  const [rows, setRows] = useState(0);
  const [rowsValue, setRowsValue] = useState(0);

  const[from, setFrom]=useState(0)
  const[to, setTo]=useState(0)
  const [incrementValue, setIncrementValue] = useState(0)

  return (
    <section className=" p-3 rounded-sm  text-xs">
     
          <div className="flex items-center justify-between">
            <span className="font-bold text-lg">Control</span>{!!previousArray?.length &&<Button  onClick={undo}>Undo</Button>}</div>
      
      <div className="grid grid-col-1 md:grid-cols-2 gap-2 mt-4">
        <div className="flex flex-col gap-1 p-3 rounded-md border">
        <span className="font-semibold">Set all fields to a certain value</span>
        
        <Input
          type="number"
          className="text-xs"
          min={0}
          placeholder="0"
          value={resetValue || ''}
          onChange={(e) => setResetValue(+e.target.value)}
        />
   
    
        <Button
        variant={'secondary'}
          className=" text-xs mt-auto"
          onClick={() => {reset(resetValue);setResetValue(0)}}
        >
          Set
        </Button>
        </div>
       
        
        
       
        <div className="flex flex-col gap-1 p-3 rounded-md border ">
          <span className="font-semibold">Add value to each day</span>
        
          <div className="grid grid-cols-2 gap-1 w-full  items-center ">
                <span>From</span>
              <Input
              min={0}
                type="number"
                placeholder="day"
                className="pl-4 text-xs"
                value={fromValue ||''}
                onChange={(e) => setFromValue(+e.target.value)}
              />
              <span>To</span>
              <Input
              min={0}
                type="number"
                placeholder="day"
                className="pl-4 text-xs"
                value={toValue || ''}
                onChange={(e) => setToValue(+e.target.value)}
              />
              <span>Value</span>
            
            <Input
            min={0}
              type="number"
              className="text-xs"
              placeholder="0"
              value={dayValue || ''}
              onChange={(e) => setDayValue(+e.target.value)}
            />
          
              </div>
            
        
         
            <Button
                variant={'secondary'}
              className=" text-xs mt-auto"
              onClick={() => {addValue(dayValue,fromValue,toValue);setFromValue(0);setToValue(0);setDayValue(0)}}
            >
              Add
            </Button>
        
        </div>
        
        <div className="flex flex-col gap-1 p-3 rounded-md border">
          <span className="font-semibold">Substract value from each day</span>
       
          <div className="grid grid-cols-2 gap-1 w-full items-center ">
                <span>From</span>
              <Input
              min={0}
                type="number"
                placeholder="day"
                className="pl-4 text-xs"
                value={fromSubstract ||''}
                onChange={(e) => setFromSubstract(+e.target.value)}
              />
              <span>To</span>
              <Input
              min={0}
                type="number"
                placeholder="day"
                className="pl-4 text-xs"
                value={toSubstract || ''}
                onChange={(e) => setTooSubstract(+e.target.value)}
              />
              <span>Value</span>
            
            <Input
            min={0}
              type="number"
              className="text-xs"
              placeholder="0"
              value={substractValue || ''}
              onChange={(e) => setSubstractValue(+e.target.value)}
            />
          
              </div>
             
        
        
            <Button
                variant={'secondary'}
              className=" text-xs mt-auto"
              onClick={() =>{ minusValue(substractValue,fromSubstract,toSubstract);setFromSubstract(0);setTooSubstract(0);setSubstractValue(0)}}
            >
              Substract
            </Button>
       
        </div>
        
        <div className="flex flex-col gap-1 p-3 rounded-md border">
          <span className="font-semibold">Add percentage to each day</span>
         
          <div className="relative flex items-center">
            <span className="absolute left-2 text-xs text-gray-500">%</span>
            <Input
              type="number"
              
              className="pl-5 text-xs"
              placeholder="0"
              value={percentage||''}
              onChange={(e) => setPercentage(+e.target.value)}
            />
          </div>
       
            <Button
                variant={'secondary'}
              className=" text-xs mt-auto"
              onClick={() => {addPercentage(percentage);setPercentage(0)}}
            >
              Add
            </Button>
        
        </div>
        
        <div className="flex flex-col gap-1 p-3 rounded-md border">
          <span className="font-semibold">Add rows with values</span>
       
            <div className="grid grid-cols-2 gap-1 w-full items-center ">
                <span>Number of rows</span>
              <Input
              min={0}
                type="number"
                placeholder="0"
                className="pl-4 text-xs"
                value={rows||''}
                onChange={(e) => setRows(+e.target.value)}
              />
              <span>Value of each</span>
              <Input
              min={0}
              placeholder="0"
                type="number"
                className="pl-4 text-xs"
                value={rowsValue||''}
                onChange={(e) => setRowsValue(+e.target.value)}
              />
            </div>
      
        
            <Button
                variant={'secondary'}
              className="w-full text-xs mt-auto"
              onClick={() => {addRows(rows,rowsValue);setRows(0); setRowsValue(0)}}
            >
              Add
            </Button>
          
        </div>
        
        <div className="flex flex-col gap-1 p-3 rounded-md border">
          <span className="font-semibold">Add incremental value </span>
      
            <div className="grid grid-cols-2 gap-1 w-full items-center ">
                <span>From</span>
              <Input
              min={0}
                type="number"
                placeholder="day"
                className="pl-4 text-xs"
                value={from ||''}
                onChange={(e) => setFrom(+e.target.value)}
              />
              <span>To</span>
              <Input
              min={0}
                type="number"
                placeholder="day"
                className="pl-4 text-xs"
                value={to || ''}
                onChange={(e) => setTo(+e.target.value)}
              />
              <span>Value</span>
              <Input
              min={0}
                type="number"
                placeholder="0"
                className="pl-4 text-xs"
                value={incrementValue || ''}
                onChange={(e) => setIncrementValue(+e.target.value)}
              />
            </div>
       
     
            <Button
                variant={'secondary'}
              className=" text-xs mt-auto"
              onClick={() => {addIncrement(from,to,incrementValue);setFrom(0);setTo(0);setIncrementValue(0)}}
            >
              Add
            </Button>
     
        </div>
      </div>
    </section>
  );
};

export default Control;
