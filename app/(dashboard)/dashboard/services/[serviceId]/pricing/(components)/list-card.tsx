'use client'

import { deleteList } from '@/actions/list-actions'
import { Button } from '@/components/ui/button'
import { useModal } from '@/hooks/use-modal'
import { List } from '@prisma/client'
import { Delete, Edit } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

type Props = {list:List,serviceId:string}

const ListCard = ({list,serviceId}: Props) => {
    const {setOpen} = useModal()
  return (
    <div key={list.id} className="border p-8 rounded-md bg-white hover:shadow-lg transition">
    <p className="text-muted-foreground text-xl capitalize font-bold">{list.label || "No Label"}</p>
    <p>Start Date: {list.startDate.toLocaleDateString()}</p>
    <p>End Date: {list.endDate.toLocaleDateString()}</p>
    <div className="mt-4 flex items-center gap-3">
      <Button asChild><Link href={`/dashboard/services/${serviceId}/pricing/${list.id}`} className="flex items-center gap-3 "><Edit size={20}/>Edit</Link></Button>
      <Button onClick={()=>setOpen('delete-modal',{deleteFn:()=>deleteList(serviceId,list.id)})} variant={'destructive'}><Delete className='mr-3' /> Delete</Button>
      </div>
  </div>
  )
}

export default ListCard