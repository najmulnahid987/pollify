'use client'

import React from 'react'
import PollPreviewAll from '@/components/pollsAll/pollsPreview/PollPreviewAll'

export default function PreviewDemoPage() {
  return (
    <div className="w-full">
      <div className="mb-8 pt-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Poll Preview Demo</h1>
        <p className="text-gray-600">Without Images (Share without image enabled)</p>
      </div>
      <PollPreviewAll showImages={false} />
    </div>
  )
}
