
'use client'
import { format } from 'date-fns';
import React from 'react'

type Props = {
    theDate:Date
}

const DateClientSide = ({theDate}: Props) => {

    const formattedDate = format(new Date(theDate), "EEE, MMM/d, HH:mm");
    console.log(theDate)
  return (
    <p className="text-xs text-neutral-500 pt-3 absolute bottom-2 right-3 dark:text-neutral-200">
        {formattedDate}
      </p>
  )
}

export default DateClientSide