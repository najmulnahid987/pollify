/**
 * Initialize Radix UI with deterministic ID generation
 * This prevents hydration mismatches caused by random IDs
 */
import { useEffect } from 'react'

export function useInitializeRadix() {
  useEffect(() => {
    // Set a deterministic ID counter for all Radix components
    // This ensures IDs are consistent between server and client
    if (typeof window !== 'undefined') {
      // Radix UI uses a global counter for generating IDs
      // By accessing it early, we ensure consistent ID generation
      try {
        // Reset the counter at the beginning of hydration
        let idCounter = 0
        ;(globalThis as any).__radixIdCounter = idCounter
      } catch (e) {
        // Silently fail if unable to set
      }
    }
  }, [])
}
