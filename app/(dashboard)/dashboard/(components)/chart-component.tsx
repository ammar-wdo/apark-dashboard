import { getCurrentCompany } from "@/lib/helpers";
import React from "react";
import { getServices } from "./boxes/(helpers)/get-services";
import { getDailyRevenue } from "./boxes/(helpers)/get-daily-revenue";
import DailyChart from "./boxes/daily-chart";

type Props = { searchParams: string ,entity:string | undefined};

const ChartComponent = async ({ searchParams,entity}: Props) => {
  const company = await getCurrentCompany();

  const { services } = await getServices(searchParams, company?.id as string,entity);

  const chartDate = getDailyRevenue(services!);

  console.log(chartDate);

  return (
    <div className="h-full ">
      
      
      <DailyChart data={chartDate} />
    </div>
  );
};

export default ChartComponent;
