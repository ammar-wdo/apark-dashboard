import React from 'react'
import MainLinks from './main-links'
import Link from 'next/link'

type Props = {}

const MainAside = (props: Props) => {
  return (
    <aside className='bg-primary fixed hidden lg:block lg:w-[350px] min-h-screen'>
      <Link href={'/'}><h3 className='p-12 text-white uppercase text-3xl text-center'>dashboard</h3></Link>
      <MainLinks />

      </aside>
  )
}

export default MainAside