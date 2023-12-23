export const getClientDates = (startDate:string,endDate:string,startTime:string,endTime:string)=>{

    const [startHours, startMinutes] = startTime.split(':');
  const [endHours, endMinutes] = endTime.split(':');
  const clientArrivalDate = new Date(startDate)
  clientArrivalDate.setHours(+startHours)
  clientArrivalDate.setMinutes(+startMinutes)
  const clientDepartureDate = new Date(endDate)
  clientDepartureDate.setHours(+endHours)
  clientDepartureDate.setMinutes(+endMinutes)

  return {clientArrivalDate,clientDepartureDate}


}