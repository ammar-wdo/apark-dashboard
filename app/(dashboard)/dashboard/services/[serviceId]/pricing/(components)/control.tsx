'use client'

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { usePricing } from "../pricing.hook"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

type Props = {addValue:(value:number)=>void
addPercentage:(value:number)=>void,
reset:(value:number)=>void
}

const Control = ({addValue,addPercentage,reset}: Props) => {
const [dayValue, setDayValue]=useState(0)
const [percentage, setPercentage]=useState(0)
const [resetValue, setResetValue]=useState(0)
  
  return (
<Table className="w-fit border p-2 rounded-sm">
 
  <TableHeader>
    <TableRow>
      <TableHead className="">Control</TableHead>
    
    </TableRow>
  </TableHeader>
  <TableBody>
  <TableRow>
      <TableCell >Set all fields to a certain value</TableCell>
      <TableCell className=""><Input type="number" min={0} value={resetValue} onChange={e=>setResetValue(+e.target.value)} /></TableCell>
      <TableCell><Button className="w-full text-xs"  onClick={()=>reset(resetValue)}>Reset</Button></TableCell>
      
    </TableRow>
    <TableRow>
      <TableCell >Add value to each day</TableCell>
      <TableCell><Input type="number"  value={dayValue} onChange={e=>setDayValue(+e.target.value)} /></TableCell>
      <TableCell><Button className="w-full text-xs"  onClick={()=>addValue(dayValue)}>Add</Button></TableCell>
      
    </TableRow>
    <TableRow>
      <TableCell >Add percentage to each day</TableCell>
      <TableCell className="relative flex items-center"><span className="absolute left-5 text-xs text-gray-500">%</span><Input type="number" className="pl-4" value={percentage} onChange={e=>setPercentage(+e.target.value)} /></TableCell>
      <TableCell><Button  className="w-full text-xs" onClick={()=>addPercentage(percentage)}>Add</Button></TableCell>
      
    </TableRow>
  
  </TableBody>
</Table>
  )
}

export default Control