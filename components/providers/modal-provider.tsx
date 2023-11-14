'use client'

import React, { useEffect, useState } from 'react'
import DeleteModal from '../modals/delete-modal'
import AvailabilityModal from '../modals/availability-modal'
import RuleModal from '../modals/rule-modal'

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
<AvailabilityModal />
<RuleModal />
</>
  )
}

export default ModalProvider