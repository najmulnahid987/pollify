"use client"

import { TrendingUp, Star } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

export const description = "A stacked bar chart with a legend"

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function ChartBarStacked() {
  // Calculate total votes
  const totalVotes = chartData.reduce((sum, item) => sum + item.desktop + item.mobile, 0)
  // Calculate average rating (0-5 scale)
  const averageRating = (4.5).toFixed(1)

  return (
    <>
      <div className="flex justify-between items-start mb-3 gap-3 p-4">
        <div className="mb-6">
				<div className="flex items-center justify-between mb-2">
					<h1 className="text-lg font-bold text-gray-900">Voter analytics</h1>
				</div>
			</div>
        <div className="flex gap-2">
          {/* Total Votes Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-0">
            <div className="flex items-center gap-1.5 px-2 py-1.5">
              <div className="flex items-center justify-center w-6 h-6 bg-blue-100 rounded">
                <TrendingUp className="w-3 h-3 text-blue-600" />
              </div>
              <div>
                <p className="text-[9px] font-medium text-gray-600 leading-tight">Total Votes</p>
                <p className="text-xs font-bold text-gray-900">{totalVotes}</p>
              </div>
            </div>
          </div>
          {/* Rating Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-0">
            <div className="flex items-center gap-1.5 px-2 py-1.5">
              <div className="flex items-center justify-center w-6 h-6 bg-yellow-100 rounded">
                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
              </div>
              <div>
                <p className="text-[9px] font-medium text-gray-600 leading-tight">Average Rating</p>
                <p className="text-xs font-bold text-gray-900">{averageRating}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ChartContainer config={chartConfig}>
        <BarChart accessibilityLayer data={chartData} layout="vertical" margin={{ left: 60 }} barCategoryGap="30%" barGap="10%">
          <CartesianGrid horizontal={false} />
          <XAxis type="number" />
          <YAxis
            dataKey="month"
            type="category"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar
            dataKey="desktop"
            stackId="a"
            fill="var(--color-desktop)"
            radius={[0, 4, 4, 0]}
          />
          <Bar
            dataKey="mobile"
            stackId="a"
            fill="var(--color-mobile)"
            radius={[0, 4, 4, 0]}
          />
        </BarChart>
      </ChartContainer>
    </>
  )
}
