"use client"

import * as React from "react"
import { MenuIcon } from "lucide-react"

import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { useSidebar } from "@/components/ui/sidebar"

interface AppHeaderProps {
  breadcrumbs?: {
    title: string;
    href?: string;
  }[];
  actions?: React.ReactNode;
}

export function AppHeader({ breadcrumbs = [], actions }: AppHeaderProps) {
  const { toggleSidebar } = useSidebar()

  return (
    <header className="border-b flex items-center justify-between h-16 px-4 w-full">
      {/* Only show the left hamburger when the sidebar is visible (on larger screens) */}
      <div className="hidden md:flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <MenuIcon className="h-5 w-5" />
        </Button>
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((breadcrumb, index) => (
              <React.Fragment key={breadcrumb.title}>
                <BreadcrumbItem>
                  {index === breadcrumbs.length - 1 ? (
                    <BreadcrumbPage>{breadcrumb.title}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={breadcrumb.href || "#"}>
                      {breadcrumb.title}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      
      {/* On smaller screens, show breadcrumbs without hamburger */}
      <div className="md:hidden flex-1">
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((breadcrumb, index) => (
              <React.Fragment key={breadcrumb.title}>
                <BreadcrumbItem>
                  {index === breadcrumbs.length - 1 ? (
                    <BreadcrumbPage>{breadcrumb.title}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={breadcrumb.href || "#"}>
                      {breadcrumb.title}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Actions area */}
      {actions && (
        <div className="flex items-center">
          {actions}
        </div>
      )}
      
      {/* Only show hamburger on the right for smaller screens when no actions */}
      {!actions && (
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            <MenuIcon className="h-5 w-5" />
          </Button>
        </div>
      )}
    </header>
  )
} 