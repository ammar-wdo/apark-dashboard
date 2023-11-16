import React from 'react'

type Props = {
    title:string,
    description:string
}

const Heading = ({title,description}: Props) => {
  return (
    <div className='space-y-2 mb-6'>
        <p className='text-3xl first-letter:uppercase font-bold'>{title}</p>
        <p className='text-sm text-muted-foreground'> {description}</p>
    </div>
  )
}

export default Heading