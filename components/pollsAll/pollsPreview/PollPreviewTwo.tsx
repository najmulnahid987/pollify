'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'

interface PollPreviewTwoProps {
  pollId?: string
  userId?: string
  title?: string
  description?: string
  bannerImage?: string
  showImages?: boolean
  previewMode?: 'pc' | 'mobile'
}

const PollPreviewTwo: React.FC<PollPreviewTwoProps> = ({
  pollId = '',
  userId = '',
  title = 'Your Thoughts Matter',
  description = 'We value your input to help us refine our platform. Please share any suggestions or comments you have about the recent poll results.',
  bannerImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCg1jribmezF2sybWlSlphrCzIOFHOmf_Yywu6OeN6c_Ldy5lhJCt0QToecd_er-J_wRk85EiS8H-W9PwF_qTSQ_Vs9vuFcaciFAhPF2-dacZ3igndEIJnzjCwLmDGErealzowcd4vvlu2eADamWM3OzzpkuHacS8D7xoZdC4yVo4kODc75kfw6uh1iIpLkLwA3JVwMo2QuSJYQTLed6m3BBQzSDwFboXNr8h85S_0QXUTMnc-DZQKbnv3aBG8LEZonAIcLpGT_ACs',
  showImages = true,
  previewMode = 'pc',
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    feedback: '',
  })
  const [rating, setRating] = useState<number>(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsSubmitting(true)

      const response = await fetch('/api/poll-responses/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pollId,
          userId,
          selectedOptions: [],
          voterName: formData.name || 'Anonymous',
          voterEmail: formData.email || 'anonymous@poll.local',
          feedbackMessage: formData.feedback,
          rating: rating || 0,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        console.error('API Error:', result)
        throw new Error(result.error || 'Failed to submit feedback')
      }

      console.log('Feedback submitted:', result)
      
      // Reset form
      setFormData({ name: '', email: '', feedback: '' })
      setRating(0)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.error('Error submitting feedback:', errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full bg-background-light dark:bg-background-dark py-3">
      {/* Main Content */}
      <div className="flex flex-col gap-4 max-w-2xl mx-auto px-3">
        {/* Feedback Form Card */}
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg shadow-slate-200/40 dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden">
          {/* Banner */}
          <div className="relative h-40 sm:h-48 md:h-56 w-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-700 overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url("${bannerImage}")`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
            <div className="absolute inset-0 flex items-end">
              <div className="w-full p-4 sm:p-6 md:p-8">
                <h1 className="text-white text-lg sm:text-xl md:text-2xl font-bold leading-tight tracking-tight drop-shadow-lg">
                  {title}
                </h1>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-4 md:p-6">
            <h2 className="text-slate-900 dark:text-slate-100 text-sm md:text-base font-semibold mb-1">
              Share your experience
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm mb-4 leading-tight">
              {description}
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Name and Email Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="flex flex-col gap-1.5">
                  <label
                    className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-0.5"
                    htmlFor="name"
                  >
                    Full Name
                  </label>
                  <input
                    className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 text-sm focus:outline-0 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label
                    className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-0.5"
                    htmlFor="email"
                  >
                    Email Address
                  </label>
                  <input
                    className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 text-sm focus:outline-0 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    id="email"
                    name="email"
                    placeholder="john@example.com"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Feedback Textarea */}
              <div className="flex flex-col gap-1.5">
                <label
                  className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-0.5"
                  htmlFor="feedback"
                >
                  Detailed Feedback
                </label>
                <textarea
                  className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 text-sm focus:outline-0 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                  id="feedback"
                  name="feedback"
                  placeholder="Tell us what's on your mind..."
                  rows={3}
                  value={formData.feedback}
                  onChange={handleInputChange}
                />
              </div>

              {/* Rating Section */}
              <div className="flex flex-col gap-2 py-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-0.5">
                  Rate our support
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      type="button"
                      className={`text-base px-2 py-1 rounded-lg hover:scale-110 transition-all ${
                        star <= rating
                          ? 'text-amber-400 bg-amber-100 dark:bg-amber-900/30'
                          : 'text-slate-300 dark:text-slate-700 hover:text-amber-200 bg-transparent'
                      }`}
                    >
                      ⭐
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  className={`w-full text-white font-bold py-2.5 px-6 rounded-full shadow-lg transition-all transform flex items-center justify-center gap-2 text-sm ${
                    isSubmitting
                      ? 'bg-blue-500 cursor-not-allowed opacity-80'
                      : 'bg-primary hover:bg-blue-700 shadow-primary/30 hover:-translate-y-0.5 active:scale-95'
                  }`}
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Feedback</span>
                      <span>➤</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PollPreviewTwo
