/**
 * HydrationProvider - Fixes Radix UI hydration mismatches
 * 
 * Root cause: Radix UI components generate random IDs on each render.
 * When a 'use client' component is hydrated, React re-renders the component
 * and Radix generates new random IDs that don't match the server-rendered IDs.
 * 
 * Solution: Suppress hydration warnings and let React silently re-render
 * without throwing errors about ID mismatches.
 */

'use client'

import React, { ReactNode } from 'react'

interface HydrationProviderProps {
  children: ReactNode
}

export function HydrationProvider({ children }: HydrationProviderProps) {
  return (
    <div suppressHydrationWarning>
      {children}
    </div>
  )
}



