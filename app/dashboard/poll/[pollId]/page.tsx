'use client'

import React, { useState } from 'react'
import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { HydrationProvider } from '@/components/HydrationProvider'
import PollResult from '@/components/pollsAll/PollResult'
import PollShare from '@/components/pollsAll/PollShare'
import PollPreviewAll from '@/components/pollsAll/pollsPreview/PollPreviewAll'
import { Monitor, Smartphone } from 'lucide-react'
import PollPreviewTwo from '@/components/pollsAll/pollsPreview/PollPreviewTwo'

interface Poll {
  id: number
  title: string
  createdDate: string
  votes: number
  isPublic: boolean
  shareWithoutImage?: boolean
}

const pollsData: Poll[] = [
  {
    id: 1,
    title: 'Customer Satisfaction Survey',
    createdDate: 'July 15, 2024',
    votes: 125,
    isPublic: true,
    shareWithoutImage: false,
  },
  {
    id: 2,
    title: 'Employee Feedback Form',
    createdDate: 'June 22, 2024',
    votes: 88,
    isPublic: false,
    shareWithoutImage: true,
  },
  {
    id: 3,
    title: 'Event Registration Poll',
    createdDate: 'May 10, 2024',
    votes: 210,
    isPublic: true,
    shareWithoutImage: false,
  },
  {
    id: 4,
    title: 'Product Feature Request',
    createdDate: 'August 05, 2024',
    votes: 156,
    isPublic: true,
    shareWithoutImage: false,
  },
  {
    id: 5,
    title: 'Team Preference Survey',
    createdDate: 'July 28, 2024',
    votes: 92,
    isPublic: false,
    shareWithoutImage: true,
  },
  {
    id: 6,
    title: 'Office Location Vote',
    createdDate: 'June 12, 2024',
    votes: 178,
    isPublic: true,
    shareWithoutImage: false,
  },
]

function Page() {
  const params = useParams()
  const router = useRouter()
  const pollId = parseInt(params.pollId as string)
  const [previewMode, setPreviewMode] = useState<'pc' | 'mobile'>('pc')

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
      <div className="flex flex-col h-screen overflow-hidden">
        <div className="mb-6 ml-3 sm:mb-8 pt-2 sm:pt-3 px-4 sm:px-6">
        </div>

        <Tabs defaultValue="result" className="w-full px-4 sm:px-6 -mt-6 flex-1 overflow-hidden flex flex-col">
          <TabsList className="h-auto">
            <TabsTrigger value="result" className="text-xs py-1 px-2 cursor-pointer">Result</TabsTrigger>
            <TabsTrigger value="preview" className="text-xs py-1 px-2 cursor-pointer">Preview</TabsTrigger>
            <TabsTrigger value="share" className="text-xs py-1 px-2 cursor-pointer">Share</TabsTrigger>
            <TabsTrigger value="edit" className="text-xs py-1 px-2 cursor-pointer">Edit</TabsTrigger>
            <TabsTrigger value="chat" className="text-xs py-1 px-2 cursor-pointer">Chat</TabsTrigger>
          </TabsList>
          
          <TabsContent value="result" className="mt-2 flex-1 overflow-hidden">
            <PollResult />
          </TabsContent>
          
          <TabsContent value="preview" className="mt-2 flex-1 overflow-hidden flex flex-col">
            {/* Preview Mode Toggle */}
            <div className="flex gap-2 items-center mb-3 pb-3 border-b border-gray-200">
              <button
                onClick={() => setPreviewMode('pc')}
                className={`p-2 rounded-lg transition-all ${
                  previewMode === 'pc'
                    ? 'bg-blue-100 border-2 border-blue-500 text-blue-600'
                    : 'bg-gray-100 border-2 border-gray-300 text-gray-600 hover:bg-gray-200'
                }`}
                title="PC Preview"
              >
                <Monitor size={18} />
              </button>
              <button
                onClick={() => setPreviewMode('mobile')}
                className={`p-2 rounded-lg transition-all ${
                  previewMode === 'mobile'
                    ? 'bg-blue-100 border-2 border-blue-500 text-blue-600'
                    : 'bg-gray-100 border-2 border-gray-300 text-gray-600 hover:bg-gray-200'
                }`}
                title="Mobile Preview"
              >
                <Smartphone size={18} />
              </button>
            </div>

            {/* Preview Container */}
            <div className="flex-1 overflow-auto flex justify-center items-start">
              {previewMode === 'pc' ? (
                <div className="w-full max-w-4xl">
                  {/* <PollPreviewAll showImages={!poll.shareWithoutImage} previewMode="pc" /> */}
                  <PollPreviewTwo showImages={!poll.shareWithoutImage} previewMode="pc" />
                </div>
              ) : (
                <div className="pt-4">
                  <div className="w-80 bg-gradient-to-b from-gray-900 to-gray-800 rounded-3xl p-2.5 shadow-2xl border-8 border-gray-900">
                    {/* Phone Notch */}
                    <div className="bg-black rounded-b-3xl h-5 mx-auto mb-1.5 w-36 flex items-center justify-center">
                      <div className="w-0.5 h-0.5 bg-gray-700 rounded-full mx-0.5"></div>
                    </div>
                    {/* Phone Screen */}
                    <div className="bg-white rounded-2xl overflow-hidden">
                      <div className="w-full h-96 overflow-y-auto">
                        {/* <PollPreviewAll showImages={!poll.shareWithoutImage} previewMode="mobile" /> */}
                        <PollPreviewTwo showImages={!poll.shareWithoutImage} previewMode="mobile" />
                      </div>
                    </div>
                    {/* Home Button */}
                    <div className="flex justify-center mt-2">
                      <div className="w-28 h-1 bg-gray-800 rounded-full"></div>
                    </div>
                  </div>
                </div>
              )}
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
      </div>
    </HydrationProvider>
  )
}

export default Page