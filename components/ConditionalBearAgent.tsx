"use client";

import { usePathname } from "next/navigation";
import { BearAgent } from "@/components/BearAgent";

export function ConditionalBearAgent() {
  const pathname = usePathname();
  
  // Don't show BearAgent on login page
  if (pathname === "/login") {
    return null;
  }
  
  return <BearAgent />;
} 