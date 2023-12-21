"use client";

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"




  import React, { useEffect, useState } from 'react'
  
  type Props = {
    children:React.ReactNode,
    title:string,
    header?:string
    side?:"top" | "right" | "bottom" | "left" | undefined
  }
  
  const ActionToolTip = ({children,title,side,header}: Props) => {

    const [mount,setMount] = useState(false)
    useEffect(()=>{
        setMount(true)
    },[])

    if(!mount) return null
    return (
        <TooltipProvider>
        <Tooltip delayDuration={150} >
          <TooltipTrigger asChild>
            {children}
          </TooltipTrigger>
          <TooltipContent side={side} align="start" sideOffset={7} className="bg-secondary-foreground text-secondary">
            {header && <h3 className="font-bold mb-1">{header}</h3>}
            <p className=" text-xs capitalize max-w-[160px]">
              {title}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }
  
  export default ActionToolTip