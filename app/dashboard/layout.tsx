'use client';

import { ReactNode } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Sidebar07 } from "@/components/sidebar-07"

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider suppressHydrationWarning>
      <Sidebar07 />
      <main className="w-full relative" suppressHydrationWarning>
        <div className="absolute top-0 left-0 z-50">
          <SidebarTrigger />
        </div>
        {children}
      </main>
    </SidebarProvider>
  );
}
