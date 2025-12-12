"use client"

import { Home, Search, ChevronDown, MoreHorizontal, LogOut, MessageCircle, Plus, FileText, Settings } from "lucide-react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

// Menu items.
const items = [
  {
    title: "Home",
    url: "#",
    icon: Home,
  },
  {
    title: "Create",
    url: "#",
    icon: Plus,
  },
  {
    title: "Projects",
    url: "#",
    icon: FileText,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
]

// Sample polls - replace with actual data from your database
const polls = [
  {
    id: 1,
    title: "Favorite Programming Language",
  },
  {
    id: 2,
    title: "Best Pizza Topping",
  },
  {
    id: 3,
    title: "Remote Work Preference",
  },
  {
    id: 4,
    title: "Coffee vs Tea",
  },
  {
    id: 5,
    title: "Best Development Tool",
  },
]

export function Sidebar07() {
  const { data: session } = useSession()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut({ redirect: false })
    router.push("/auth/login")
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground transition-all duration-300 group-data-[collapsible=icon]:size-6 group-data-[collapsible=icon]:-ml-1">
                    <MessageCircle className="size-4 transition-transform duration-300 group-data-[collapsible=icon]:size-3" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight transition-all duration-300 group-data-[collapsible=icon]:hidden">
                    <span className="truncate font-semibold">Pollify</span>
                    <span className="truncate text-xs">Polls & Reviews</span>
                  </div>
                  <ChevronDown className="ml-auto transition-transform duration-300 group-data-[collapsible=icon]:hidden" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
                <DropdownMenuItem>
                  <span>Dashboard</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Settings</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="flex-1">
          <SidebarGroupLabel>Your Chats</SidebarGroupLabel>
          <SidebarGroupContent className="flex-1 overflow-y-auto max-h-[400px]">
            <SidebarMenu>
              {polls.map((poll) => (
                <SidebarMenuItem key={poll.id}>
                  <SidebarMenuButton asChild>
                    <a href={`#poll-${poll.id}`} className="text-sm truncate">
                      <span className="truncate">{poll.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-accent text-sidebar-accent-foreground">
                    <Settings className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {session?.user?.name || "User"}
                    </span>
                    <span className="truncate text-xs">
                      {session?.user?.email || "Not logged in"}
                    </span>
                  </div>
                  <MoreHorizontal className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem>
                  <span>Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Billing</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 size-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
