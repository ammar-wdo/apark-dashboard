import Heading from '@/components/heading'
import React from 'react'
import ReviewsFeed from './(components)/reviews-feed'
import { getCurrentCompany } from '@/lib/helpers'
import ErrorHolder from '../(components)/error-holder'

type Props = {}

const page = async(props: Props) => {
  const company = await getCurrentCompany()
  if (!company)
  return <ErrorHolder/>
  return (
    <div>
        <Heading title='Reviews' description='
Lees uw reviews' />
<div className='separate'>

        <ReviewsFeed />
</div>
    </div>
  )
}

export default page