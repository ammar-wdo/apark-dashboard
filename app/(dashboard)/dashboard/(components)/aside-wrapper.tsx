'use client'


import React from 'react'

type Props = {
    children:React.ReactNode
}

const AsideWraper = ({children}: Props) => {
  return (
    <div className='w-full h-full'>
        {children}
    </div>
  )
}

export default AsideWraper