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
  
  type Props = {}
  
  const MainSheet = (props: Props) => {
    return (
        <Sheet  >
        <SheetTrigger  className="lg:hidden ml-auto"><Menu /></SheetTrigger>
        <SheetContent  side={'left'} className="bg-background p-0">
          <SheetHeader className="">
          <Link href={'/'}><h3 className='p-12 text-foreground uppercase text-3xl text-center flex items-center'><LayoutDashboard className='h-6 w-6 mr-3' /> dashboard</h3></Link>
           
          </SheetHeader>
          <MainLinks />
        </SheetContent>
      </Sheet>
    )
  }
  
  export default MainSheet