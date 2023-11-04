'use client'

import React, { useEffect, useState } from 'react'
import DeleteModal from '../modals/delete-modal'

type Props = {}

const ModalProvider = (props: Props) => {

    const [mount, setMount] = useState(false)

    useEffect(()=>{
        setMount(true)
    },[])

    if(!mount) return null
  return (
<>
<DeleteModal />
</>
  )
}

export default ModalProvider