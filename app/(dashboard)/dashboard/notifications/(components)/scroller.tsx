'use client'

import React, { useEffect, useRef } from 'react'

type Props = {}

const Scroller = (props: Props) => {


    const scrollerRef = useRef<HTMLDivElement | null>(null)
    useEffect(()=>{
        scrollerRef.current?.scrollIntoView({behavior:'smooth'})
    },[])
  return (

    <div  ref={scrollerRef} />
  )
}

export default Scroller