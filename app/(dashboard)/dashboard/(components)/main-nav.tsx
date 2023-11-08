import React from 'react'
import MainLinks from './main-links'

type Props = {
    
}

const MainNav = (props: Props) => {
  return (
    <div className='h-32 border-b bg-white px-8 xl:px-20 sticky top-0 z-50 w-full'>
<MainLinks />

    </div>
  )
}

export default MainNav