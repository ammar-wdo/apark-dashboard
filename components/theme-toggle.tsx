"use client"

import * as React from "react"

import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { MoonIcon, SunIcon } from "lucide-react"


export function ModeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="mt-auto" asChild>
        <button className='link'>
        <SunIcon className="h-[1.2rem] w-[1.2rem] mr-2 transition-all dark:-rotate-90 dark:hidden" />  <p className="dark:hidden">Light mode</p> 
        <MoonIcon className=" h-[1.2rem] w-[1.2rem] mr-2  transition-all hidden dark:inline-block" />  <p className="hidden dark:block">Dark mode</p> 
          <span className="sr-only">Toggle theme</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[200px]" align="end">
        <DropdownMenuItem className="flex items-center gap-4 w-full cursor-pointer" onClick={() => setTheme("light")}>
         <span>Light</span>    <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center gap-4 w-full cursor-pointer"  onClick={() => setTheme("dark")}>
          <span>Dark</span> <MoonIcon className=" h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </DropdownMenuItem >
       
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
