'use client'

'use client'

import { calculateParkingDays } from '@/app/api/(public)/services/(helpers)/findParkingDays'
import { Calendar } from '@/components/ui/calendar'
import { Availability } from '@prisma/client'
import { addDays } from 'date-fns'
import { useState } from 'react'
import { DateRange } from 'react-day-picker'
import CalendarRange from './calendar-range'


type Props = {
    availabilitys:Availability[]
}

const Ranges = ({availabilitys}: Props) => {
    

    if(!availabilitys.length) return <h3 className='text-center text-gray-500 capitalize font-semibold text-2xl p-20'>No ranges added</h3>
    
  return (
    <div className='p-4 flex  gap-4 flex-wrap mt-2 '>
    
        {availabilitys.map((el)=>(<CalendarRange key={el.id} availability={el} />))}



    </div>
  )
}

export default Ranges