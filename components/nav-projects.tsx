"use client"

import { Plus, type LucideIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

export function NavProjects({
  projects,
}: {
  projects: {
    name: string
    url: string
    icon: LucideIcon
    isButton?: boolean
  }[]
}) {
  const { isCollapsed } = useSidebar()

  return (
    <SidebarGroup>
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuItem key={item.name}>
            {item.isButton ? (
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "w-full justify-start gap-2",
                  isCollapsed && "w-10 p-0 justify-center"
                )}
                asChild
              >
                <a href={item.url} className="flex items-center">
                  <item.icon className="h-4 w-4" />
                  <span className={cn("truncate", isCollapsed && "hidden")}>
                    {item.name}
                  </span>
                </a>
              </Button>
            ) : (
              <>
                <SidebarMenuButton asChild tooltip={item.name}>
                  <a href={item.url}>
                    <item.icon />
                    {!isCollapsed && <span>{item.name}</span>}
                  </a>
                </SidebarMenuButton>
                {item.name === "Projects" && !isCollapsed && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SidebarMenuAction asChild>
                        <a href={item.url + "/new"}>
                          <Plus className="h-4 w-4" />
                          <span className="sr-only">New Project</span>
                        </a>
                      </SidebarMenuAction>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>New Project</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </>
            )}
          </SidebarMenuItem>
        ))}
        <div className="px-2">
          <div className="w-full border-t border-dashed border-muted-foreground/50" />
        </div>
      </SidebarMenu>
    </SidebarGroup>
  )
}
