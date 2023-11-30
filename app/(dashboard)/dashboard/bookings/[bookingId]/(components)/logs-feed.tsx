import prisma from "@/lib/db";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

import { HelpCircle } from "lucide-react";
import ActionToolTip from "@/components/tool-tip";

type Props = {
  bookingId: string;
};

const LogsFeed = async ({ bookingId }: Props) => {
  const logs = await prisma.log.findMany({
    where: {
      bookingId: bookingId,
    },orderBy:{
      createdAt:'desc'
    }
  });

  const themes: { [key: string]: string } = {
    CANCELED: "text-rose-500 bg-rose-500/20",
    EXPIRED: "text-rose-500 bg-rose-500/20",
    ACTIVE: "text-green-500 bg-green-500/20",
    SUCCEEDED: "text-green-500 text-green-500 bg-green-500/20",
    PENDING: "text-yellow-500 text-yellow-500 bg-yellow-500/20",
  };
  return (
    <div className="mt-12">
      <h3 className="text-xl font-bold capitalize mb-4">Logs</h3>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">Created at</TableHead>
            <TableHead className="text-center">Arrival date</TableHead>
            <TableHead className="text-center">Departure date</TableHead>
            <TableHead className="text-center">Payed</TableHead>
            <TableHead className="text-center">Parking days</TableHead>
            <TableHead className="text-center">Attempt</TableHead>
            <TableHead className="text-center">Booking status</TableHead>
            <TableHead className="text-center">Payment status</TableHead>
            <TableHead className="text-center">More info</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell className="text-center">
                {format(log.createdAt, "dd-MM-yyyy,  HH:mm:ss")}
              </TableCell>
              <TableCell className="text-center">
                {format(log.arrivalDate, "dd-MM-yyyy")}, {log.arrivalTime}
              </TableCell>
              <TableCell className="text-center">
                {format(log.departureDate, "dd-MM-yyyy")}, {log.departureTime}
              </TableCell>
              <TableCell className="text-center">€{log.payed}</TableCell>
              <TableCell className="text-center">{log.daysofparking}</TableCell>
              <TableCell className="text-center">{log.attempt}</TableCell>
              <TableCell className="text-center">
                <span
                  className={cn(
                    "font-semibold rounded-md  p-3 py-2 text-xs ",
                    themes[log.bookingStatus]
                  )}
                >
                  {log.bookingStatus}
                </span>
              </TableCell>
              <TableCell className="text-center">
                <span
                  className={cn(
                    "font-semibold rounded-md  p-3 py-2 text-xs ",
                    themes[log.paymentStatus!]
                  )}
                >
                  {log.paymentStatus}
                </span>
              </TableCell>
              <TableCell className="text-center">
                <ActionToolTip title={log.message} side="top">
                  <HelpCircle className="block mx-auto w-5 h-5 cursor-pointer text-indigo-500" />
                </ActionToolTip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {!logs.length && (
        <span className="text-center py-4 text-neutral-300 font-bold text-xl block ">
          No logs{" "}
        </span>
      )}
    </div>
  );
};

export default LogsFeed;
