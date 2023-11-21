import React from 'react'
import MainLinks from './main-links'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'

type Props = {}

const MainlinksWrapper = async(props: Props) => {

    const session = await getServerSession(authOptions)
  return (
    <MainLinks isAdmin = {session?.user?.name==="Company"} />
  )
}

export default MainlinksWrapper