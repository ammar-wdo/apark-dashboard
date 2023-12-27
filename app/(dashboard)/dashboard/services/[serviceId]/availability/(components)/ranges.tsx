'use client'

'use client'

import { calculateParkingDays } from '@/app/api/(public)/services/(helpers)/findParkingDays'
import { Calendar } from '@/components/ui/calendar'
import { Availability } from '@prisma/client'
import { addDays } from 'date-fns'
import { useState } from 'react'
import { DateRange } from 'react-day-picker'



type Props = {
    availabilitys:Availability[]
}

const Ranges = ({availabilitys}: Props) => {
    

  
    
  return (
    <div className='p-4 flex  gap-4 flex-wrap mt-2 '>

<div className="p-3 border rounded-md separate w-full">
    
      <Calendar

        initialFocus
        mode="multiple"
   showOutsideDays={false}
modifiersStyles={{disabled:{backgroundColor:'red',color:'white',borderRadius:0}}}
        numberOfMonths={12}
        disabled={availabilitys.map((el)=>({from:el.startDate,to:el.endDate}))}
        
      />

     
    </div>
    
    



    </div>
  )
}

export default Ranges