"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { date: "Jan 1", weight: 190 },
  { date: "Jan 8", weight: 189 },
  { date: "Jan 15", weight: 188 },
  { date: "Jan 22", weight: 187.5 },
  { date: "Jan 29", weight: 186.5 },
  { date: "Feb 5", weight: 186 },
  { date: "Feb 12", weight: 185.5 },
  { date: "Feb 19", weight: 185 },
]

export function WeightChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 10,
            left: 10,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey="date" />
          <YAxis domain={["dataMin - 5", "dataMax + 5"]} />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--background))",
              borderColor: "hsl(var(--border))",
            }}
          />
          <Line type="monotone" dataKey="weight" stroke="hsl(var(--primary))" strokeWidth={2} activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

