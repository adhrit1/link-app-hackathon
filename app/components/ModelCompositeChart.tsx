"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

// Generate 3 months of financial data
const generateFinancialData = () => {
  const data = []
  const startDate = new Date("2025-04-01")
  const endDate = new Date("2025-06-30")
  
  for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
    // Base values with some randomization
    const baseRevenue = 25.0 + (Math.random() * 2 - 1)  // Around $25M with ±$1M variation
    const baseProfit = 8.8 + (Math.random() * 1 - 0.5)  // Around $8.8M with ±$0.5M variation
    
    data.push({
      date: date.toISOString().split('T')[0],
      revenue: Number(baseRevenue.toFixed(2)),
      profit: Number(baseProfit.toFixed(2))
    })
  }
  return data
}

const chartData = generateFinancialData()

interface ChartMetric {
  label: string;
  color?: string;
}

const chartConfig: Record<string, ChartMetric> = {
  metrics: {
    label: "Financial Metrics",
  },
  revenue: {
    label: "Daily Revenue",
    color: "rgb(59, 130, 246)", // Bright blue color
  },
  profit: {
    label: "Daily Profit",
    color: "rgb(147, 197, 253)", // Lighter blue color
  },
} satisfies Record<string, ChartMetric>

export function ModelCompositeChart() {
  const [activeMetric, setActiveMetric] = 
    React.useState<keyof typeof chartConfig>("revenue")

  const total = React.useMemo(
    () => ({
      revenue: Number(chartData.reduce((acc, curr) => acc + curr.revenue, 0).toFixed(2)),
      profit: Number(chartData.reduce((acc, curr) => acc + curr.profit, 0).toFixed(2)),
    }),
    []
  )

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Financial Performance</CardTitle>
          <CardDescription>
            Daily revenue and profit trends (in millions USD)
          </CardDescription>
        </div>
        <div className="flex">
          {["revenue", "profit"].map((key) => {
            const metric = key as keyof typeof chartConfig
            return (
              <button
                key={metric}
                data-active={activeMetric === metric}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveMetric(metric)}
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[metric].label}
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  ${total[key as keyof typeof total]}M
                </span>
              </button>
            )
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[180px]"
                  nameKey="metrics"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }}
                  formatter={(value: number) => `$${value.toFixed(2)}M`}
                />
              }
            />
            <Bar 
              dataKey={activeMetric} 
              fill={chartConfig[activeMetric].color || "rgb(59, 130, 246)"}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
} 