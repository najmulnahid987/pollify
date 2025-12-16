'use client'

import React, { useEffect, useRef } from 'react'
import { Chart as ChartJS, BarElement, BarController, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'

interface Opinion {
  name: string
  flavor: string
  rating: number
  comment: string
  avatar: string
}

ChartJS.register(BarElement, BarController, CategoryScale, LinearScale, Tooltip, Legend)

function PollResult() {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstanceRef = useRef<ChartJS | null>(null)

  const opinions: Opinion[] = [
    {
      name: 'John Doe',
      flavor: 'Chocolate',
      rating: 4.5,
      comment: '"Chocolate is the classic for a reason! Nothing beats a rich, creamy chocolate ice cream."',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAn4doZeu3ezXWvCHW_W5PnsUMDiSorcp6zIEUCOKSOmEXjc1rNiYK85JFSdRoA0MBGSHO4t2Ue4tR26uGIZubucXNH211mZbTNbW-MtbFsUn1f4kJeymkT-0-D3xva6WkJqEzRHY_bsQB_uDxGMvgrU3z0z-LCaMyVVoPAzbim_vZFSyZFtjT5agp7cNMruw_v_39PcIql5e7JNeS5rIn_Fh5elWJ_HyfsS0XUW3jjYhsCmDS5Etr-h4JTkJjduYpOQJTfri64QAQ'
    },
    {
      name: 'Jane Smith',
      flavor: 'Vanilla',
      rating: 3,
      comment: '"Vanilla is so versatile. You can add any topping you want to it!"',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAdBsLH-4OZs7vKaXSfDh27VNUrMBd_5g7MijORnIh8r5S7c8nDjPGYP_hCkkNvwvzDrC9tCa8Qp9bZz3N2OwAYonND16UuqMjU928Nh0-polt_-POfF31vxQi2WTmQGQ2iaxQtjyJbHmhqZqC6FeYGtU_dVe-fnyLmZBxzWbgI63XsgTTDTCo0gds1vojb6LXpdNqFFB_vymP2o4hTsu22kcxWfj7hUOI1LlN4DkJSgmBTQqonD7RKb-PraAurNuMV8TzZlVMeFeU'
    },
    {
      name: 'Mike Johnson',
      flavor: 'Strawberry',
      rating: 5,
      comment: '"Strawberry all the way. It\'s so refreshing, especially on a hot summer day."',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuALtvNBHKSEBI47-0rpwjN7_dru-DMdOq4O-eVr5ANVdXZXPFEEhwDHAScQlAqfADu1uJNZaXLG8N89Ht7XuANqZgLNRNPg1MD6JWbwrB2K_HbVmA77_6P4HLl_4LF6EmNNcz0-w-uTsj0toaDKL9WH__qHAMXZtlOGfA7Vaouos57_q6wwzK4VhV37XuJR1EAxYVBuRsdq72Fd_dzUXzdSiR7sht2cfNSvIYLz8aDQkxK15rXmCZLUgOHy39hXvFW9-jUCQ6BgQDU'
    },
    {
      name: 'Emily White',
      flavor: 'Mint Chocolate Chip',
      rating: 4,
      comment: '"Mint Chocolate Chip is my go-to. The refreshing mint with bits of chocolate is perfect!"',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAn4doZeu3ezXWvCHW_W5PnsUMDiSorcp6zIEUCOKSOmEXjc1rNiYK85JFSdRoA0MBGSHO4t2Ue4tR26uGIZubucXNH211mZbTNbW-MtbFsUn1f4kJeymkT-0-D3xva6WkJqEzRHY_bsQB_uDxGMvgrU3z0z-LCaMyVVoPAzbim_vZFSyZFtjT5agp7cNMruw_v_39PcIql5e7JNeS5rIn_Fh5elWJ_HyfsS0XUW3jjYhsCmDS5Etr-h4JTkJjduYpOQJTfri64QAQ'
    },
    {
      name: 'David Green',
      flavor: 'Chocolate',
      rating: 3.5,
      comment: '"Chocolate is good, but I wish it had more chunks. Still solid!"',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAdBsLH-4OZs7vKaXSfDh27VNUrMBd_5g7MijORnIh8r5S7c8nDjPGYP_hCkkNvwvzDrC9tCa8Qp9bZz3N2OwAYonND16UuqMjU928Nh0-polt_-POfF31vxQi2WTmQGQ2iaxQtjyJbHmhqZqC6FeYGtU_dVe-fnyLmZBxzWbgI63XsgTTDTCo0gds1vojb6LXpdNqFFB_vymP2o4hTsu22kcxWfj7hUOI1LlN4DkJSgmBTQqonD7RKb-PraAurNuMV8TzZlVMeFeU'
    },
    {
      name: 'Sophia Lee',
      flavor: 'Vanilla',
      rating: 4,
      comment: '"Simple, elegant, and always a crowd-pleaser. Vanilla is the best base."',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuALtvNBHKSEBI47-0rpwjN7_dru-DMdOq4O-eVr5ANVdXZXPFEEhwDHAScQlAqfADu1uJNZaXLG8N89Ht7XuANqZgLNRNPg1MD6JWbwrB2K_HbVmA77_6P4HLl_4LF6EmNNcz0-w-uTsj0toaDKL9WH__qHAMXZtlOGfA7Vaouos57_q6wwzK4VhV37XuJR1EAxYVBuRsdq72Fd_dzUXzdSiR7sht2cfNSvIYLz8aDQkxK15rXmCZLUgOHy39hXvFW9-jUCQ6BgQDU'
    }
  ]

  // Calculate average ratings for each flavor
  const calculateAverageRatings = () => {
    const flavors = ['Vanilla', 'Chocolate', 'Strawberry', 'Mint Chocolate Chip']
    return flavors.map(flavor => {
      const flavorOpinions = opinions.filter(op => op.flavor === flavor)
      if (flavorOpinions.length === 0) return 0
      const total = flavorOpinions.reduce((sum, op) => sum + op.rating, 0)
      return parseFloat((total / flavorOpinions.length).toFixed(1))
    })
  }

  const averageRatings = calculateAverageRatings()

  useEffect(() => {
    if (!chartRef.current) return

    // Destroy existing chart if it exists
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy()
    }

    const ctx = chartRef.current.getContext('2d')
    if (!ctx) return

    chartInstanceRef.current = new ChartJS(ctx, {
      type: 'bar',
      data: {
        labels: ['Vanilla', 'Chocolate', 'Strawberry', 'Mint Chocolate Chip'],
        datasets: [{
          label: '# of Votes',
          data: [75, 100, 50, 25],
          backgroundColor: [
            'rgba(37, 99, 235, 0.2)',
            'rgba(37, 99, 235, 0.4)',
            'rgba(37, 99, 235, 0.6)',
            'rgba(37, 99, 235, 0.8)',
          ],
          borderColor: [
            'rgba(37, 99, 235, 1)',
            'rgba(37, 99, 235, 1)',
            'rgba(37, 99, 235, 1)',
            'rgba(37, 99, 235, 1)',
          ],
          borderWidth: 1,
          borderRadius: 8,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              afterLabel: (context) => {
                return `Avg Rating: ${averageRatings[context.dataIndex]}`
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: '#e5e7eb'
            }
          },
          x: {
            grid: {
              display: false
            },
            ticks: {
              callback: (index) => {
                const labels = ['Vanilla', 'Chocolate', 'Strawberry', 'Mint Chocolate Chip']
                if (typeof index === 'number') {
                  return `${labels[index]}\n${averageRatings[index]}`
                }
                return index
              }
            }
          }
        }
      }
    })

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy()
      }
    }
  }, [])

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        <span className="text-sm font-medium text-yellow-500">{rating}</span>
        <span className="text-yellow-500">★</span>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-4 mb-6 w-fit">
        <div className="bg-white p-3 rounded-lg border border-gray-200 flex items-center gap-2 w-48">
          <div className="p-1.5 rounded-full bg-blue-100 text-blue-600">
            <span className="text-sm">✓</span>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-600">Total Votes</p>
            <p className="text-lg font-bold text-gray-900">250</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-6">
        <div className="bg-white p-2 rounded-xl">
          <h3 className="text-base font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-300">Vote Distribution & Average Ratings</h3>
          <div className="h-64">
            <canvas ref={chartRef}></canvas>
          </div>
        </div>

        <div className="bg-white p-10 rounded-xl">
          <h3 className="text-base font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-300">Opinions</h3>
          <div className="space-y-3">
            {opinions.map((opinion, index) => (
              <div key={index}>
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={opinion.avatar} alt={opinion.name} />
                    <AvatarFallback>{opinion.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-grow">
                    <p className="font-semibold text-sm text-gray-900">
                      {opinion.name} <span className="text-gray-600">({opinion.flavor})</span>
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {renderStars(opinion.rating)}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{opinion.comment}</p>
                  </div>
                </div>
                {index < opinions.length - 1 && <div className="border-t border-gray-200 my-3"></div>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center mb-10 mt-10">
        <Button className="gap-1.5 text-xs" size="sm">
          <Download className="w-4 h-4" />
          Export Results
        </Button>
      </div>
    </div>
  )
}

export default PollResult