'use client';

import { ReactNode } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Sidebar07 } from "@/components/sidebar-07"

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider suppressHydrationWarning>
      <Sidebar07 />
      <main className="w-full" suppressHydrationWarning>
        <div className="sticky top-0 z-50 grid grid-cols-1 bg-white p-2 border">
          <SidebarTrigger />
        </div>
        {children}
      </main>
    </SidebarProvider>
  );
}
