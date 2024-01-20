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

  const strings :{ [key: string]: string }= {
    CANCELED: "Geannuleerd",
    REVERTED: "Teruggekeerd",
    EXPIRED: "Verlopen",
    ACTIVE: "Actief",
    SUCCEEDED: "Geslaagd",
    REFUNDED: "Terugbetaald",
    CREATED: "Gemaakt",
    PENDING: "In Behandeling",
    UPDATED: "Bijgewerkt",
    UPDATING: "Bijwerken",
    REFUND_REQUEST: "Verzoek om teruggave",
   
  }



  const stages = [
    {
    label:'Gemaakt',
    description:'De boeking is gemaakt.',
    color:'border-l-2 border-green-500'
  },
  {
    label:'Bijgewerkt',
    description:'De boeking is bijgewerkt. ',
    color:'border-l-2 border-green-500'
  },
    {
    label:'Bijwerken',
    description:'De boeking wacht op bijwerking.',
    color:'border-l-2 border-yellow-500'
  },
  
    {
    label:'Teruggekeerd',
    description:'De boeking is teruggezet naar de vorige geslaagde status.',
    color:'border-l-2 border-rose-500'
  },
    {
    label:'geannuleerd',
    description:'De boeking is geannuleerd.',
    color:'border-l-2 border-rose-500'
  },

]

const paymentStatus = [
  {
  label:'Geslaagd',
  description:'De betaling is succesvol uitgevoerd.',
  color:'border-l-2 border-green-500'
},
{
  label:'In Behandeling',
  description:'De betaling is in behandeling.',
  color:'border-l-2 border-yellow-500'
},
  {
  label:'Verlopen',
  description:'De betaalcheckout is verlopen en de betaling is mislukt.',
  color:'border-l-2 border-rose-500'
},

  {
  label:'Geannuleerd',
  description:'De betaling is geannuleerd en er is een terugbetalingsactie uitgevoerd.',
  color:'border-l-2 border-rose-500'
},

]
const bookingStatus = [
  {
  label:'Actief',
  description:'De boeking is betaald of in behandeling.',
  color:'border-l-2 border-green-500'
},
{
  label:'Verzoek om teruggave',
  description:'De boeking wacht op terugbetaling. ',
  color:'border-l-2 border-yellow-500'
},
  {
  label:'Terugbetaald',
  description:'De boeking is succesvol terugbetaald.',
  color:'border-l-2 border-green-500'
},

  {
  label:'Geannuleerd',
  description:'De boeking is geannuleerd.',
  color:'border-l-2 border-rose-500'
},

]
  return (
    <div className="mt-12">
    
    
      <h3 className="text-xl font-bold capitalize mb-4">Logboek</h3>
      <div className="flex gap-3">
      <Explane stages={stages} title="Fase" />
      <Explane stages={bookingStatus} title="Reservering status" />
      <Explane stages={paymentStatus} title="Betaal status" />
      </div>
 

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">Fase</TableHead>
            <TableHead className="text-center">Gemaakt op</TableHead>
            <TableHead className="text-center">Aankomstdatum</TableHead>
            <TableHead className="text-center">Vertrekdatum</TableHead>
            <TableHead className="text-center">Betaald</TableHead>
            <TableHead className="text-center">Parkeer dagen</TableHead>

            <TableHead className="text-center">Reservering status</TableHead>
            <TableHead className="text-center">Betaal status</TableHead>
            <TableHead className="text-center">Meer info</TableHead>
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
                  {strings[log.attempt]}
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
              <TableCell className="text-center">€{log.payed.toFixed(2)}</TableCell>
              <TableCell className="text-center">{log.daysofparking}</TableCell>

              <TableCell className="text-center">
                <span
                  className={cn(
                    "font-semibold rounded-md  p-3 py-2 text-xs ",
                    themes[log.bookingStatus]
                  )}
                >
                  {strings[log.bookingStatus]}
                </span>
              </TableCell>
              <TableCell className="text-center">
                <span
                  className={cn(
                    "font-semibold rounded-md  p-3 py-2 text-xs ",
                    themes[log.paymentStatus!]
                  )}
                >
                  {strings[log.paymentStatus as string]}
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
