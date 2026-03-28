'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'

interface PollPreviewTwoProps {
  showImages?: boolean
  previewMode?: 'pc' | 'mobile'
}

const PollPreviewTwo: React.FC<PollPreviewTwoProps> = ({
  showImages = true,
  previewMode = 'pc',
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    feedback: '',
  })
  const [rating, setRating] = useState<number>(0)

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', { ...formData, rating })
    setFormData({ name: '', email: '', feedback: '' })
    setRating(0)
  }

  return (
    <div className="w-full bg-background-light dark:bg-background-dark py-3">
      {/* Main Content */}
      <div className="flex flex-col gap-4 max-w-2xl mx-auto px-3">
        {/* Feedback Form Card */}
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg shadow-slate-200/40 dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden">
          {/* Banner */}
          <div className="relative h-32 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCg1jribmezF2sybWlSlphrCzIOFHOmf_Yywu6OeN6c_Ldy5lhJCt0QToecd_er-J_wRk85EiS8H-W9PwF_qTSQ_Vs9vuFcaciFAhPF2-dacZ3igndEIJnzjCwLmDGErealzowcd4vvlu2eADamWM3OzzpkuHacS8D7xoZdC4yVo4kODc75kfw6uh1iIpLkLwA3JVwMo2QuSJYQTLed6m3BBQzSDwFboXNr8h85S_0QXUTMnc-DZQKbnv3aBG8LEZonAIcLpGT_ACs")',
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <span className="px-2 py-0.5 bg-white/20 text-white text-[8px] font-bold uppercase tracking-widest rounded-full w-fit backdrop-blur-md mb-1.5 inline-block">
                Community Voice
              </span>
              <h1 className="text-white text-lg font-bold leading-tight tracking-tight">
                Your Thoughts Matter
              </h1>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-4 md:p-6">
            <h2 className="text-slate-900 dark:text-slate-100 text-sm md:text-base font-semibold mb-1">
              Share your experience
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm mb-4 leading-tight">
              We value your input to help us refine our platform. Please share any
              suggestions or comments you have about the recent poll results.
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
                  className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-full shadow-lg shadow-primary/30 transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 text-sm"
                  type="submit"
                >
                  <span>Send Feedback</span>
                  <span>➤</span>
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
