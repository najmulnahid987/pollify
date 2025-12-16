'use client'

import React, { useState } from 'react'
import { MoreVertical, Globe, Lock, Edit, Share2, Link as LinkIcon, Trash2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Poll {
  id: number
  title: string
  createdDate: string
  votes: number
  isPublic: boolean
}

const initialPolls: Poll[] = [
  {
    id: 1,
    title: 'Customer Satisfaction Survey',
    createdDate: 'July 15, 2024',
    votes: 125,
    isPublic: true,
  },
  {
    id: 2,
    title: 'Employee Feedback Form',
    createdDate: 'June 22, 2024',
    votes: 88,
    isPublic: false,
  },
  {
    id: 3,
    title: 'Event Registration Poll',
    createdDate: 'May 10, 2024',
    votes: 210,
    isPublic: true,
  },
  {
    id: 4,
    title: 'Product Feature Request',
    createdDate: 'August 05, 2024',
    votes: 156,
    isPublic: true,
  },
  {
    id: 5,
    title: 'Team Preference Survey',
    createdDate: 'July 28, 2024',
    votes: 92,
    isPublic: false,
  },
  {
    id: 6,
    title: 'Office Location Vote',
    createdDate: 'June 12, 2024',
    votes: 178,
    isPublic: true,
  },
]

function Page() {
  const [polls, setPolls] = useState<Poll[]>(initialPolls)

  const handleDeletePoll = (id: number) => {
    setPolls(polls.filter((poll) => poll.id !== id))
  }

  return (
    <div className="min-h-screen bg-white" suppressHydrationWarning>
      <div className="mb-6 sm:mb-8 pt-2 sm:pt-3 px-4 sm:px-6">
        <h1 className="text-lg sm:text-xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">Welcome to your dashboard</p>
      </div>

      <main className="px-4 sm:px-6 py-4">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {polls.map((poll) => (
            <div
              key={poll.id}
              className="relative p-4 rounded-lg border border-gray-200 bg-gradient-to-br from-cyan-50 to-blue-50 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 flex flex-col h-full cursor-pointer"
            >
              {/* Kebab Menu */}
              <div className="absolute top-2 right-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="p-1 rounded-full bg-white/80 border border-gray-200 shadow-sm hover:bg-white transition-all duration-150 cursor-pointer"
                      aria-label="Poll options"
                    >
                      <MoreVertical className="h-3.5 w-3.5 text-gray-600" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-32">
                    <DropdownMenuItem className="cursor-pointer">
                      <span className="text-xs">View</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDeletePoll(poll.id)}
                      className="text-red-600 cursor-pointer"
                    >
                      <Trash2 className="mr-2 h-3 w-3" />
                      <span className="text-xs">Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Content */}
              <div className="flex-grow">
                <h3 className="text-sm font-semibold text-gray-900 leading-snug pr-6">
                  {poll.title}
                </h3>
                <p className="text-xs text-gray-600 mt-1">Created on: {poll.createdDate}</p>
                <div className="flex items-center text-blue-600 font-medium mt-2 text-xs">
                  {poll.votes} Votes
                </div>
              </div>

              {/* Footer Icon */}
              <div className="absolute bottom-2 right-2 text-gray-500">
                <div title={poll.isPublic ? "Public Poll" : "Private Poll"}>
                  {poll.isPublic ? (
                    <Globe className="h-3.5 w-3.5 opacity-70" />
                  ) : (
                    <Lock className="h-3.5 w-3.5 opacity-70" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {polls.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No polls yet. Create your first poll!</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default Page