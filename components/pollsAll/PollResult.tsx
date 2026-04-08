import React from 'react'
import { ChartBarStacked } from './pollsResult/BarChart'
import UserOpinion from './pollsResult/userOpinino'

interface PollResultProps {
  poll?: {
    id: string
    title: string
    description?: string
    created_at?: string
    vote_count?: number
    is_public?: boolean
    share_without_image?: boolean
    share_without_options?: boolean
    allow_multiple?: boolean
  }
}

function PollResult({ poll }: PollResultProps) {
  // Debug: Log the poll data to verify it's being received correctly
  console.log('PollResult - poll data:', poll)
  console.log('PollResult - share_without_options:', poll?.share_without_options)

  // If share_without_options is true, show only UserOpinion (full width)
  // This means: User selected "Share Without Options" setting (feedback only mode)
  if (poll?.share_without_options === true) {
    console.log('Showing feedback-only layout (UserOpinion only)')
    return (
      <div className="w-full h-full overflow-hidden">
        <UserOpinion poll={poll} />
      </div>
    )
  }

  // Otherwise, show both UserOpinion and ChartBarStacked side by side
  // This means: User selected normal poll with voting/options
  console.log('Showing normal poll layout (UserOpinion + ChartBarStacked)')
  return (
    <div className="flex h-full overflow-hidden">
      {/* Left Section */}
      <div className="flex-1 pl-0 overflow-hidden">
        <UserOpinion poll={poll} />
      </div>
      
      {/* Right Section */}
      <div className="flex-1 pl-0 overflow-y-auto scrollbar-super-thin">
        <ChartBarStacked />
      </div>
    </div>
  )
}

export default PollResult