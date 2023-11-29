import prisma from '@/lib/db'

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { cn } from '@/lib/utils'


type Props = {
    bookingId:string
}

const LogsFeed = async({bookingId}: Props) => {

    const logs = await prisma.log.findMany({
        where:{
            bookingId:bookingId
        }
    })



const themes:{[key:string]:string} = {CANCELED:'text-rose-500 bg-rose-500/20',EXPIRED:'text-rose-500 bg-rose-500/20',ACTIVE:'text-green-500 bg-green-500/20',SUCCEEDED:'text-green-500 text-green-500 bg-green-500/20',PENDING:'text-yellow-500 text-yellow-500 bg-yellow-500/20'}
  return (
    <div className='mt-12'>
        <h3 className='text-xl font-bold capitalize'>Logs</h3>


        <Table>

  <TableHeader>
    <TableRow>
      <TableHead >Booking status</TableHead>
      <TableHead>Payment status</TableHead>
      <TableHead>Payed</TableHead>
      <TableHead>Arrival date</TableHead>
      <TableHead>Departure date</TableHead>
      <TableHead>Created at</TableHead>

    </TableRow>
  </TableHeader>
  
  <TableBody>
    
  {logs.map((log)=>  <TableRow key={log.id}>
      <TableCell ><span className={cn('font-semibold rounded-md  p-3 py-2 text-xs ',themes[log.bookingStatus])}>{log.bookingStatus}</span></TableCell>
      <TableCell ><span className={cn('font-semibold rounded-md  p-3 py-2 text-xs ',themes[log.paymentStatus!])}>{log.paymentStatus}</span></TableCell>
      <TableCell>${log.payed}</TableCell>
      <TableCell>{log.arrivalDate.toLocaleDateString()}, {log.arrivalTime}</TableCell>
      <TableCell>{log.departureDate.toLocaleDateString()}, {log.departureTime}</TableCell>
      <TableCell>{log.createdAt.toLocaleString()}</TableCell>
 
    </TableRow>)}
  
  </TableBody>
</Table>
{!logs.length && <span className='text-center py-4 text-neutral-300 font-bold text-xl block '>No logs </span>}
    </div>
  )
}

export default LogsFeed