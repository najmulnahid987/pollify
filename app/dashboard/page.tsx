import React from 'react'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Sidebar07 } from "@/components/sidebar-07"

function Page() {
  return (
    <SidebarProvider>
      <Sidebar07 />
      <main className="w-full">
        <SidebarTrigger />
        <div className="p-8">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome to your dashboard</p>
        </div>
      </main>
    </SidebarProvider>
  )
}

export default Page