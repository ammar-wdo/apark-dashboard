
'use client'
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


type Props = {
    data:{day:number,revenue:number}[]
}

const DailyChart = ({data}: Props) => {


    const usedDate = data.map(el=>({name:el.day,total:el.revenue}))
  return (
    <ResponsiveContainer width={1400} height="100%">
    <BarChart
      width={500}
      height={300}
      data={usedDate}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis  dataKey="total"/>
      <Tooltip />
      <Legend />
   
      <Bar dataKey="total" fill="#82ca9d" activeBar={<Rectangle fill="gold" stroke="purple" />} />
    </BarChart>
  </ResponsiveContainer>
  )
}

export default DailyChart