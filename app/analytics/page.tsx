"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Mock data for analytics
const mockSessionData = [
  { date: "2023-05-01", completed: 8, interrupted: 2, totalMinutes: 240 },
  { date: "2023-05-02", completed: 6, interrupted: 3, totalMinutes: 180 },
  { date: "2023-05-03", completed: 10, interrupted: 1, totalMinutes: 300 },
  { date: "2023-05-04", completed: 7, interrupted: 4, totalMinutes: 210 },
  { date: "2023-05-05", completed: 9, interrupted: 0, totalMinutes: 270 },
  { date: "2023-05-06", completed: 5, interrupted: 2, totalMinutes: 150 },
  { date: "2023-05-07", completed: 8, interrupted: 1, totalMinutes: 240 },
]

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("week")

  // Calculate summary statistics
  const totalPomodoros = mockSessionData.reduce((sum, day) => sum + day.completed, 0)
  const totalInterruptions = mockSessionData.reduce((sum, day) => sum + day.interrupted, 0)
  const totalFocusTime = mockSessionData.reduce((sum, day) => sum + day.totalMinutes, 0)
  const averageDailyPomodoros = totalPomodoros / mockSessionData.length
  const completionRate = (totalPomodoros / (totalPomodoros + totalInterruptions)) * 100

  // Format data for charts
  const dailyPomodorosData = mockSessionData.map((day) => ({
    name: day.date.split("-")[2],
    completed: day.completed,
    interrupted: day.interrupted,
  }))

  const focusTimeData = mockSessionData.map((day) => ({
    name: day.date.split("-")[2],
    minutes: day.totalMinutes,
  }))

  const completionRateData = [
    { name: "Completed", value: totalPomodoros, color: "#22c55e" },
    { name: "Interrupted", value: totalInterruptions, color: "#ef4444" },
  ]

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Pomodoros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalPomodoros}</div>
            <p className="text-xs text-muted-foreground">{averageDailyPomodoros.toFixed(1)} daily average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Focus Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {Math.floor(totalFocusTime / 60)}h {totalFocusTime % 60}m
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.floor(totalFocusTime / mockSessionData.length / 60)}h{" "}
              {Math.floor((totalFocusTime / mockSessionData.length) % 60)}m daily average
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{completionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">{totalInterruptions} interruptions</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="daily" className="space-y-6">
        <TabsList>
          <TabsTrigger value="daily">Daily Breakdown</TabsTrigger>
          <TabsTrigger value="focus">Focus Time</TabsTrigger>
          <TabsTrigger value="completion">Completion Rate</TabsTrigger>
        </TabsList>

        <TabsContent value="daily">
          <Card>
            <CardHeader>
              <CardTitle>Daily Pomodoros</CardTitle>
              <CardDescription>Completed vs. interrupted pomodoros per day</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ChartContainer
                config={{
                  completed: {
                    label: "Completed",
                    color: "hsl(142.1 76.2% 36.3%)",
                  },
                  interrupted: {
                    label: "Interrupted",
                    color: "hsl(0 84.2% 60.2%)",
                  },
                }}
                className="h-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyPomodorosData}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} />
                    <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="completed" fill="var(--color-completed)" radius={4} stackId="a" />
                    <Bar dataKey="interrupted" fill="var(--color-interrupted)" radius={4} stackId="a" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="focus">
          <Card>
            <CardHeader>
              <CardTitle>Focus Time Trend</CardTitle>
              <CardDescription>Total minutes of focus time per day</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ChartContainer
                config={{
                  minutes: {
                    label: "Minutes",
                    color: "hsl(221.2 83.2% 53.3%)",
                  },
                }}
                className="h-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={focusTimeData}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} />
                    <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="minutes"
                      stroke="var(--color-minutes)"
                      fill="var(--color-minutes)"
                      fillOpacity={0.2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completion">
          <Card>
            <CardHeader>
              <CardTitle>Completion Rate</CardTitle>
              <CardDescription>Ratio of completed to interrupted pomodoros</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex justify-center">
              <div className="w-[300px] h-full flex items-center">
                <ResponsiveContainer width="100%" height="80%">
                  <PieChart>
                    <Pie
                      data={completionRateData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {completionRateData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [`${value} pomodoros`, name]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
