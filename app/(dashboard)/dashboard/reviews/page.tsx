import Heading from '@/components/heading'
import React from 'react'
import ReviewsFeed from './(components)/reviews-feed'

type Props = {}

const page = (props: Props) => {
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