"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

export function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false);
  const { signOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await signOut();
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button 
      className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground hover:bg-accent hover:text-accent-foreground w-full"
      onClick={handleLogout} 
      disabled={isLoading}
    >
      <LogOut className="mr-2 h-4 w-4" />
      <span>{isLoading ? "Logging out..." : "Log out"}</span>
    </button>
  );
} 