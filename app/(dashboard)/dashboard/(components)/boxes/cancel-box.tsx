import React from 'react'
import Box from './box'
import { CircleSlash } from 'lucide-react'

type Props = {
    searchParams:string
}

const CancelBox = ({searchParams}: Props) => {
  return (
 <Box title='Total cancelation' footer='For this month' Icon={<CircleSlash className='w-7 h-7 text-neutral-500' />} value={'7'} />
  )
}

export default CancelBox