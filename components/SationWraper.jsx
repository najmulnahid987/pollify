"use client"

import React from 'react'
import { SessionProvider } from "next-auth/react"

const  SationWraper = ({children}) =>  {
  return (
    <SessionProvider>{children}</SessionProvider>
  )
}

export default SationWraper
