'use client'

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
import { Menu } from "lucide-react"


  import React from 'react'
  
  type Props = {}
  
  const MainSheet = (props: Props) => {
    return (
        <Sheet  >
        <SheetTrigger  className="lg:hidden ml-auto"><Menu /></SheetTrigger>
        <SheetContent style={{color:"white"}} side={'left'} className="bg-zinc-800">
          <SheetHeader className="">
            <SheetTitle className="text-white">Are you sure absolutely sure?</SheetTitle>
            <SheetDescription className="text-muted-foreground">
              This action cannot be undone. This will permanently delete your account
              and remove your data from our servers.
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    )
  }
  
  export default MainSheet