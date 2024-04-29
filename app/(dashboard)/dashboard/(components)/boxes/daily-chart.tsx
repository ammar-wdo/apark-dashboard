
'use client'
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


type Props = {
    data?:{day:number,revenue:number}[]
    bookingsPerDay?:{name:string,total:number}[]
}

const DailyChart = ({data,bookingsPerDay}: Props) => {

    const usedDate =Array.isArray(data) ? data.map(el=>({name:el.day,total:el.revenue.toFixed(2)})) : data
    const tickCount = bookingsPerDay ? Math.max(...bookingsPerDay.map(d => d.total))  : Math.max(...data!.map(d => d.revenue))  ;

   

   
  return (
    <ResponsiveContainer  height={500}>
    <BarChart
      width={500}
      height={300}
      data={usedDate || bookingsPerDay}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
      }}

      
    >
     
      <XAxis dataKey="name"   />
      <YAxis  dataKey="total"     domain={[0, tickCount]}/>
      <Tooltip />
      
   
      <Bar dataKey="total" fill="#6366F1"  activeBar={<Rectangle fill="gold" stroke="purple" radius={3}  />} radius={3}  maxBarSize={25} />
    </BarChart>
  </ResponsiveContainer>
  )
}

export default DailyChart