import React from 'react'
import MainLinks from './main-links'
import Link from 'next/link'
import { LayoutDashboard } from 'lucide-react'
import MainlinksWrapper from './mainlinks-wrapper'

type Props = {}

const MainAside = (props: Props) => {
  return (
    <aside className=' border-r fixed hidden lg:flex flex-col lg:w-[270px] min-h-screen pb-12'>
     
     <MainlinksWrapper />

      </aside>
  )
}

export default MainAside