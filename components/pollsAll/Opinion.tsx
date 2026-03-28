'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Star } from 'lucide-react'

function Opinion({ onClose }: { onClose?: () => void }) {
  const [name, setName] = useState('')
  const [opinion, setOpinion] = useState('')
  const [rating, setRating] = useState(3)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log({ name, opinion, rating })
    onClose?.()
  }

  return (
    <div className="flex justify-center items-center">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-lg shadow-lg p-5 space-y-4">
        {/* Header */}
        <h2 className="text-gray-900 dark:text-white text-lg font-bold text-center">
          Share your opinion 💬
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {/* Name Field */}
          <div className="space-y-1">
            <Label htmlFor="name" className="text-xs font-medium">
              Name
            </Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="h-8 text-sm"
            />
          </div>

          {/* Opinion Field */}
          <div className="space-y-1">
            <Label htmlFor="opinion" className="text-xs font-medium">
              Opinion
            </Label>
            <Textarea
              id="opinion"
              value={opinion}
              onChange={(e) => setOpinion(e.target.value)}
              placeholder="Write your opinion..."
              rows={3}
              className="text-sm resize-none"
            />
          </div>

          {/* Star Rating */}
          <div className="flex flex-col w-full items-center gap-2">
            <div className="flex justify-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="transition-colors cursor-pointer hover:scale-110"
                >
                  <Star
                    size={18}
                    className="transition-colors"
                    style={{
                      fill: star <= rating ? '#0066ff' : 'transparent',
                      color: star <= rating ? '#0066ff' : '#cbd5e1',
                    }}
                    aria-label={`${star} star${star > 1 ? 's' : ''}`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-8 text-sm bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 mt-2"
          >
            Submit
          </Button>

          {/* Dismiss Link */}
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-gray-500 dark:text-gray-400 text-center underline cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            No thanks, maybe later
          </button>
        </form>
      </div>
    </div>
  )
}

export default Opinion