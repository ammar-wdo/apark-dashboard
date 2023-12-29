
'use client'
import { NLtimezone } from '@/lib/nl-timezone';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react'

type Props = {
    theDate:Date
}

const DateClientSide = ({theDate}: Props) => {

    console.log(theDate)

    const [mount,setMount]=useState(false)

    useEffect(()=>{setMount(true)},[])

    if(!mount) return null
  return (
    <p className="text-xs text-neutral-500 pt-3 absolute bottom-2 right-3 dark:text-neutral-200">
       {NLtimezone(theDate,'Europe/Amsterdam')}
       
      </p>
  )
}

export default DateClientSide