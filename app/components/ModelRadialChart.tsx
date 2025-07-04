"use client"

import { TrendingUp } from "lucide-react"
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"

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

const chartData = [{
  month: "Latest",
  operatingExpenses: 3.85,
  depreciation: 1.28,
  netIncome: 8.99
}]

const chartConfig = {
  operatingExpenses: {
    label: "Operating Expenses",
    color: "rgb(37, 99, 235)", // blue-600
  },
  depreciation: {
    label: "Depreciation",
    color: "rgb(99, 102, 241)", // indigo-500
  },
  netIncome: {
    label: "Net Income",
    color: "rgb(34, 197, 94)", // green-500
  },
} satisfies ChartConfig

export function ModelRadialChart() {
  const totalRevenue = chartData[0].operatingExpenses + 
                      chartData[0].depreciation + 
                      chartData[0].netIncome

  return (
    <Card className="h-[320px]">
      <CardHeader className="pb-0">
        <CardTitle>Revenue Breakdown</CardTitle>
        <CardDescription>Latest Month (in millions USD)</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-center">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[250px]"
        >
          <RadialBarChart
            data={chartData}
            endAngle={180}
            innerRadius={80}
            outerRadius={130}
            margin={{
              bottom: 0,
              top: 0,
              left: 0,
              right: 0
            }}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 16}
                          className="fill-foreground text-2xl font-bold"
                        >
                          ${totalRevenue.toFixed(2)}M
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 4}
                          className="fill-muted-foreground"
                        >
                          Total Revenue
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </PolarRadiusAxis>
            <RadialBar
              dataKey="operatingExpenses"
              stackId="a"
              cornerRadius={5}
              fill="rgb(37, 99, 235)" // blue-600
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="depreciation"
              fill="rgb(99, 102, 241)" // indigo-500
              stackId="a"
              cornerRadius={5}
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="netIncome"
              fill="rgb(34, 197, 94)" // green-500
              stackId="a"
              cornerRadius={5}
              className="stroke-transparent stroke-2"
            />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
} 