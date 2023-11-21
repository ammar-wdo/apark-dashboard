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
    entities:{id:string,entityName:string}[],
    searchParams:string
}



const SearchEntityDropdown = ({entities,searchParams}: Props) => {


const router = useRouter()


const params = useSearchParams()



 const handleClick = useCallback((e:string) => {
    let currentQuery = {};
    
    if (params) {
      currentQuery = qs.parse(params.toString())
    }

    const updatedQuery: any = {
      ...currentQuery,
      entity: e,
      service:"all"
    }

    

    const url = qs.stringifyUrl({
      url: '/dashboard',
      query: updatedQuery
    }, { skipNull: true });

    router.push(url);
  
  }, [ router, params]);


  return (
    <Select onValueChange={e=>{handleClick(e)}}>
    <SelectTrigger className="w-[180px]">
      <SelectValue placeholder={entities.find((entity=>entity.id === searchParams))?.entityName ?? "All"} />
    </SelectTrigger>
    <SelectContent>
    <SelectItem  className='cursor-pointer'  value="all"><button>All</button></SelectItem>
        {entities.map(entity=> <SelectItem key={entity.id} className='cursor-pointer'  value={entity.id}>{entity.entityName}</SelectItem>)}
     
   
    </SelectContent>
  </Select>
  )
}

export default SearchEntityDropdown