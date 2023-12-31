'use client'

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
import { LayoutDashboard, Menu } from "lucide-react"


  import React from 'react'
import MainLinks from "./main-links"
import Link from "next/link"
import MainlinksWrapper from "./mainlinks-wrapper"
  
  type Props = {isAdmin:boolean}
  
  const MainSheet = ({isAdmin}: Props) => {
    return (
        <Sheet  >
        <SheetTrigger  className="lg:hidden fixed top-4 right-4"><Menu /></SheetTrigger>
        <SheetContent  side={'left'} className="bg-background p-0 flex flex-col ">
      
          <MainLinks isAdmin={isAdmin} />
        </SheetContent>
      </Sheet>
    )
  }
  
  export default MainSheet