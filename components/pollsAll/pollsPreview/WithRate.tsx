'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'

interface PollOption {
  id: string
  label: string
}

function WithRate() {
  const [selectedOption, setSelectedOption] = useState<string>('')
  const [rating, setRating] = useState<number>(0)
  const [submitted, setSubmitted] = useState<boolean>(false)

  const pollOptions: PollOption[] = [
    { id: 'espresso', label: 'Espresso' },
    { id: 'latte', label: 'Latte' },
    { id: 'cappuccino', label: 'Cappuccino' },
    { id: 'americano', label: 'Americano' },
    { id: 'iced-coffee', label: 'Iced Coffee' }
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedOption && rating > 0) {
      setSubmitted(true)
    }
  }

  const renderStars = () => {
    return (
      <div className="flex justify-center items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className="focus:outline-none transition-transform hover:scale-110"
          >
            <svg
              className={`w-5 h-5 ${star <= rating ? 'text-blue-600' : 'text-gray-300'}`}
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
          </button>
        ))}
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="max-w-sm w-full space-y-3 bg-white p-4 rounded-lg shadow-lg border border-gray-200 text-center">
          <svg
            className="mx-auto h-10 w-10 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            ></path>
          </svg>
          <h2 className="mt-2 text-lg font-bold text-gray-900">Thank you for your vote!</h2>
          <p className="mt-1 text-sm text-gray-600">Your response has been recorded.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="max-w-sm w-full space-y-4 bg-white p-5 rounded-lg shadow-lg border border-gray-200">
        <div className="text-center">
          <h1 className="text-xl font-bold tracking-tight text-gray-900">
            What's your favorite type of coffee?
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Choose your favorite coffee type from the options below.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-2">
            {pollOptions.map((option) => (
              <label
                key={option.id}
                className="block cursor-pointer group"
              >
                <input
                  type="radio"
                  name="coffee_option"
                  value={option.id}
                  checked={selectedOption === option.id}
                  onChange={(e) => setSelectedOption(e.target.value)}
                  className="sr-only"
                />
                <div
                  className={`flex items-center p-3 border-2 rounded-md transition-all duration-200 ${
                    selectedOption === option.id
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-600'
                  }`}
                >
                  <span
                    className={`h-4 w-4 border-2 rounded-full flex items-center justify-center transition-all ${
                      selectedOption === option.id
                        ? 'border-blue-600'
                        : 'border-gray-300'
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full transition-all ${
                        selectedOption === option.id
                          ? 'bg-blue-600'
                          : 'bg-transparent'
                      }`}
                    ></span>
                  </span>
                  <span className="ml-2 text-sm font-medium text-gray-900">
                    {option.label}
                  </span>
                </div>
              </label>
            ))}
          </div>

        <div className="space-y-2 pt-2">
          <p className="text-xs text-gray-600 text-center">Rate this Poll</p>
          {renderStars()}
        </div>

        <Button
          type="submit"
          disabled={!selectedOption || rating === 0}
          className="w-full py-2 mt-3 text-sm font-semibold"
        >
          Vote
        </Button>
        </form>
      </div>
    </div>
  )
}

export default WithRate