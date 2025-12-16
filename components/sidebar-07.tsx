"use client"

import { useState } from "react"
import { Home, Search, ChevronDown, MoreHorizontal, LogOut, MessageCircle, Plus, FileText, Settings, Trash2, Edit2 } from "lucide-react"
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

import { SearchPollsModal } from "./SearchPollsModal"

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
  {
    id: 6,
    title: "Preferred IDE/Editor",
  },
  {
    id: 7,
    title: "Best Frontend Framework",
  },
  {
    id: 8,
    title: "Favorite Operating System",
  },
  {
    id: 9,
    title: "Best Code Review Practice",
  },
  {
    id: 10,
    title: "Preferred Testing Framework",
  },
  {
    id: 11,
    title: "Best Database Technology",
  },
  {
    id: 12,
    title: "Favorite Version Control System",
  },
  {
    id: 13,
    title: "Best Design System Tool",
  },
  {
    id: 14,
    title: "Preferred Project Management Tool",
  },
  {
    id: 15,
    title: "Best API Documentation Tool",
  },
  {
    id: 16,
    title: "Favorite Debugging Method",
  },
  {
    id: 17,
    title: "Best Time for Standup Meetings",
  },
  {
    id: 18,
    title: "Preferred Backend Language",
  },
  {
    id: 19,
    title: "Best CSS Framework",
  },
  {
    id: 20,
    title: "Favorite Package Manager",
  },
]

export function Sidebar07() {
  const { data: session } = useSession()
  const router = useRouter()
  const [hoveredPollId, setHoveredPollId] = useState<number | null>(null)
  const [pollsList, setPollsList] = useState(polls)
  const [renamingPollId, setRenamingPollId] = useState<number | null>(null)
  const [newPollTitle, setNewPollTitle] = useState("")
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut({ redirect: false })
    router.push("/auth/login")
  }

  const handleDeletePoll = (id: number) => {
    setPollsList(pollsList.filter((poll) => poll.id !== id))
    setHoveredPollId(null)
  }

  const handleRenamePoll = (id: number) => {
    const poll = pollsList.find((p) => p.id === id)
    if (poll) {
      setRenamingPollId(id)
      setNewPollTitle(poll.title)
    }
  }

  const handleSaveRename = (id: number) => {
    if (newPollTitle.trim()) {
      setPollsList(
        pollsList.map((poll) =>
          poll.id === id ? { ...poll, title: newPollTitle } : poll
        )
      )
    }
    setRenamingPollId(null)
    setNewPollTitle("")
  }

  return (
    <Sidebar collapsible="icon" suppressHydrationWarning>
      <SidebarHeader suppressHydrationWarning>
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
      <SidebarContent suppressHydrationWarning>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    {item.title === "Search" ? (
                      <button onClick={() => setIsSearchOpen(true)} className="hover:cursor-pointer">
                        <item.icon />
                        <span>{item.title}</span>
                      </button>
                    ) : item.title === "Create" ? (
                      <button onClick={() => router.push("/dashboard/dashboardCreate")} className="hover:cursor-pointer">
                        <item.icon />
                        <span>{item.title}</span>
                      </button>
                    ) : item.title === "Home" ? (
                      <button onClick={() => router.push("/dashboard")} className="hover:cursor-pointer">
                        <item.icon />
                        <span>{item.title}</span>
                      </button>
                    ) : (
                      <a href={item.url} className="hover:cursor-pointer">
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="flex-1">
          <SidebarGroupLabel>Your polls</SidebarGroupLabel>
          <SidebarGroupContent className="flex-1 overflow-y-auto max-h-[400px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <SidebarMenu>
              {pollsList.map((poll) => (
                <SidebarMenuItem key={poll.id} className="group">
                  {renamingPollId === poll.id ? (
                    <div className="flex items-center gap-2 px-2 py-1.5">
                      <input
                        type="text"
                        value={newPollTitle}
                        onChange={(e) => setNewPollTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSaveRename(poll.id)
                          if (e.key === "Escape") setRenamingPollId(null)
                        }}
                        autoFocus
                        className="flex-1 px-2 py-1 text-sm border rounded bg-sidebar-accent text-sidebar-accent-foreground outline-none"
                      />
                      <button
                        onClick={() => handleSaveRename(poll.id)}
                        className="text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-sidebar-accent group/item">
                      <a
                        href={`#poll-${poll.id}`}
                        className="flex-1 text-sm truncate"
                      >
                        <span className="truncate">{poll.title}</span>
                      </a>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            className="p-1 rounded opacity-0 group-hover/item:opacity-100 hover:bg-sidebar-accent/80 transition-opacity"
                            onClick={(e) => e.preventDefault()}
                          >
                            <MoreHorizontal className="size-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem
                            onClick={() => handleRenamePoll(poll.id)}
                          >
                            <Edit2 className="mr-2 size-4" />
                            <span>Rename</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDeletePoll(poll.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 size-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter suppressHydrationWarning>
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

      <SearchPollsModal
        isOpen={isSearchOpen}
        polls={pollsList}
        onClose={() => setIsSearchOpen(false)}
      />
    </Sidebar>
  )
}
