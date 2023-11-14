'use client'

import {
    Dialog,
    DialogContent,

    DialogHeader,
    DialogTitle,
 
  } from "@/components/ui/dialog"
import { useModal } from "@/hooks/use-modal"


  import React, { useState } from 'react'

import AvailabilityForm from "@/app/(dashboard)/dashboard/services/[serviceId]/availability/(components)/availability-form"
import { Button } from "react-day-picker"
  
  type Props = {}
  
  const AvailabilityModal = ({}: Props) => {

    const {open,type,setClose,data} = useModal()
    const isOpen = open && type ==='availability-modal'
  


    return (
        <Dialog open={isOpen} onOpenChange={setClose}>
        
      
        <DialogContent>
        <DialogHeader>
            <DialogTitle>
            Add blocking range
            </DialogTitle>
             
            </DialogHeader>
    <AvailabilityForm/>

   
      
        </DialogContent>
      </Dialog>
    )
  }
  
  export default AvailabilityModal