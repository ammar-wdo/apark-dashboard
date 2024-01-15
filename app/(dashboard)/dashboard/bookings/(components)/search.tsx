'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

type Props = {}

const Search = (props: Props) => {

    const router = useRouter()
    const [query, setQuery] = useState('')
  return (
    <div className='flex items-center gap-1'>
        <Input className='placeholder:text-xs' placeholder='Search by Booking code' value={query} onChange={(e)=>setQuery(e.target.value)} />
        <Button disabled={!query} onClick={()=>query && router.push(`/dashboard/bookings?bookingCode=${query}`)} variant={'default'}>Search</Button>
        <Button onClick={()=>{router.push('/dashboard/bookings');setQuery('')}} variant={'secondary'}>Reset</Button>
    </div>
  )
}

export default Search