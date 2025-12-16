/**
 * Radix UI Configuration
 * Fixes hydration issues by ensuring consistent ID generation
 */

import { createContext, useContext, useId } from 'react'

const RadixIdContext = createContext<string>('')

export function useRadixId() {
  const context = useContext(RadixIdContext)
  const id = useId()
  return context || id
}

export function RadixIdProvider({ children }: { children: React.ReactNode }) {
  const id = useId()
  return (
    <RadixIdContext.Provider value={id}>
      {children}
    </RadixIdContext.Provider>
  )
}
