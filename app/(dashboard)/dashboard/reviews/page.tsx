import Heading from '@/components/heading'
import React from 'react'
import ReviewsFeed from './(components)/reviews-feed'
import { getCurrentCompany } from '@/lib/helpers'

type Props = {}

const page = async(props: Props) => {
  const company = await getCurrentCompany()
if(!company) throw new Error('auth')
  return (
    <div>
        <Heading title='Reviews' description='Read your reviews' />
<div className='separate'>

        <ReviewsFeed />
</div>
    </div>
  )
}

export default page