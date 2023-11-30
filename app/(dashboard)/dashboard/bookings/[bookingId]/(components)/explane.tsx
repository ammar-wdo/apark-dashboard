import { cn } from '@/lib/utils'
import React from 'react'

type Props = {stages:{label:string,description:string,color:string}[],title:string}

const Explane = ({stages,title}: Props) => {
  return (
    <div className="my-4 w-fit">
    <h3 className="font-semibold text-xs ">{title}</h3>
    <div className="flex  gap-1 flex-col mt-2">
    {stages.map(stage=>
  
 


  <div key={stage.label} className={cn(" bg-muted rounded-sm overflow-hidden px-3 py-1",stage.color)}>
  <p className="capitalize text-xs ">{stage.label}</p>
  <p className="text-xs text-muted-foreground">
{stage.description}
  </p>
  </div>

)}
    </div>
 
  </div>
  )
}

export default Explane