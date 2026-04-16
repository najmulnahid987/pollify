"use client"

import { TrendingUp, Star } from "lucide-react"
import { Bar, BarChart, XAxis, YAxis } from "recharts"
import { useEffect, useState } from "react"
import { supabaseClient } from "@/lib/supabase"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

export const description = "A horizontal bar chart"

const chartConfig = {
  votes: {
    label: "Votes",
    color: "#60a5fa",
  },
} satisfies ChartConfig

interface ChartBarStackedProps {
  pollId?: string
}

export function ChartBarStacked({ pollId }: ChartBarStackedProps) {
  const [chartData, setChartData] = useState<any[]>([])
  const [totalVotes, setTotalVotes] = useState(0)
  const [averageRating, setAverageRating] = useState("0.0")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      console.log('Fetching analytics for pollId:', pollId)
      
      if (!pollId) {
        console.log('No pollId provided')
        setLoading(false)
        return
      }

      try {
        // Fetch poll options
        const { data: optionsData, error: optionsError } = await supabaseClient
          .from('poll_options')
          .select('id, text, "order"')
          .eq('poll_id', pollId)
          .order('order', { ascending: true })

        console.log('Options data:', optionsData, 'Error:', optionsError)

        if (optionsError) {
          console.error('Options error:', optionsError)
          throw optionsError
        }

        // Fetch all poll responses
        const { data: responsesData, error: responsesError } = await supabaseClient
          .from('poll_responses')
          .select('*')
          .eq('poll_id', pollId)

        console.log('Responses data:', responsesData, 'Error:', responsesError)

        if (responsesError) {
          console.error('Responses error:', responsesError)
          throw responsesError
        }

        // Count votes per option
        const optionVoteCounts: Record<string, number> = {}
        let totalRating = 0
        let ratingCount = 0

        if (responsesData && Array.isArray(responsesData)) {
          responsesData.forEach((response: any) => {
            console.log('Processing response:', response)
            
            // Handle selected_option_ids
            if (response.selected_option_ids) {
              const optionIds = response.selected_option_ids
              console.log('Option IDs:', optionIds, 'Type:', typeof optionIds)
              
              if (Array.isArray(optionIds)) {
                optionIds.forEach((optionId: string) => {
                  if (optionId) {
                    optionVoteCounts[optionId] = (optionVoteCounts[optionId] || 0) + 1
                  }
                })
              }
            }
            
            // Handle rating
            if (response.rating && response.rating > 0) {
              totalRating += Number(response.rating)
              ratingCount++
            }
          })
        }

        console.log('Final option vote counts:', optionVoteCounts)

        // Calculate average rating
        const avgRating = ratingCount > 0 ? (totalRating / ratingCount).toFixed(1) : "0.0"
        console.log('Average rating:', avgRating)
        setAverageRating(avgRating)

        // Transform data for chart - include all options even with 0 votes
        const chartDataArray: Array<{ option: string; votes: number }> = []
        if (optionsData && Array.isArray(optionsData)) {
          optionsData.forEach((option: any, index: number) => {
            const voteCount = optionVoteCounts[option.id] || 0
            chartDataArray.push({
              option: `Option ${index + 1}`,
              votes: voteCount,
            })
          })
        }

        console.log('Chart data array:', chartDataArray)
        setChartData(chartDataArray)

        // Calculate total votes
        let totalVotesCount = 0
        Object.keys(optionVoteCounts).forEach((key) => {
          totalVotesCount += optionVoteCounts[key]
        })
        
        console.log('Total votes calculated:', totalVotesCount)
        setTotalVotes(totalVotesCount)
      } catch (error) {
        console.error('Error fetching analytics:', error)
        setChartData([])
        setTotalVotes(0)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [pollId])

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">Bar Chart </CardTitle>
          </div>
          <div className="flex gap-3">
            {/* Total Votes Card */}
            <div className="bg-white rounded-lg border border-gray-200 px-3 py-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-5 h-5 bg-blue-100 rounded">
                  <TrendingUp className="w-3 h-3 text-blue-600" />
                </div>
                <div>
                  <p className="text-[8px] font-medium text-gray-600 leading-tight">Total Votes</p>
                  <p className="text-xs font-bold text-gray-900">{loading ? "-" : totalVotes}</p>
                </div>
              </div>
            </div>
            {/* Rating Card */}
            <div className="bg-white rounded-lg border border-gray-200 px-3 py-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-5 h-5 bg-yellow-100 rounded">
                  <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                </div>
                <div>
                  <p className="text-[8px] font-medium text-gray-600 leading-tight">Avg Rating</p>
                  <p className="text-xs font-bold text-gray-900">{loading ? "-" : averageRating}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {loading ? (
          <div className="p-12 text-center text-gray-500">Loading analytics...</div>
        ) : chartData.length === 0 ? (
          <div className="p-12 text-center text-gray-500">No data available</div>
        ) : (
          <ChartContainer config={chartConfig} className="w-full h-80">
            <BarChart
              accessibilityLayer
              data={chartData}
              layout="vertical"
              margin={{
                left: 30,
                right: 20,
                top: 5,
                bottom: 5,
              }}
            >
              <XAxis type="number" />
              <YAxis
                dataKey="option"
                type="category"
                tickLine={false}
                tickMargin={5}
                axisLine={false}
                width={75}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="votes" fill="#60a5fa" radius={6} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
