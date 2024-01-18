import React from 'react'
import Box from './box'
import { CircleSlash } from 'lucide-react'
import { getServices } from './(helpers)/get-services'
import { getCurrentCompany } from '@/lib/helpers'
import { getTotal } from './(helpers)/get-total'

type Props = {
    searchParams:string,
    entity:string | undefined
}

const CancelBox = async({searchParams,entity}: Props) => {


  const company = await  getCurrentCompany()

  const {services} = await getServices(searchParams,company?.id as string,entity)

  const {monthlyCanceledBookings} = getTotal(services!)
  return (
 <Box title='Totale annuleringen' footer='Deze maand' Icon={<CircleSlash className='w-7 h-7 text-neutral-500' />} value={monthlyCanceledBookings} />
  )
}

export default CancelBox