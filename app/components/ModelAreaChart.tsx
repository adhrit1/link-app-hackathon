"use client"

import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { month: "Apr 25", revenue: 25.0, netIncome: 8.75 },
  { month: "May 25", revenue: 25.06, netIncome: 8.77 },
  { month: "Jun 25", revenue: 25.12, netIncome: 8.79 },
  { month: "Jul 25", revenue: 25.19, netIncome: 8.81 },
  { month: "Aug 25", revenue: 25.25, netIncome: 8.84 },
  { month: "Sep 25", revenue: 25.31, netIncome: 8.86 },
  { month: "Oct 25", revenue: 25.37, netIncome: 8.88 },
  { month: "Nov 25", revenue: 25.43, netIncome: 8.90 },
  { month: "Dec 25", revenue: 25.50, netIncome: 8.92 },
  { month: "Jan 26", revenue: 25.56, netIncome: 8.95 },
  { month: "Feb 26", revenue: 25.62, netIncome: 8.97 },
  { month: "Mar 26", revenue: 25.69, netIncome: 8.99 }
]

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "rgb(37, 99, 235)", // blue-600
  },
  netIncome: {
    label: "Net Income",
    color: "rgb(99, 102, 241)", // indigo-500
  },
} satisfies ChartConfig

export function ModelAreaChart() {
  return (
    <Card className="h-[320px]">
      <CardHeader>
        <CardTitle>Financial Performance</CardTitle>
        <CardDescription>
          Monthly Revenue and Net Income (in millions USD)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
              bottom: 12,
              top: 0
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="netIncome"
              type="natural"
              fill="rgb(99, 102, 241)" // indigo-500
              fillOpacity={0.4}
              stroke="rgb(99, 102, 241)" // indigo-500
              stackId="a"
            />
            <Area
              dataKey="revenue"
              type="natural"
              fill="rgb(37, 99, 235)" // blue-600
              fillOpacity={0.4}
              stroke="rgb(37, 99, 235)" // blue-600
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
} 