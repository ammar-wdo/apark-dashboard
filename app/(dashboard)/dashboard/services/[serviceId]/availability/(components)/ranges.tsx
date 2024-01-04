"use client";



import { calculateParkingDays } from "@/app/api/(public)/services/(helpers)/findParkingDays";
import { Calendar } from "@/components/ui/calendar";
import { Availability } from "@prisma/client";
import { addDays } from "date-fns";
import { useState } from "react";
import { DateRange } from "react-day-picker";

type Props = {
  availabilitys: Availability[];
};

const Ranges = ({ availabilitys }: Props) => {
  console.log("availability",availabilitys)
  return (
    <div className="p-4 flex  gap-4 flex-wrap mt-2 ">
      <div className="w-full">
        <Calendar
          initialFocus
          mode="range"
          showOutsideDays={false}
          modifiersStyles={{
            disabled: {
              backgroundColor: "red",
              color: "white",
              opacity: 0.4,
              borderRadius: 0,
            },
          }}
          numberOfMonths={12}
          disabled={availabilitys.map((el) => {
            const from = new Date(el.startDate);
            const to = new Date(el.endDate);
            from.setUTCHours(0, 0, 0, 0);
            to.setUTCHours(0, 0, 0, 0);
            return { from, to };
          })}
        />
      </div>
    </div>
  );
};

export default Ranges;
