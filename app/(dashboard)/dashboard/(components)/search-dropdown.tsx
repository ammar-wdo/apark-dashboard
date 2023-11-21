'use client'
import { Service } from '@prisma/client'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useState } from 'react'
import qs from 'query-string'


type Props = {
    services:{id:string,name:string}[],
    searchParams:string
}



const SearchDropdown = ({services,searchParams}: Props) => {


const router = useRouter()
const params = useSearchParams()





const handleClick = useCallback((e:string) => {
  let currentQuery = {};
  
  if (params) {
    currentQuery = qs.parse(params.toString())
  }

  const updatedQuery: any = {
    ...currentQuery,
    service: e
  }

  

  const url = qs.stringifyUrl({
    url: '/dashboard',
    query: updatedQuery
  }, { skipNull: true });

  router.push(url);
}, [ router, params]);

let placeholder 


console.log(searchParams)
  return (
    <Select onValueChange={e=>{handleClick(e)}}>
    <SelectTrigger className="w-[180px]">
      <SelectValue placeholder={services.find((service=>service.id === searchParams))?.name ?? "All"} />
    </SelectTrigger>
    <SelectContent>
    <SelectItem  className='cursor-pointer'  value="all"><button>All</button></SelectItem>
        {services.map(service=> <SelectItem key={service.id} className='cursor-pointer'  value={service.id}>{service.name}</SelectItem>)}
     
   
    </SelectContent>
  </Select>
  )
}

export default SearchDropdown