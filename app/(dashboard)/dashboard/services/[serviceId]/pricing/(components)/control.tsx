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
  addValue: (value: number) => void;
  addPercentage: (value: number) => void;
  reset: (value: number) => void;
  addRows: (rows: number, value: number) => void;
  addIncrement:(from:number,to:number,value:number)=>void
};

const Control = ({ addValue, addPercentage, reset, addRows ,addIncrement}: Props) => {
  const [dayValue, setDayValue] = useState(0);
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
          <TableHead className="">Control</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow className="">
          <TableCell className="">Set all fields to a certain value</TableCell>
          <TableCell className="">
            <Input
              type="number"
              min={0}
              value={resetValue}
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
          <TableCell>Add value to each day</TableCell>
          <TableCell>
            <Input
              type="number"
              value={dayValue}
              onChange={(e) => setDayValue(+e.target.value)}
            />
          </TableCell>
          <TableCell>
            <Button
              className="w-full text-xs"
              onClick={() => addValue(dayValue)}
            >
              Add
            </Button>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Add percentage to each day</TableCell>
          <TableCell className="relative flex items-center">
            <span className="absolute left-5 text-xs text-gray-500">%</span>
            <Input
              type="number"
              className="pl-4"
              value={percentage}
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
          <TableCell>Add rows with values</TableCell>
          <TableCell className="">
            <div className="grid grid-cols-2 gap-1  items-center w-60">
                <span>Number of rows</span>
              <Input
              min={0}
                type="number"
                className="pl-4"
                value={rows}
                onChange={(e) => setRows(+e.target.value)}
              />
              <span>Value of each</span>
              <Input
              min={0}
                type="number"
                className="pl-4"
                value={rowsValue}
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
          <TableCell>Add incremental value FROM - TO </TableCell>
          <TableCell className="">
            <div className="grid grid-cols-2 gap-1  items-center w-60">
                <span>From day number</span>
              <Input
              min={0}
                type="number"
                className="pl-4"
                value={from}
                onChange={(e) => setFrom(+e.target.value)}
              />
              <span>To day number</span>
              <Input
              min={0}
                type="number"
                className="pl-4"
                value={to}
                onChange={(e) => setTo(+e.target.value)}
              />
              <span>Value</span>
              <Input
              min={0}
                type="number"
                className="pl-4"
                value={incrementValue}
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
