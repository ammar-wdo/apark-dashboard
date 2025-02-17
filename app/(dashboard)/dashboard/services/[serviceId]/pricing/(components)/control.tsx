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
import { MutableRefObject, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { boolean } from "zod";
import { XIcon } from "lucide-react";

type Props = {
  save: boolean;
  setSaveFn: (val: boolean) => void;
  addValue: (value: number, from: number, to: number) => void;
  minusValue: (value: number, from: number, to: number) => void;
  addPercentage: (value: number) => void;
  reset: (value: number) => void;
  addRows: (rows: number, value: number) => void;
  addIncrement: (from: number, to: number, value: number) => void;
};

const Control = ({
  addValue,
  addPercentage,
  reset,
  addRows,
  addIncrement,
  minusValue,
  save,
  setSaveFn,
}: Props) => {
  const [dayValue, setDayValue] = useState(0);
  const [fromValue, setFromValue] = useState(0);
  const [toValue, setToValue] = useState(0);
  const [substractValue, setSubstractValue] = useState(0);
  const [fromSubstract, setFromSubstract] = useState(0);
  const [toSubstract, setTooSubstract] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [resetValue, setResetValue] = useState(0);
  const [rows, setRows] = useState(0);
  const [rowsValue, setRowsValue] = useState(0);

  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(0);
  const [incrementValue, setIncrementValue] = useState(0);

  return (
    <section className=" p-3 rounded-sm  text-xs">
      {save && (
        <div className="items-center flex gap-12 justify-between border-orange-500 bg-orange-500/25 p-4 mb-12 rounded-lg">
          <h3 className="text-orange-500">Vergeet niet de wijzigingen op te slaan</h3>{" "}
          <XIcon className="cursor-pointer text-orange-500" onClick={()=>setSaveFn(false)}/>
        </div>
      )}
      <div className="flex items-center justify-between ">
        <span className="font-bold text-lg">Aanpassen</span>
      </div>

      <div className="grid grid-col-1 md:grid-cols-2 gap-2 mt-4 group">
        <div className="flex flex-col gap-1 p-3 rounded-md border md:group-hover:hover:scale-[1.01] hover:shadow-md transition bg-background group-hover:scale-95 group-hover:opacity-60 group-hover:hover:opacity-100">
          <span className="font-semibold">Vaste prijs voor iedere dag</span>

          <Input
            type="number"
            className="text-xs"
            min={0}
            placeholder="0"
            value={resetValue || ""}
            onChange={(e) => setResetValue(+e.target.value)}
          />

          <Button
            variant={"secondary"}
            className=" text-xs mt-auto"
            onClick={() => {
              reset(resetValue);
              setResetValue(0);
            }}
          >
            Toevoegen
          </Button>
        </div>

        <div className="flex flex-col gap-1 p-3 rounded-md border md:group-hover:hover:scale-[1.01] group-hover:opacity-60 group-hover:hover:opacity-100 hover:shadow-md transition bg-background group-hover:scale-95">
          <span className="font-semibold">Prijs per dag toevoegen</span>

          <div className="grid grid-cols-2 gap-1 w-full  items-center ">
            <span>Van</span>
            <Input
              min={0}
              type="number"
              placeholder="day"
              className="pl-4 text-xs"
              value={fromValue || ""}
              onChange={(e) => setFromValue(+e.target.value)}
            />
            <span>Naar</span>
            <Input
              min={0}
              type="number"
              placeholder="day"
              className="pl-4 text-xs"
              value={toValue || ""}
              onChange={(e) => setToValue(+e.target.value)}
            />
            <span>Waarde</span>

            <Input
              min={0}
              type="number"
              className="text-xs"
              placeholder="0"
              value={dayValue || ""}
              onChange={(e) => setDayValue(+e.target.value)}
            />
          </div>

          <Button
            variant={"secondary"}
            className=" text-xs mt-auto"
            onClick={() => {
              addValue(dayValue, fromValue, toValue);
              setFromValue(0);
              setToValue(0);
              setDayValue(0);
            }}
          >
            Toevoegen
          </Button>
        </div>

        <div className="flex flex-col gap-1 p-3 rounded-md border md:group-hover:hover:scale-[1.01] group-hover:opacity-60 group-hover:hover:opacity-100 hover:shadow-md transition bg-background group-hover:scale-95">
          <span className="font-semibold">waarde aftrekken van elke dag</span>

          <div className="grid grid-cols-2 gap-1 w-full items-center ">
            <span>Van</span>
            <Input
              min={0}
              type="number"
              placeholder="day"
              className="pl-4 text-xs"
              value={fromSubstract || ""}
              onChange={(e) => setFromSubstract(+e.target.value)}
            />
            <span>Naar</span>
            <Input
              min={0}
              type="number"
              placeholder="day"
              className="pl-4 text-xs"
              value={toSubstract || ""}
              onChange={(e) => setTooSubstract(+e.target.value)}
            />
            <span>Waarde</span>

            <Input
              min={0}
              type="number"
              className="text-xs"
              placeholder="0"
              value={substractValue || ""}
              onChange={(e) => setSubstractValue(+e.target.value)}
            />
          </div>

          <Button
            variant={"secondary"}
            className=" text-xs mt-auto"
            onClick={() => {
              minusValue(substractValue, fromSubstract, toSubstract);
              setFromSubstract(0);
              setTooSubstract(0);
              setSubstractValue(0);
            }}
          >
            Aftrekken
          </Button>
        </div>

        <div className="flex flex-col gap-1 p-3 rounded-md border md:group-hover:hover:scale-[1.01] group-hover:opacity-60 group-hover:hover:opacity-100 hover:shadow-md transition bg-background group-hover:scale-95">
          <span className="font-semibold">
            Voeg percentage toe aan elke dag
          </span>

          <div className="relative flex items-center">
            <span className="absolute left-2 text-xs text-gray-500">%</span>
            <Input
              type="number"
              className="pl-5 text-xs"
              placeholder="0"
              value={percentage || ""}
              onChange={(e) => setPercentage(+e.target.value)}
            />
          </div>

          <Button
            variant={"secondary"}
            className=" text-xs mt-auto"
            onClick={() => {
              addPercentage(percentage);
              setPercentage(0);
            }}
          >
            Toevoegen
          </Button>
        </div>

        <div className="flex flex-col gap-1 p-3 rounded-md border md:group-hover:hover:scale-[1.01] group-hover:opacity-60 group-hover:hover:opacity-100 hover:shadow-md transition bg-background group-hover:scale-95">
          <span className="font-semibold">Rijen toevoegen met waarden</span>

          <div className="grid grid-cols-2 gap-1 w-full items-center ">
            <span>Aantal rijen</span>
            <Input
              min={0}
              type="number"
              placeholder="0"
              className="pl-4 text-xs"
              value={rows || ""}
              onChange={(e) => setRows(+e.target.value)}
            />
            <span>Waarde van elk</span>
            <Input
              min={0}
              placeholder="0"
              type="number"
              className="pl-4 text-xs"
              value={rowsValue || ""}
              onChange={(e) => setRowsValue(+e.target.value)}
            />
          </div>

          <Button
            variant={"secondary"}
            className="w-full text-xs mt-auto"
            onClick={() => {
              addRows(rows, rowsValue);
              setRows(0);
              setRowsValue(0);
            }}
          >
            Toevoegen
          </Button>
        </div>

        <div className="flex flex-col gap-1 p-3 rounded-md border md:group-hover:hover:scale-[1.01] group-hover:opacity-60 group-hover:hover:opacity-100 hover:shadow-md transition bg-background group-hover:scale-95">
          <span className="font-semibold">Voeg toenemend waarde toe </span>

          <div className="grid grid-cols-2 gap-1 w-full items-center ">
            <span>Van</span>
            <Input
              min={0}
              type="number"
              placeholder="day"
              className="pl-4 text-xs"
              value={from || ""}
              onChange={(e) => setFrom(+e.target.value)}
            />
            <span>Naar</span>
            <Input
              min={0}
              type="number"
              placeholder="day"
              className="pl-4 text-xs"
              value={to || ""}
              onChange={(e) => setTo(+e.target.value)}
            />
            <span>Waarde</span>
            <Input
              min={0}
              type="number"
              placeholder="0"
              className="pl-4 text-xs"
              value={incrementValue || ""}
              onChange={(e) => setIncrementValue(+e.target.value)}
            />
          </div>

          <Button
            variant={"secondary"}
            className=" text-xs mt-auto"
            onClick={() => {
              addIncrement(from, to, incrementValue);
              setFrom(0);
              setTo(0);
              setIncrementValue(0);
            }}
          >
            Toevoegen
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Control;
