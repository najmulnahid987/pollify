'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'

interface PollOption {
    id: string
    title: string
    image: string
    description?: string
}

interface PollPreviewAllProps {
    pollId?: string
    userId?: string
    title?: string
    description?: string
    bannerImage?: string
    options?: PollOption[]
    votesCount?: number
    engagementRate?: number
    countriesCount?: number
    showImages?: boolean
    share_without_image?: boolean
    allow_multiple?: boolean
    previewMode?: 'pc' | 'mobile'
}

const defaultOptions: PollOption[] = [
    {
        id: 'opt1',
        title: 'Fully Remote',
        description: 'Total freedom to work from anywhere globally.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD7c6yakyvhcIsaDLOb5UMv6flRNuMXDZuF7JFsxtyr6uIU7TU54A__jL4Bior7ZFaXaazy3-Ma4Fczfh78EZngIb80wXvhm3WF4dp9-DQdFKHoQNPDdj7vXQIBl1ODNB-b9TfLZseKxsZnl97tftqiEZoiKw4J1BuD8JzGdbOYulUi1togwqZGQ22vaTz07iOXiKkAjAclpRJI_HR_8xwNkWKLdn7guaBoWrttbr2eDfo7Rqd-OWBIx6aDaLXu90z_Kj4DzrNzMq8',
    },
    {
        id: 'opt2',
        title: 'Hybrid (2-3 days office)',
        description: 'Balance of community and personal flexibility.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCgETISwmWSin6j1WfYSb5v-1VSDUqDem3eMyODi9oZuxnB6I86M51CBz5m_Y5HSgmFLDPYETfRYggz5nWf7Qo39QuASObplVPuJkfKvW_bNh2FNgyfxInVFa8drM_ih1kePV02I90bsR52Y5g9vj2J3gCgME8_3JxZKvJmYvrLndG9c48RUfHATNdMCTNF2mSAF-zS7BkOUW3Mx4RYFILsFePpQSdyWBfOSA8IBPHwAF1gpWy0kBhXQXDNHc8-KiSOgCHiYJr-BgA',
    },
    {
        id: 'opt3',
        title: 'Office-first with flexibility',
        description: 'Primary desk space with occasional remote days.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHAJtmriLAXdZzUJiijVWUAMl_-WJ-Ai-EUw-sUwL7rbSdaauIXZIudxvYm7n7gKfE6X1vUFkSMRqljXKSXvfgMqGPESSCwZwuKxVUQRSfwVRg2--n0j8igSq3tX-GE7CVLNSB9xI1kKexLLGPL5oNSIPsJ4uDl0jPOTwGt__rl3sCuAt83DBXT_ZWYGtBoTnEUutc5YUgcAIFpY78HUWZU6McuXdNXaLV5cfcMPsFLg4GzaZpWVWRjLb7zZbXBlKZhFlUU6knpmM',
    },
]

const PollPreviewAll: React.FC<PollPreviewAllProps> = ({
    pollId = '',
    userId = '',
    title = 'Future of Remote Work 2024',
    description = "Share your insights on how global teams are evolving. We're looking to understand the long-term preferences for digital collaboration and physical office spaces in the coming year.",
    bannerImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3Cxv-Uu9OMzsLzLOsKwGu8PbzO9PxSJFw6XvBNJcQdoj6DbnbK1KVGOzB-jzaASYsjAPpmNp29ARgc4ibQXHVk7duxj2wssFZAN-v5nLQN4Rtdo4RX8drAvL4K-IcuULpy7_SaQojA2wDiXgPn5GNozsePBt9F5PNXDhmvTbOCr0wye_v-lu8EM8sTmHg1TVkUOhy5BPCqldDpN54KOTO-gpdwOvT_VsSXISpjIVEEnPZNF1GBTVRuwP8gt51IIfi4d_tyoXa8Ug',
    options = defaultOptions,
    votesCount = 1240,
    engagementRate = 84,
    countriesCount = 12,
    showImages = true,
    share_without_image = false,
    allow_multiple = false,
    previewMode = 'pc',
}) => {
    const [selectedOption, setSelectedOption] = useState<string | string[]>(allow_multiple ? [] : 'opt1')
    const [rating, setRating] = useState<number>(0)
    const [showFeedbackModal, setShowFeedbackModal] = useState<boolean>(false)
    const [email, setEmail] = useState<string>('')
    const [feedback, setFeedback] = useState<string>('')
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

    // Handle single option selection
    const handleSingleSelect = (optionId: string) => {
        setSelectedOption(optionId)
    }

    // Handle multiple option selection
    const handleMultipleSelect = (optionId: string) => {
        const current = selectedOption as string[]
        if (current.includes(optionId)) {
            setSelectedOption(current.filter(id => id !== optionId))
        } else {
            setSelectedOption([...current, optionId])
        }
    }

    const handleCastVote = () => {
        setShowFeedbackModal(true)
    }

    const handleSubmitFeedback = async () => {
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
                    selectedOptions: Array.isArray(selectedOption) ? selectedOption : [selectedOption],
                    voterName: 'Anonymous',
                    voterEmail: email || 'anonymous@poll.local',
                    feedbackMessage: feedback,
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
            setShowFeedbackModal(false)
            setEmail('')
            setFeedback('')
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error'
            console.error('Error submitting feedback:', errorMessage)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleSkipFeedback = async () => {
        try {
            setIsSubmitting(true)

            // Submit poll without feedback
            const response = await fetch('/api/poll-responses/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    pollId,
                    userId,
                    selectedOptions: Array.isArray(selectedOption) ? selectedOption : [selectedOption],
                    voterName: 'Anonymous',
                    voterEmail: email || 'anonymous@poll.local',
                    feedbackMessage: '',
                    rating: rating || 0,
                }),
            })

            const result = await response.json()

            if (!response.ok) {
                console.error('API Error:', result)
                throw new Error(result.error || 'Failed to submit poll')
            }

            console.log('Poll submitted without feedback:', result)
            
            // Reset form and close modal
            setShowFeedbackModal(false)
            setEmail('')
            setFeedback('')
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error'
            console.error('Error submitting poll:', errorMessage)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="w-full bg-background-light dark:bg-background-dark relative">
            <div className="w-full flex justify-center items-start">
                {/* Main Content */}
                <div className="w-full flex flex-col gap-2">
                    {/* Poll Card */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg shadow-slate-200/30 dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden">
                        {/* Banner */}
                        <div className="relative h-40 sm:h-48 md:h-56 w-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-700 overflow-hidden">
                            <div
                                className="absolute inset-0 bg-cover bg-center"
                                style={{ backgroundImage: `url('${bannerImage}')` }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />

                            {/* Banner Content */}
                            <div className="absolute inset-0 flex items-end">
                                <div className="w-full p-4 sm:p-6 md:p-8">
                                    <h1 className="text-white text-lg sm:text-xl md:text-2xl font-bold leading-tight tracking-tight drop-shadow-lg line-clamp-2">
                                        {title}
                                    </h1>
                                </div>
                            </div>
                        </div>

                        {/* Poll Content */}
                        <div className="p-3">
                            {/* Description */}
                            <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed mb-3 line-clamp-2">
                                {description}
                            </p>

                            {/* Options Section */}
                            <div className="mb-3">
                                <h3 className="text-slate-900 dark:text-slate-100 text-[11px] font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                    <span className="size-1 bg-primary rounded-full" />
                                    Select your preference
                                </h3>

                                {showImages && !share_without_image ? (
                                    // Grid with Images
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1.5">
                                        {options.map((option, index) => (
                                            <div key={option.id} className="relative group">
                                                <input
                                                    type={allow_multiple ? "checkbox" : "radio"}
                                                    id={option.id}
                                                    name={allow_multiple ? undefined : "poll-option"}
                                                    checked={allow_multiple ? (selectedOption as string[]).includes(option.id) : selectedOption === option.id}
                                                    onChange={() => allow_multiple ? handleMultipleSelect(option.id) : handleSingleSelect(option.id)}
                                                    className="peer hidden"
                                                />
                                                <label
                                                    htmlFor={option.id}
                                                    className="flex flex-col h-full rounded-xl border-2 border-slate-100 dark:border-slate-800 overflow-hidden cursor-pointer transition-all hover:border-primary/40 hover:shadow-md peer-checked:border-primary peer-checked:ring-2 peer-checked:ring-primary peer-checked:bg-slate-50 dark:peer-checked:bg-slate-800/50"
                                                >
                                                    {/* Image */}
                                                    <div className="relative aspect-[4/3] w-full overflow-hidden">
                                                        <div
                                                            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                                                            style={{ backgroundImage: `url('${option.image}')` }}
                                                        />
                                                        <div className="absolute inset-0 bg-black/5" />
                                                        <div className="absolute top-2 right-2 size-5 rounded-full border-2 border-white bg-white/20 backdrop-blur-md flex items-center justify-center transition-all shadow-md peer-checked:bg-primary peer-checked:border-primary">
                                                            {allow_multiple ? (
                                                                (selectedOption as string[]).includes(option.id) && (
                                                                    <svg
                                                                        className="w-3 h-3 text-white"
                                                                        fill="currentColor"
                                                                        viewBox="0 0 20 20"
                                                                    >
                                                                        <path
                                                                            fillRule="evenodd"
                                                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                            clipRule="evenodd"
                                                                        />
                                                                    </svg>
                                                                )
                                                            ) : (
                                                                selectedOption === option.id && (
                                                                    <svg
                                                                        className="w-3 h-3 text-white"
                                                                        fill="currentColor"
                                                                        viewBox="0 0 20 20"
                                                                    >
                                                                        <path
                                                                            fillRule="evenodd"
                                                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                            clipRule="evenodd"
                                                                        />
                                                                    </svg>
                                                                )
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Label */}
                                                    <div className="p-2 flex flex-col gap-0.5 bg-white dark:bg-slate-900 grow">
                                                        <span className="text-slate-900 dark:text-slate-100 font-bold text-xs line-clamp-1">
                                                            {option.title}
                                                        </span>
                                                    </div>
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    // List without Images
                                    <div className="space-y-1">
                                        {options.map((option, index) => (
                                            <div key={option.id} className="relative group">
                                                <input
                                                    type={allow_multiple ? "checkbox" : "radio"}
                                                    id={option.id}
                                                    name={allow_multiple ? undefined : "poll-option"}
                                                    checked={allow_multiple ? (selectedOption as string[]).includes(option.id) : selectedOption === option.id}
                                                    onChange={() => allow_multiple ? handleMultipleSelect(option.id) : handleSingleSelect(option.id)}
                                                    className="peer hidden"
                                                />
                                                <label
                                                    htmlFor={option.id}
                                                    className="flex items-center gap-3 p-3 rounded-xl border-2 border-slate-100 dark:border-slate-800 cursor-pointer transition-all hover:border-primary/40 hover:shadow-md peer-checked:border-primary peer-checked:ring-2 peer-checked:ring-primary peer-checked:bg-blue-50 dark:peer-checked:bg-slate-800/50"
                                                >
                                                    {/* Checkbox/Radio Button */}
                                                    {allow_multiple ? (
                                                        <div className={`flex-shrink-0 size-5 rounded-md border-2 flex items-center justify-center transition-all ${
                                                            (selectedOption as string[]).includes(option.id)
                                                                ? 'border-primary bg-primary'
                                                                : 'border-slate-300 bg-white dark:bg-slate-900'
                                                        }`}>
                                                            {(selectedOption as string[]).includes(option.id) && (
                                                                <svg
                                                                    className="w-3 h-3 text-white fill-white"
                                                                    viewBox="0 0 20 20"
                                                                >
                                                                    <path
                                                                        fillRule="evenodd"
                                                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                        clipRule="evenodd"
                                                                    />
                                                                </svg>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div className={`flex-shrink-0 size-5 rounded-full border-2 flex items-center justify-center transition-all ${
                                                            selectedOption === option.id
                                                                ? 'border-primary bg-primary'
                                                                : 'border-slate-300 bg-white dark:bg-slate-900'
                                                        }`}>
                                                            {selectedOption === option.id && (
                                                                <svg
                                                                    className="w-3 h-3 text-white fill-white"
                                                                    viewBox="0 0 20 20"
                                                                >
                                                                    <path
                                                                        fillRule="evenodd"
                                                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                        clipRule="evenodd"
                                                                    />
                                                                </svg>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* Text Content */}
                                                    <div className="flex flex-col gap-0.5 grow">
                                                        <span className="text-slate-900 dark:text-slate-100 font-bold text-xs">
                                                            {option.title}
                                                        </span>
                                                    </div>
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="bg-gradient-to-r from-blue-50 to-blue-50 dark:from-slate-800 dark:to-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700 flex flex-col md:flex-row items-center justify-between gap-2">
                                <div className="flex flex-col items-center md:items-start">
                                    <span className="text-slate-900 dark:text-slate-100 font-bold text-xs">
                                        Rate this Poll
                                    </span>
                                    <span className="text-slate-500 dark:text-slate-400 text-[10px] italic">
                                        Help us improve
                                    </span>
                                </div>
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            className={`text-sm p-1 rounded-md hover:scale-110 transition-all ${
                                                star <= rating
                                                    ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-400'
                                                    : 'bg-slate-100 dark:bg-slate-700 text-slate-300 dark:text-slate-600 hover:bg-amber-50 dark:hover:bg-amber-900/20'
                                            }`}
                                        >
                                            ⭐
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Action Bar */}
                            <div className="flex items-center justify-center pt-3 border-t border-slate-100 dark:border-slate-800 mt-3">
                                <Button 
                                    onClick={handleCastVote}
                                    className="w-full sm:w-auto min-w-[120px] bg-primary hover:bg-blue-700 text-white font-bold py-1.5 px-4 rounded-full shadow-lg shadow-primary/30 transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-1.5 text-xs">
                                    <span>Cast Vote</span>
                                    <svg
                                        className="w-3 h-3"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                        />
                                    </svg>
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Rating Section */}
                </div>
            </div>

            {/* Feedback Modal */}
            {showFeedbackModal && (
                <div className={`${previewMode === 'pc' ? 'fixed' : 'absolute'} inset-0 bg-black/50 flex items-center justify-center p-4 z-50`}>
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 p-6 w-full max-w-[380px] space-y-4 animate-in fade-in zoom-in-95 duration-300">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <button
                                type="button"
                                onClick={handleSkipFeedback}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Form Fields */}
                        <div className="flex flex-col gap-3">
                            {/* Email Field */}
                            <label className="flex flex-col w-full">
                                <p className="text-slate-900 dark:text-slate-100 text-xs font-bold leading-normal pb-1">Email <span className="text-slate-400">(Optional)</span></p>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    aria-label="Email"
                                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-slate-900 dark:text-slate-100 focus:outline-0 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 focus:border-primary focus:ring-2 focus:ring-primary/20 h-9 placeholder:text-slate-400 dark:placeholder:text-slate-500 p-3 text-sm font-normal leading-normal transition-all"
                                    placeholder="Enter your email address"
                                />
                            </label>

                            {/* Feedback Field */}
                            <label className="flex flex-col w-full">
                                <p className="text-slate-900 dark:text-slate-100 text-xs font-bold leading-normal pb-1">Detailed Feedback <span className="text-slate-400">(Optional)</span></p>
                                <textarea
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    aria-label="Detailed Feedback"
                                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-slate-900 dark:text-slate-100 focus:outline-0 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 focus:border-primary focus:ring-2 focus:ring-primary/20 min-h-[100px] placeholder:text-slate-400 dark:placeholder:text-slate-500 p-3 text-sm font-normal leading-normal transition-all"
                                    placeholder="Provide your detailed feedback here..."
                                />
                            </label>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-center pt-1">
                            <button
                                type="button"
                                onClick={handleSubmitFeedback}
                                disabled={isSubmitting}
                                className={`w-full text-white font-bold py-2 px-6 rounded-full shadow-lg transition-all transform flex items-center justify-center gap-2 text-sm ${
                                    isSubmitting
                                        ? 'bg-blue-500 cursor-not-allowed opacity-80'
                                        : 'bg-primary hover:bg-blue-700 shadow-primary/30 hover:-translate-y-0.5 active:scale-95'
                                }`}>
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span className="truncate">Submitting...</span>
                                    </>
                                ) : (
                                    <span className="truncate">Submit</span>
                                )}
                            </button>
                        </div>

                        {/* Skip Link */}
                        <button
                            type="button"
                            onClick={handleSkipFeedback}
                            disabled={isSubmitting}
                            className={`w-full text-xs font-medium leading-normal text-center underline transition-colors ${
                                isSubmitting
                                    ? 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
                                    : 'text-slate-400 dark:text-slate-500 hover:text-primary dark:hover:text-primary cursor-pointer'
                            }`}
                        >
                            No thanks, maybe later
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default PollPreviewAll
