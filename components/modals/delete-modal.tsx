'use client'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
 
  } from "@/components/ui/dialog"
import { useModal } from "@/hooks/use-modal"


  import React, { useState } from 'react'
import { Button } from "../ui/button"
import { toast } from "../ui/use-toast"
import { Loader } from "lucide-react"
import axios from "axios"
import { useParams, useRouter } from "next/navigation"
  
  type Props = {}
  
  const DeleteModal = (props: Props) => {

    const {open,type,setClose,data} = useModal()
    const isOpen = open && type ==='delete-modal'
    const [isLoading, setIsLoading] = useState(false)

const router = useRouter()
const params = useParams()
    const handleDelete = async()=>{
        try {
            setIsLoading(true)
            await axios.delete(data.url!)
            router.push(`/dashboard/services`)
            router.refresh()
            setClose()
            toast({
                title: "Success",
                description: "Item is deleted successfully",
                
              });
            
        } catch (error) {
            toast({
                title: "Error",
                description: "Something went wrong",
                variant: "destructive",
              });
        }finally{
            setIsLoading(false)
        }
    }
    return (
        <Dialog open={isOpen} onOpenChange={setClose}>
      
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete  from our servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-3 justify-end">


   <Button disabled={isLoading} onClick={handleDelete} variant={'destructive'}>Delete {isLoading&&<Loader className="animate-spin w-3 h-3 ml-3"/>}</Button>
   <Button disabled={isLoading} onClick={setClose} >Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }
  
  export default DeleteModal