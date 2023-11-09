import React from 'react'
import MainLinks from './main-links'
import MainSheet from './main-sheet'
import SignoutButton from './signout-button'
import { ModeToggle } from '@/components/theme-toggle'

type Props = {
    
}

const MainNav = (props: Props) => {
  return (
    <div className='h-32 border-b bg-background px-8 xl:px-20 sticky top-0 z-50 w-full flex'>


      <div className='flex items-center gap-4 ml-auto'>
        <SignoutButton />
        <MainSheet />
        <ModeToggle /></div>




    </div>
  )
}

export default MainNav