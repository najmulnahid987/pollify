"use client"

import React from 'react'
import { SessionProvider } from "next-auth/react"
import { HydrationProvider } from "./HydrationProvider"

const SationWraper = ({ children }) => {
  return (
    <HydrationProvider>
      <SessionProvider>
        {children}
      </SessionProvider>
    </HydrationProvider>
  )
}

export default SationWraper
