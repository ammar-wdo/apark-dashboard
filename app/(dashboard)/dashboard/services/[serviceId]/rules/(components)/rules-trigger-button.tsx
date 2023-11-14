'use client'

import { Button } from "@/components/ui/button"
import { useModal } from "@/hooks/use-modal"
import { useParams } from "next/navigation"


type Props = {
    
}

const RuleTriggerButton = (props: Props) => {

    const params = useParams()

    const {setOpen} = useModal()
  return (
    <Button onClick={()=>setOpen('rule-modal',{})}>Add Rule</Button>
  )
}

export default RuleTriggerButton