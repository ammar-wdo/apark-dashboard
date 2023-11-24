import prisma from '@/lib/db'
import React from 'react'

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
  return (
    <div>
        {logs.map((log)=><span key={log.id} className=''>{log.bookingStatus}</span>)}
    </div>
  )
}

export default LogsFeed