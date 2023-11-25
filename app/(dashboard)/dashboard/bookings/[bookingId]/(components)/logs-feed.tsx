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
console.log(logs)


const themes:{[key:string]:string} = {CANCELED:'text-rose-500',EXPIRED:'text-rose-500',ACTIVE:'text-green-500',SUCCEEDED:'text-green-500'}
  return (
    <div className='mt-12'>
        <h3 className='text-xl font-bold capitalize'>Logs</h3>


        <Table>

  <TableHeader>
    <TableRow>
      <TableHead >Booking status</TableHead>
      <TableHead>Payment status</TableHead>
      <TableHead>Payed</TableHead>

    </TableRow>
  </TableHeader>
  <TableBody>
  {logs.map((log)=>  <TableRow key={log.id}>
      <TableCell className={cn('font-semibold',themes[log.bookingStatus])}>{log.bookingStatus}</TableCell>
      <TableCell className={cn('font-semibold',themes[log.paymentStatus!])}>{log.paymentStatus}</TableCell>
      <TableCell>${log.payed}</TableCell>
 
    </TableRow>)}
  
  </TableBody>
</Table>
    </div>
  )
}

export default LogsFeed