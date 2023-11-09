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
import MainLinks from "./main-links"
import Link from "next/link"
  
  type Props = {}
  
  const MainSheet = (props: Props) => {
    return (
        <Sheet  >
        <SheetTrigger  className="lg:hidden ml-auto"><Menu /></SheetTrigger>
        <SheetContent style={{color:"white"}} side={'left'} className="bg-background p-0">
          <SheetHeader className="">
            <Link href={'/'}><SheetTitle className="p-12 text-foreground uppercase text-3xl text-center' ">Dashboard</SheetTitle></Link>
           
          </SheetHeader>
          <MainLinks />
        </SheetContent>
      </Sheet>
    )
  }
  
  export default MainSheet