'use client'

import { useEffect } from "react"
import { useNotificationsQuery } from "../notifications.hook"

type Props = {}

const Revalidator = (props: Props) => {

    const {queryClient,data} = useNotificationsQuery()

    

    useEffect(()=>{
        queryClient.invalidateQueries({queryKey:["notifications"]})
    },[queryClient])
  return <div/>
}

export default Revalidator