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
    <Table className="w-[650px] border p-2 rounded-sm ">
      <TableHeader>
        <TableRow>
          <TableHead className="flex items-center justify-between"><span>Control</span>{!!previousArray?.length &&<Button  onClick={undo}>Undo</Button>}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow className="">
          <TableCell className="font-semibold">Set all fields to a certain value</TableCell>
          <TableCell className="">
            <Input
              type="number"
              min={0}
              placeholder="0"
              value={resetValue || ''}
              onChange={(e) => setResetValue(+e.target.value)}
            />
          </TableCell>
          <TableCell>
            <Button
              className="w-full text-xs"
              onClick={() => reset(resetValue)}
            >
              Set
            </Button>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-semibold">Add value to each day</TableCell>
          <TableCell>
          <div className="grid grid-cols-2 gap-1  items-center w-60">
                <span>From</span>
              <Input
              min={0}
                type="number"
                placeholder="day"
                className="pl-4"
                value={fromValue ||''}
                onChange={(e) => setFromValue(+e.target.value)}
              />
              <span>To</span>
              <Input
              min={0}
                type="number"
                placeholder="day"
                className="pl-4"
                value={toValue || ''}
                onChange={(e) => setToValue(+e.target.value)}
              />
              <span>Value</span>
            
            <Input
            min={0}
              type="number"
              placeholder="0"
              value={dayValue || ''}
              onChange={(e) => setDayValue(+e.target.value)}
            />
          
              </div>
              </TableCell>
        
          <TableCell>
            <Button
              className="w-full text-xs"
              onClick={() => addValue(dayValue,fromValue,toValue)}
            >
              Add
            </Button>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-semibold">Substract value from each day</TableCell>
          <TableCell>
          <div className="grid grid-cols-2 gap-1  items-center w-60">
                <span>From</span>
              <Input
              min={0}
                type="number"
                placeholder="day"
                className="pl-4"
                value={fromSubstract ||''}
                onChange={(e) => setFromSubstract(+e.target.value)}
              />
              <span>To</span>
              <Input
              min={0}
                type="number"
                placeholder="day"
                className="pl-4"
                value={toSubstract || ''}
                onChange={(e) => setTooSubstract(+e.target.value)}
              />
              <span>Value</span>
            
            <Input
            min={0}
              type="number"
              placeholder="0"
              value={substractValue || ''}
              onChange={(e) => setSubstractValue(+e.target.value)}
            />
          
              </div>
              </TableCell>
        
          <TableCell>
            <Button
              className="w-full text-xs"
              onClick={() => minusValue(substractValue,fromSubstract,toSubstract)}
            >
              Substract
            </Button>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-semibold">Add percentage to each day</TableCell>
         
          <TableCell className="relative flex items-center">
            <span className="absolute left-6 text-xs text-gray-500">%</span>
            <Input
              type="number"
              className="pl-5"
              placeholder="0"
              value={percentage||''}
              onChange={(e) => setPercentage(+e.target.value)}
            />
          </TableCell>
          <TableCell>
            <Button
              className="w-full text-xs"
              onClick={() => addPercentage(percentage)}
            >
              Add
            </Button>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-semibold">Add rows with values</TableCell>
          <TableCell className="">
            <div className="grid grid-cols-2 gap-1  items-center w-60">
                <span>Number of rows</span>
              <Input
              min={0}
                type="number"
                placeholder="0"
                className="pl-4"
                value={rows||''}
                onChange={(e) => setRows(+e.target.value)}
              />
              <span>Value of each</span>
              <Input
              min={0}
              placeholder="0"
                type="number"
                className="pl-4"
                value={rowsValue||''}
                onChange={(e) => setRowsValue(+e.target.value)}
              />
            </div>
          </TableCell>
          <TableCell>
            <Button
              className="w-full text-xs"
              onClick={() => addRows(rows,rowsValue)}
            >
              Add
            </Button>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-semibold">Add incremental value </TableCell>
          <TableCell className="">
            <div className="grid grid-cols-2 gap-1  items-center w-60">
                <span>From</span>
              <Input
              min={0}
                type="number"
                placeholder="day"
                className="pl-4"
                value={from ||''}
                onChange={(e) => setFrom(+e.target.value)}
              />
              <span>To</span>
              <Input
              min={0}
                type="number"
                placeholder="day"
                className="pl-4"
                value={to || ''}
                onChange={(e) => setTo(+e.target.value)}
              />
              <span>Value</span>
              <Input
              min={0}
                type="number"
                placeholder="0"
                className="pl-4"
                value={incrementValue || ''}
                onChange={(e) => setIncrementValue(+e.target.value)}
              />
            </div>
          </TableCell>
          <TableCell>
            <Button
              className="w-full text-xs"
              onClick={() => addIncrement(from,to,incrementValue)}
            >
              Add
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default Control;
