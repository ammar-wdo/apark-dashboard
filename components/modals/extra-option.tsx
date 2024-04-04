'use client'



import ExtraForm from "@/app/(dashboard)/dashboard/services/[serviceId]/extra-options/(components)/extra-form"
import {
    Dialog,
    DialogContent,

    DialogHeader,
    DialogTitle,
 
  } from "@/components/ui/dialog"
import { useModal } from "@/hooks/use-modal"


  import React, { useState } from 'react'


  
  type Props = {}
  
  const ExtraOption = ({}: Props) => {

    const {open,type,setClose,data} = useModal()
    const isOpen = open && type ==='extra-option'
  


    return (
        <Dialog open={isOpen} onOpenChange={setClose}>
        
      
        <DialogContent>
        <DialogHeader>
            <DialogTitle>
            Voeg een optie toe
            </DialogTitle>
             <ExtraForm />
            </DialogHeader>


   
      
        </DialogContent>
      </Dialog>
    )
  }
  
  export default ExtraOption