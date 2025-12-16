'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { HydrationProvider } from '@/components/HydrationProvider'
import PollResult from '@/components/pollsAll/PollResult'
import PollShare from '@/components/pollsAll/PollShare'
import WithoutRateOpinion from '@/components/pollsAll/pollsPreview/WithoutRateOpinion'
import WithRate from '@/components/pollsAll/pollsPreview/WithRate'
import Opinion from '@/components/pollsAll/Opinion'

interface Poll {
  id: number
  title: string
  createdDate: string
  votes: number
  isPublic: boolean
}

const pollsData: Poll[] = [
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
  const params = useParams()
  const router = useRouter()
  const pollId = parseInt(params.pollId as string)

  const poll = pollsData.find((p) => p.id === pollId)

  if (!poll) {
    return (
      <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
        <p className="text-gray-500 text-lg">Poll not found</p>
      </div>
    )
  }

  return (
    <HydrationProvider>
      <>
        <div className="mb-6 sm:mb-8 pt-2 sm:pt-3 px-4 sm:px-6">
          <h1 className="text-lg sm:text-xl font-bold text-gray-900">My poll</h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">{poll.title}</p>
        </div>

        <Tabs defaultValue="result" className="w-full px-4 sm:px-6 -mt-6">
          <TabsList className="h-auto">
            <TabsTrigger value="result" className="text-xs py-1 px-2 cursor-pointer">Result</TabsTrigger>
            <TabsTrigger value="preview" className="text-xs py-1 px-2 cursor-pointer">Preview</TabsTrigger>
            <TabsTrigger value="share" className="text-xs py-1 px-2 cursor-pointer">Share</TabsTrigger>
            <TabsTrigger value="edit" className="text-xs py-1 px-2 cursor-pointer">Edit</TabsTrigger>
            <TabsTrigger value="chat" className="text-xs py-1 px-2 cursor-pointer">Chat</TabsTrigger>
          </TabsList>
          
          <TabsContent value="result" className="mt-2">
            <PollResult />
          </TabsContent>
          
          <TabsContent value="preview" className="mt-2">
            <div className="p-2 rounded-lg text-sm">
              {/* <WithoutRateOpinion /> */}
              {/* <WithRate /> */}
              <Opinion /> 
            </div>
          </TabsContent>
          
          <TabsContent value="share" className="mt-2">
            <PollShare />
          </TabsContent>

          <TabsContent value="edit" className="mt-2">
            <div className="p-2 border rounded-lg text-sm">
              <p>Edit content goes here</p>
            </div>
          </TabsContent>

          <TabsContent value="chat" className="mt-2">
            <div className="p-2 border rounded-lg text-sm">
              <p>Chat content goes here</p>
            </div>
          </TabsContent>

        </Tabs>
      </>
    </HydrationProvider>
  )
}

export default Page