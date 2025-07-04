"use client"

import { Bar, BarChart, XAxis } from "recharts"

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

const chartData = [
  { date: "2025-04", operatingExpenses: 3.75, depreciation: 1.25, netIncome: 8.75 },
  { date: "2025-05", operatingExpenses: 3.76, depreciation: 1.25, netIncome: 8.77 },
  { date: "2025-06", operatingExpenses: 3.77, depreciation: 1.26, netIncome: 8.79 },
  { date: "2025-07", operatingExpenses: 3.78, depreciation: 1.26, netIncome: 8.81 },
  { date: "2025-08", operatingExpenses: 3.79, depreciation: 1.26, netIncome: 8.84 },
  { date: "2025-09", operatingExpenses: 3.80, depreciation: 1.27, netIncome: 8.86 }
]

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
  }
} satisfies ChartConfig

export function ModelBarChart() {
  return (
    <Card className="h-[320px]">
      <CardHeader>
        <CardTitle>Revenue Components</CardTitle>
        <CardDescription>
          Monthly breakdown of revenue components
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart 
            accessibilityLayer 
            data={chartData}
            margin={{
              bottom: 12,
              top: 0,
              left: 0,
              right: 0
            }}
          >
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => {
                return new Date(value).toLocaleDateString("en-US", {
                  month: "short",
                })
              }}
            />
            <Bar
              dataKey="operatingExpenses"
              stackId="a"
              fill="rgb(37, 99, 235)" // blue-600
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="depreciation"
              stackId="a"
              fill="rgb(99, 102, 241)" // indigo-500
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="netIncome"
              stackId="a"
              fill="rgb(34, 197, 94)" // green-500
              radius={[4, 4, 0, 0]}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  hideLabel
                  className="w-[180px]"
                  formatter={(value, name, item, index) => (
                    <>
                      <div
                        className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-[--color-bg]"
                        style={
                          {
                            "--color-bg": 
                              name === "operatingExpenses" ? "rgb(37, 99, 235)" :
                              name === "depreciation" ? "rgb(99, 102, 241)" :
                              "rgb(34, 197, 94)",
                          } as React.CSSProperties
                        }
                      />
                      {chartConfig[name as keyof typeof chartConfig]?.label ||
                        name}
                      <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                        ${value}M
                      </div>
                      {/* Add total after the last item */}
                      {index === 2 && (
                        <div className="mt-1.5 flex basis-full items-center border-t pt-1.5 text-xs font-medium text-foreground">
                          Total Revenue
                          <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                            ${(item.payload.operatingExpenses + 
                               item.payload.depreciation + 
                               item.payload.netIncome).toFixed(2)}M
                          </div>
                        </div>
                      )}
                    </>
                  )}
                />
              }
              cursor={false}
              defaultIndex={1}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
} 