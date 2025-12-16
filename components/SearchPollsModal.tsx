"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

interface Poll {
  id: number
  title: string
}

interface SearchPollsModalProps {
  isOpen: boolean
  polls: Poll[]
  onClose: () => void
}

export function SearchPollsModal({
  isOpen,
  polls,
  onClose,
}: SearchPollsModalProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredPolls = polls.filter((poll) =>
    poll.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("")
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-12 z-50">
      <div className="bg-white rounded-lg shadow-xl w-80 dark:bg-slate-900 overflow-hidden">
        <div className="p-4 border-b dark:border-slate-700 flex items-center justify-between">
          <input
            type="text"
            placeholder="Search polls..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
            className="flex-1 px-3 py-2 text-sm border rounded-md bg-slate-50 dark:bg-slate-800 dark:text-white dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={onClose}
            className="ml-2 p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
          >
            <X className="size-5 dark:text-white" />
          </button>
        </div>

        <div className="max-h-64 overflow-y-auto">
          {filteredPolls.length > 0 ? (
            <ul className="divide-y dark:divide-slate-700">
              {filteredPolls.map((poll) => (
                <li key={poll.id}>
                  <a
                    href={`#poll-${poll.id}`}
                    onClick={onClose}
                    className="block px-4 py-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm dark:text-gray-200 transition-colors"
                  >
                    {poll.title}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-6">
              No polls found
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
