'use client'

import {
    Dialog,
    DialogContent,

    DialogHeader,
    DialogTitle,
 
  } from "@/components/ui/dialog"
import { useModal } from "@/hooks/use-modal"


  import React, { useState } from 'react'

import RulesForm from "@/app/(dashboard)/dashboard/services/[serviceId]/rules/(components)/rules-form"
  
  type Props = {}
  
  const RuleModal = ({}: Props) => {

    const {open,type,setClose,data} = useModal()
    const isOpen = open && type ==='rule-modal'
  


    return (
        <Dialog open={isOpen} onOpenChange={setClose}>
        
      
        <DialogContent>
        <DialogHeader>
            <DialogTitle>
            Add a Rule
            </DialogTitle>
             
            </DialogHeader>
    <RulesForm />

   
      
        </DialogContent>
      </Dialog>
    )
  }
  
  export default RuleModal