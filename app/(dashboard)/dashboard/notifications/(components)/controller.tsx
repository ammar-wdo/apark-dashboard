'use client'

import { useRouter } from 'next/navigation'
import React from 'react'

type Props = {list:string}

const Controller = ({list}: Props) => {

    const router = useRouter()



    const handleClick = ()=>{
        router.push(`/dashboard/notifications?list=${+list +1}`)
    }
  return (
    <div onClick={handleClick} className=' py-2 text-blue-500 underline cursor-pointer w-fit text-xs mx-auto'>See more</div>
  )
}

export default Controller