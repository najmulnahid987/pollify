'use client'

import React, { useState } from 'react'

interface PollOption {
  value: string
  label: string
}

function WithoutRateOpinion() {
  const [selectedOption, setSelectedOption] = useState<string>('')
  const [submitted, setSubmitted] = useState(false)

  const pollOptions: PollOption[] = [
    { value: 'espresso', label: 'Espresso' },
    { value: 'latte', label: 'Latte' },
    { value: 'cappuccino', label: 'Cappuccino' },
    { value: 'americano', label: 'Americano' },
    { value: 'iced-coffee', label: 'Iced Coffee' },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedOption) {
      setSubmitted(true)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-6 bg-white p-6 sm:p-8 rounded-lg shadow-lg">
          {!submitted ? (
            <div id="poll-container">
              <div className="text-center">
                <h1 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
                  What's your favorite type of coffee?
                </h1>
                <p className="mt-2 text-sm leading-5 text-gray-600">
                  Choose your favorite coffee type from the options below.
                </p>
              </div>
              <form className="mt-6 space-y-3" onSubmit={handleSubmit}>
                <div className="space-y-3">
                  {pollOptions.map((option) => (
                    <label key={option.value} className="poll-option block cursor-pointer">
                      <input
                        type="radio"
                        name="coffee_option"
                        value={option.value}
                        checked={selectedOption === option.value}
                        onChange={(e) => setSelectedOption(e.target.value)}
                        className="sr-only"
                      />
                      <div
                        className={`flex items-center p-3 border-2 rounded-md transition-all duration-200 ${
                          selectedOption === option.value
                            ? 'border-blue-500 bg-blue-50 shadow-md'
                            : 'border-gray-200 hover:border-blue-500'
                        }`}
                      >
                        <span
                          className={`h-4 w-4 border-2 rounded-full flex items-center justify-center transition-all flex-shrink-0 ${
                            selectedOption === option.value
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-300'
                          }`}
                        >
                          {selectedOption === option.value && (
                            <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                          )}
                        </span>
                        <span className="ml-2 text-sm font-medium text-gray-900">
                          {option.label}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={!selectedOption}
                    className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-semibold rounded-md text-white transition-colors duration-300 mt-4 ${
                      selectedOption
                        ? 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer'
                        : 'bg-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Vote
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div id="thank-you-message" className="text-center">
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
                />
              </svg>
              <h2 className="mt-3 text-lg font-bold text-gray-900">
                Thank you for your vote!
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Your response has been recorded.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default WithoutRateOpinion