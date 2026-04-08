"use client"

import React from 'react'
import { AuthProvider } from "@/app/auth/AuthProvider"
import { HydrationProvider } from "./HydrationProvider"

const SationWraper = ({ children }) => {
  return (
    <HydrationProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </HydrationProvider>
  )
}

export default SationWraper
