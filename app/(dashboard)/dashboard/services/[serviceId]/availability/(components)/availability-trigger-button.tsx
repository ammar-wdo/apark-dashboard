'use client'

import { Button } from "@/components/ui/button"
import { useModal } from "@/hooks/use-modal"
import { useParams } from "next/navigation"


type Props = {
    
}

const AvailabilityTriggerButton = (props: Props) => {

    const params = useParams()

    const {setOpen} = useModal()
  return (
    <Button onClick={()=>setOpen('availability-modal',{metaDate:params.serviceid as string})}>Toevoegen</Button>
  )
}

export default AvailabilityTriggerButton