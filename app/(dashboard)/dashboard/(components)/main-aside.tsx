import React from 'react'
import MainLinks from './main-links'
import Link from 'next/link'
import { LayoutDashboard } from 'lucide-react'

type Props = {}

const MainAside = (props: Props) => {
  return (
    <aside className=' border-r fixed hidden lg:block lg:w-[350px] min-h-screen'>
      <Link href={'/'}><h3 className='p-12 text-foreground uppercase text-3xl text-center flex items-center'><LayoutDashboard className='h-6 w-6 mr-3' /> dashboard</h3></Link>
      <MainLinks />

      </aside>
  )
}

export default MainAside