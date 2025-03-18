"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { day: "Mon", calories: 2250, target: 2400 },
  { day: "Tue", calories: 2380, target: 2400 },
  { day: "Wed", calories: 2200, target: 2400 },
  { day: "Thu", calories: 2100, target: 2400 },
  { day: "Fri", calories: 2300, target: 2400 },
  { day: "Sat", calories: 2500, target: 2400 },
  { day: "Sun", calories: 2150, target: 2400 },
]

export function CalorieChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--background))",
              borderColor: "hsl(var(--border))",
            }}
          />
          <Bar dataKey="calories" fill="hsl(var(--primary))" />
          <Bar dataKey="target" fill="hsl(var(--muted-foreground))" opacity={0.3} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

