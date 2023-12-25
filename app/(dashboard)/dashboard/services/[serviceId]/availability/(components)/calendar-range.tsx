import { calculateParkingDays } from '@/app/api/(public)/services/(helpers)/findParkingDays'
import { Calendar } from '@/components/ui/calendar'
import { Availability } from '@prisma/client'
import React from 'react'

type Props = {
    availability:Availability
}

const CalendarRange = async({availability}: Props) => {

    const daysOfParking =  calculateParkingDays(availability.startDate,availability.endDate)
  return (
    <div        className='p-3 border rounded-md separate'>
            <p className='p-1 text-center uppercase text-lg font-semibold'>{availability.label}</p>
            <Calendar
 
            initialFocus
            mode="range"
   
            selected={{from:new Date(availability.startDate),to:new Date(availability.endDate)}}
           
            numberOfMonths={2}
          />

          <p className='py-2 text-center text-sm font-semibold text-gray-500'>{daysOfParking} day(s)</p>
        </div>
  )
}

export default CalendarRange