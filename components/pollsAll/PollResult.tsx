import React from 'react'
import { ChartBarStacked } from './pollsResult/BarChart'
import UserOpinion from './pollsResult/userOpinino'

function PollResult() {
  return (
    <div className="flex h-full overflow-hidden">
      {/* Left Section */}
      <div className="flex-1 pl-0 overflow-hidden">
        <UserOpinion />
      </div>
      
      {/* Right Section */}
      <div className="flex-1 pl-0 overflow-y-auto scrollbar-super-thin">
        <ChartBarStacked />
      </div>
    </div>
  )
}

export default PollResult