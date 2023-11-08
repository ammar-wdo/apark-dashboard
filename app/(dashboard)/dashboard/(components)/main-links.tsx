'use client'

import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"

type Props = {}

const MainLinks = (props: Props) => {

    const pathname = usePathname()

    const myLinks = [ 
        {
            label:'services',
            active: pathname === '/dashboard/services',
            link : '/dashboard/services'
        },
        {
            label:'bookings',
            active: pathname === '/dashboard/bookings',
            link : '/dashboard/bookings'
        },
    ]
  return (
    <div className="w-full flex items-center h-full">

        {myLinks.map((link)=><Link href={link.link} className={cn('text-lg text-zinc-700 uppercase h-full flex items-center px-10',link.active && 'font-bold border-b-2 border-black')}>{link.label}</Link>)}

    </div>
  )
}

export default MainLinks