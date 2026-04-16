'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { HydrationProvider } from '@/components/HydrationProvider'
import PollResult from '@/components/pollsAll/PollResult'
import PollShare from '@/components/pollsAll/PollShare'
import PollPreviewAll from '@/components/pollsAll/pollsPreview/PollPreviewAll'
import { Monitor, Smartphone } from 'lucide-react'
import PollPreviewTwo from '@/components/pollsAll/pollsPreview/PollPreviewTwo'
import { createClient } from '@/lib/supabase'

interface Poll {
  id: string
  title: string
  description?: string
  poll_image_url?: string
  created_at?: string
  vote_count?: number
  is_public?: boolean
  visibility?: 'public' | 'private'
  share_without_image?: boolean
  share_without_options?: boolean
  allow_multiple?: boolean
  options?: Array<{
    id: string
    text: string
    image_url?: string
    order?: number
  }>
}

function Page() {
  const params = useParams()
  const router = useRouter()
  const pollId = params?.pollId ? String(params.pollId) : ''
  const [previewMode, setPreviewMode] = useState<'pc' | 'mobile'>('pc')
  const [poll, setPoll] = useState<Poll | null>(null)
  const [userId, setUserId] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)

  // Fetch poll data from Supabase
  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const supabase = createClient()
        
        // Get current user
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          setUserId(user.id)
        }
        
        // First, try to fetch poll by ID without user_id filter
        const { data, error } = await supabase
          .from('polls')
          .select('*')
          .eq('id', pollId)
          .single()

        if (error) {
          console.error('Error fetching poll:', error)
          setPoll(null)
        } else if (data) {
          console.log('Poll fetched successfully:', data)
          // Fetch poll options
          const { data: optionsData, error: optionsError } = await supabase
            .from('poll_options')
            .select('*')
            .eq('poll_id', pollId)
            .order('order', { ascending: true })

          if (!optionsError && optionsData) {
            setPoll({
              ...data,
              options: optionsData.map((opt: any) => ({
                id: opt.id,
                text: opt.text,
                image_url: opt.image_url,
                order: opt.order,
              })),
            })
          } else {
            setPoll(data)
          }
        }
      } catch (error) {
        console.error('Error fetching poll:', error)
        setPoll(null)
      } finally {
        setIsLoading(false)
      }
    }

    if (pollId) {
      fetchPoll()
    }
  }, [pollId])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading poll...</p>
      </div>
    )
  }

  if (!poll || !pollId) {
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
          </TabsList>
          
          <TabsContent value="result" className="mt-2 flex-1 overflow-hidden">
            <PollResult poll={poll} />
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
                  {poll.share_without_options ? (
                    <PollPreviewTwo 
                      pollId={pollId}
                      userId={userId}
                      title={poll.title}
                      description={poll.description}
                      bannerImage={poll.poll_image_url}
                      previewMode="pc"
                    />
                  ) : (
                    <PollPreviewAll 
                      pollId={pollId}
                      userId={userId}
                      title={poll.title}
                      description={poll.description}
                      bannerImage={poll.poll_image_url}
                      options={poll.options?.map(opt => ({
                        id: opt.id,
                        title: opt.text,
                        image: opt.image_url || '',
                        description: undefined,
                      }))}
                      showImages={true}
                      share_without_image={poll.share_without_image}
                      allow_multiple={poll.allow_multiple}
                      previewMode="pc"
                    />
                  )}
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
                        {poll.share_without_options ? (
                          <PollPreviewTwo 
                            pollId={pollId}
                            userId={userId}
                            title={poll.title}
                            description={poll.description}
                            bannerImage={poll.poll_image_url}
                            previewMode="mobile"
                          />
                        ) : (
                          <PollPreviewAll 
                            pollId={pollId}
                            userId={userId}
                            title={poll.title}
                            description={poll.description}
                            bannerImage={poll.poll_image_url}
                            options={poll.options?.map(opt => ({
                              id: opt.id,
                              title: opt.text,
                              image: opt.image_url || '',
                              description: undefined,
                            }))}
                            showImages={true}
                            share_without_image={poll.share_without_image}
                            allow_multiple={poll.allow_multiple}
                            previewMode="mobile"
                          />
                        )}
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
            <PollShare pollId={pollId} userId={userId} />
          </TabsContent>

        </Tabs>
      </div>
    </HydrationProvider>
  )
}

export default Page