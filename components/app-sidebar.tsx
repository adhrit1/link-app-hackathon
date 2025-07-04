"use client"

import * as React from "react"
import {
  AudioWaveform,
  Briefcase,
  Command,
  Frame,
  GalleryVerticalEnd,
  Home,
  Map,
  PieChart,
  Beaker,
  Plus,
  FolderKanban,
  MessageSquare,
} from "lucide-react"
import { useState, useEffect } from "react"
import { useAuth } from "@/lib/AuthContext"

import { NavProjects } from "@/components/nav-projects"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  teams: [
    {
      name: "Zephea",
      logo: GalleryVerticalEnd,
      plan: "Pro",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "All Models",
      url: "/all-models",
      icon: Beaker,
    }
  ],
  projects: [
    {
      name: "New Model",
      url: "/",
      icon: Plus,
      isButton: true,
    },
    {
      name: "Projects",
      url: "/create-project",
      icon: FolderKanban,
    },
    {
      name: "Feedback",
      url: "mailto:tomnewms@gmail.com?subject=Zephea%20Feedback",
      icon: MessageSquare,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [models, setModels] = useState<any[]>([])
  const { user } = useAuth()

  // Function to safely access sessionStorage
  const getStoredModels = () => {
    if (typeof window !== 'undefined') {
      const cached = sessionStorage.getItem('sidebarModels')
      if (cached) {
        try {
          const parsedModels = JSON.parse(cached)
          setModels(parsedModels)
        } catch (e) {
          console.error('Error parsing stored models:', e)
        }
      }
    }
  }

  // Function to safely store models
  const storeModels = (modelsArray: any[]) => {
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('sidebarModels', JSON.stringify(modelsArray))
      } catch (e) {
        console.error('Error storing models:', e)
      }
    }
  }

  const fetchUserModels = async () => {
    // Check if we already have models in state
    if (models.length > 0) {
      return
    }

    try {
      const url = `https://zephea-api.vercel.app/api/get_user_models?uuid=7d90ea1d-bf9a-48fa-bebd-a8d634964db0`
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch models: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json()
      const modelsArray = data.models || []
      
      // Store in sessionStorage and update state
      storeModels(modelsArray)
      setModels(modelsArray)
    } catch (error) {
      console.error('Error fetching models:', error)
    }
  }

  // Effect to load stored models on mount (client-side only)
  useEffect(() => {
    getStoredModels()
  }, [])

  // Effect to fetch models if none are stored
  useEffect(() => {
    if (models.length === 0) {
      fetchUserModels()
    }
  }, [])

  // Only keep the dashboard link in projects
  const dashboardProjects = [
    {
      name: "Dashboard",
      url: "/",
      icon: Home,
    },
  ];

  // Only keep the dashboard link in navMain
  const dashboardNavMain = [
    {
      title: "Dashboard",
      url: "/",
      icon: Home,
    },
  ];

  const navMainItems = [
    {
      title: "All Models",
      url: "/all-models",
      icon: Beaker,
      isActive: true,
      items: models.map(model => ({
        key: `model-${model.id}`,
        title: `${model.model_name} (${model.model_category})`,
        url: `/model/${model.id}`
      }))
    },
    {
      title: "Keywords",
      url: "/keywords",
      icon: Frame,
    }
  ]

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={dashboardProjects} />
        <NavMain items={dashboardNavMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
