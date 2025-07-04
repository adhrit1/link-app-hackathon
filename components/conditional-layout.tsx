"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { usePathname } from "next/navigation";
import { SessionNavBar } from "@/components/ui/sidebar";

// Auth pages that shouldn't have the sidebar
const authPages = ["/login", "/signup"];

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = authPages.includes(pathname);

  if (isAuthPage) {
    // For auth pages, render without sidebar
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        {children}
      </div>
    );
  }

  // For all other pages, render with sidebar
  return (
    <div className="flex h-screen w-full">
      <SessionNavBar />
      <div className="flex-1 flex flex-col w-full">
        {children}
      </div>
    </div>
  );
} 