'use client'

import { Button } from '@/components/ui/button'
import { useModal } from '@/hooks/use-modal'
import React from 'react'

type Props = {}

const ExtraButton = (props: Props) => {

    const {setOpen} = useModal()
  return (
    <Button onClick={()=>setOpen('extra-option')}>Add option</Button>
  )
}

export default ExtraButton