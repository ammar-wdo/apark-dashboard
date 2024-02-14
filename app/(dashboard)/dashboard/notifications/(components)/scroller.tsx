'use client'

import { useSearchParams } from 'next/navigation'
import React, { useEffect, useRef } from 'react'

type Props = {}

const Scroller = (props: Props) => {

const searchparams = useSearchParams()
    const scrollerRef = useRef<HTMLDivElement | null>(null)

    
    useEffect(()=>{
      if(!searchparams.get('list')) return
        scrollerRef.current?.scrollIntoView({behavior:'smooth'})
    },[])
  return (

    <div  ref={scrollerRef} />
  )
}

export default Scroller