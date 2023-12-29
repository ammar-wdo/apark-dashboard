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
import Explane from "./explane";
import { NLtimezone } from "@/lib/nl-timezone";

type Props = {
  bookingId: string;
};

const LogsFeed = async ({ bookingId }: Props) => {
  const logs = await prisma.log.findMany({
    where: {
      bookingId: bookingId,
    },
    orderBy: {
      createdAt: "asc",
    }, 
  });

  const themes: { [key: string]: string } = {
    CANCELED: "text-rose-500 bg-rose-500/20",
    REVERTED: "text-rose-500 bg-rose-500/20",
    EXPIRED: "text-rose-500 bg-rose-500/20",
    ACTIVE: "text-green-500 bg-green-500/20",
    SUCCEEDED: "text-green-500 text-green-500 bg-green-500/20",
    REFUNDED: "text-green-500 text-green-500 bg-green-500/20",
    CREATED: "text-green-500 text-green-500 bg-green-500/20",
    PENDING: "text-yellow-500 text-yellow-500 bg-yellow-500/20",
    UPDATED: "text-green-500 text-green-500 bg-green-500/20",
    UPDATING: "text-yellow-500 text-yellow-500 bg-yellow-500/20",
    REFUND_REQUEST: "text-yellow-500 text-yellow-500 bg-yellow-500/20",
  };



  const stages = [
    {
    label:'created',
    description:'The booking is created',
    color:'border-l-2 border-green-500'
  },
  {
    label:'updated',
    description:'The booking is updated ',
    color:'border-l-2 border-green-500'
  },
    {
    label:'updating',
    description:'The booking is pending to update ',
    color:'border-l-2 border-yellow-500'
  },
  
    {
    label:'reverted',
    description:'The booking is reverted to its previous succeeded status ',
    color:'border-l-2 border-rose-500'
  },
    {
    label:'canceled',
    description:'The booking is canceled ',
    color:'border-l-2 border-rose-500'
  },

]

const paymentStatus = [
  {
  label:'succeeded',
  description:'The payment is made successfully',
  color:'border-l-2 border-green-500'
},
{
  label:'pending',
  description:'The payment is pending ',
  color:'border-l-2 border-yellow-500'
},
  {
  label:'expired',
  description:'The payment checkout was expired and payment failed ',
  color:'border-l-2 border-rose-500'
},

  {
  label:'canceled',
  description:'The payment is canceled and a refund action made',
  color:'border-l-2 border-rose-500'
},

]
const bookingStatus = [
  {
  label:'active',
  description:'The booking is either paid or pending',
  color:'border-l-2 border-green-500'
},
{
  label:'refund request',
  description:'The booking is pending to be refunded ',
  color:'border-l-2 border-yellow-500'
},
  {
  label:'refunded',
  description:'The booking is successfully refunded',
  color:'border-l-2 border-green-500'
},

  {
  label:'canceled',
  description:'The booking is canceled',
  color:'border-l-2 border-rose-500'
},

]
  return (
    <div className="mt-12">
    
    
      <h3 className="text-xl font-bold capitalize mb-4">Logs</h3>
      <div className="flex gap-3">
      <Explane stages={stages} title="Stage" />
      <Explane stages={bookingStatus} title="Booking status" />
      <Explane stages={paymentStatus} title="Payment status" />
      </div>
 

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">Stage</TableHead>
            <TableHead className="text-center">Created at</TableHead>
            <TableHead className="text-center">Arrival date</TableHead>
            <TableHead className="text-center">Departure date</TableHead>
            <TableHead className="text-center">Payed</TableHead>
            <TableHead className="text-center">Parking days</TableHead>

            <TableHead className="text-center">Booking status</TableHead>
            <TableHead className="text-center">Payment status</TableHead>
            <TableHead className="text-center">More info</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell className="text-center">
                {" "}
                <span
                  className={cn(
                    "font-semibold rounded-md  p-3 py-2 text-xs ",
                    themes[log.attempt]
                  )}
                >
                  {log.attempt}
                </span>
              </TableCell>
              <TableCell className="text-center">
                {NLtimezone(log.createdAt,'Europe/Amsterdam')}
              </TableCell>
              <TableCell className="text-center">
                {NLtimezone(log.arrivalDate,'UTC')}
              </TableCell>
              <TableCell className="text-center">
                {NLtimezone(log.departureDate,'UTC')}
              </TableCell>
              <TableCell className="text-center">€{log.payed}</TableCell>
              <TableCell className="text-center">{log.daysofparking}</TableCell>

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
