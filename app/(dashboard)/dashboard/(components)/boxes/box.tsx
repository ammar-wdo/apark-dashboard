import { title } from 'process'
import React from 'react'

type Props = {
    title:string,
    Icon:React.ReactNode,
    value:string | number
    dollar?:boolean
    footer:string
}

const Box = ({Icon,value,title,dollar,footer}: Props) => {
  return (
    <div className='border rounded-xl  p-6 h-[175px]'>
    <div className='flex items-center justify-between'>
    <p>{title}</p>
    <p>{Icon}</p>
    </div>
    <div className='mt-8'>
        <p className='font-bold text-2xl'>{dollar && "€" }{value}</p>
        <p className='font-light text-xs text-neutral-500'>{footer}</p>
    </div>
   

</div>
  )
}

export default Box