"use client"

import { useState, useEffect } from "react"
import { Home, Search, ChevronDown, MoreHorizontal, LogOut, MessageCircle, Plus, FileText, Settings, Trash2, Edit2 } from "lucide-react"
import { useAuth } from "@/app/auth/AuthProvider"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"

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

export function Sidebar07() {
  const { user, signOut: authSignOut } = useAuth()
  const router = useRouter()
  const [hoveredPollId, setHoveredPollId] = useState<string | null>(null)
  const [pollsList, setPollsList] = useState<any[]>([])
  const [renamingPollId, setRenamingPollId] = useState<string | null>(null)
  const [newPollTitle, setNewPollTitle] = useState("")
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch user's polls from Supabase
  useEffect(() => {
    const fetchPolls = async () => {
      if (!user) {
        setIsLoading(false)
        return
      }

      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('polls')
          .select('id, title, description')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Error fetching polls:', error)
          setPollsList([])
        } else {
          setPollsList(data || [])
        }
      } catch (error) {
        console.error('Error fetching polls:', error)
        setPollsList([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchPolls()
  }, [user])

  const handleSignOut = async () => {
    try {
      await authSignOut()
      router.push("/auth/login")
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  const handleDeletePoll = async (id: string) => {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('polls')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting poll:', error)
      } else {
        setPollsList(pollsList.filter((poll) => poll.id !== id))
        setHoveredPollId(null)
      }
    } catch (error) {
      console.error('Error deleting poll:', error)
    }
  }

  const handleRenamePoll = (id: string) => {
    const poll = pollsList.find((p) => p.id === id)
    if (poll) {
      setRenamingPollId(id)
      setNewPollTitle(poll.title)
    }
  }

  const handleSaveRename = async (id: string) => {
    if (newPollTitle.trim()) {
      try {
        const supabase = createClient()
        const { error } = await supabase
          .from('polls')
          .update({ title: newPollTitle })
          .eq('id', id)

        if (error) {
          console.error('Error updating poll:', error)
        } else {
          setPollsList(
            pollsList.map((poll) =>
              poll.id === id ? { ...poll, title: newPollTitle } : poll
            )
          )
        }
      } catch (error) {
        console.error('Error updating poll:', error)
      }
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
                      <button onClick={() => router.push("/dashboard")} className="hover:cursor-pointer">
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
              {isLoading ? (
                <div className="px-2 py-4 text-sm text-muted-foreground">
                  Loading polls...
                </div>
              ) : pollsList.length === 0 ? (
                <div className="px-2 py-4 text-sm text-muted-foreground">
                  No polls created yet
                </div>
              ) : (
                pollsList.map((poll) => (
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
                          href={`/dashboard/poll/${poll.id}`}
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
                ))
              )}
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
                      {user?.user_metadata?.full_name || user?.email?.split('@')[0] || "User"}
                    </span>
                    <span className="truncate text-xs">
                      {user?.email || "Not logged in"}
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
