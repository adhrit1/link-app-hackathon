"use client";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge"
import {
  Blocks,
  ChevronsUpDown,
  FileClock,
  GraduationCap,
  Layout,
  LayoutDashboard,
  LogOut,
  MessageSquareText,
  MessagesSquare,
  Plus,
  Settings,
  UserCircle,
  UserCog,
  UserSearch,
  ShoppingCart,
  Wallet2,
  BookOpen,
  Calendar,
  Activity,
} from "lucide-react";
import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, createContext, useContext } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/lib/AuthContext";
import { LogoutButton } from "@/components/logout-button";

// Create a sidebar context
interface SidebarContextProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextProps>({
  isOpen: true,
  toggleSidebar: () => {},
});

// Create the sidebar provider component
export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <SidebarContext.Provider value={{ isOpen, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
}

// Create the custom hook
export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}

const sidebarVariants = {
  open: {
    width: "15rem",
  },
  closed: {
    width: "3.05rem",
  },
};

const contentVariants = {
  open: { display: "block", opacity: 1 },
  closed: { display: "block", opacity: 1 },
};

const variants = {
  open: {
    x: 0,
    opacity: 1,
    transition: {
      x: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    x: -20,
    opacity: 0,
    transition: {
      x: { stiffness: 100 },
    },
  },
};

const transitionProps = {
  type: "tween" as const,
  ease: "easeOut" as const,
  duration: 0.2,
  staggerChildren: 0.1,
};

const staggerVariants = {
  open: {
    transition: { staggerChildren: 0.03, delayChildren: 0.02 },
  },
};

// Move AccountDropdown definition here so it's defined before use
function AccountDropdown({ isCollapsed, variants }: { isCollapsed: boolean, variants: any }) {
  const { user } = useAuth();
  if (!user) return null;
  const name = user.user_metadata?.name || user.email?.split("@")[0] || "User";
  const email = user.email || "";
  
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="w-full">
        <div className="flex h-8 w-full flex-row items-center gap-2 rounded-md px-2 py-1.5  transition hover:bg-muted hover:text-primary">
          <Avatar className="size-4 bg-black">
            <AvatarFallback className="bg-black"></AvatarFallback>
          </Avatar>
          <motion.li
            variants={variants}
            className="flex w-full items-center gap-2"
          >
            {!isCollapsed && (
              <>
                <p className="text-sm font-medium">{name}</p>
                <ChevronsUpDown className="ml-auto h-4 w-4 text-muted-foreground/50" />
              </>
            )}
          </motion.li>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent sideOffset={5}>
        <div className="flex flex-row items-center gap-2 p-2">
          <Avatar className="size-6 bg-black">
            <AvatarFallback className="bg-black"></AvatarFallback>
          </Avatar>
          <div className="flex flex-col text-left">
            <span className="text-sm font-medium">{name}</span>
            <span className="line-clamp-1 text-xs text-muted-foreground">{email}</span>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="flex items-center gap-2">
          <Link href="/settings/profile">
            <UserCircle className="h-4 w-4" /> Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center gap-2 p-0">
          <LogoutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function SessionNavBar() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const pathname = usePathname();
  const { user } = useAuth();
  
  const name = user?.user_metadata?.name || user?.email?.split("@")[0] || "User";
  
  return (
    <motion.div
      className={cn(
        "sidebar fixed left-0 z-40 h-full shrink-0 border-r fixed",
      )}
      initial={isCollapsed ? "closed" : "open"}
      animate={isCollapsed ? "closed" : "open"}
      variants={sidebarVariants}
      transition={transitionProps}
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(true)}
    >
      <motion.div
        className={`relative z-40 flex text-muted-foreground h-full shrink-0 flex-col bg-white dark:bg-black transition-all`}
        variants={contentVariants}
      >
        <motion.ul variants={staggerVariants} className="flex h-full flex-col">
          <div className="flex grow flex-col items-center">
            <div className="flex h-[54px] w-full shrink-0  border-b p-2">
              <div className=" mt-[1.5px] flex w-full">
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger className="w-full" asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex w-fit items-center gap-2  px-2" 
                    >
                      <Avatar className='rounded-full size-4 bg-black'>
                        <AvatarFallback className="bg-black"></AvatarFallback>
                      </Avatar>
                      <motion.li
                        variants={variants}
                        className="flex w-fit items-center gap-2"
                      >
                        {!isCollapsed && (
                          <>
                            <p className="text-sm font-medium  ">
                              {name}
                            </p>
                            <ChevronsUpDown className="h-4 w-4 text-muted-foreground/50" />
                          </>
                        )}
                      </motion.li>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem
                      asChild
                      className="flex items-center gap-2"
                    >
                      <Link href="/settings/members">
                        <UserCog className="h-4 w-4" /> Manage members
                      </Link>
                    </DropdownMenuItem>{" "}
                    <DropdownMenuItem
                      asChild
                      className="flex items-center gap-2"
                    >
                      <Link href="/settings/integrations">
                        <Blocks className="h-4 w-4" /> Integrations
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/select-org"
                        className="flex items-center gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Create or join an organization
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className=" flex h-full w-full flex-col">
              <div className="flex grow flex-col gap-4">
                <ScrollArea className="h-16 grow p-2">
                  <div className={cn("flex w-full flex-col gap-1")}>
                    <Link
                      href="/"
                      className={cn(
                        "flex h-8 w-full flex-row items-center rounded-md px-2 py-1.5   transition hover:bg-muted hover:text-primary",
                        pathname === "/" &&
                          "bg-muted text-blue-600",
                      )}
                    >
                      <LayoutDashboard className="h-4 w-4" />{" "}
                      <motion.li variants={variants}>
                        {!isCollapsed && (
                          <p className="ml-2 text-sm font-medium">Dashboard</p>
                        )}
                      </motion.li>
                    </Link>
                    <Link
                      href="/ux-analysis"
                      className={cn(
                        "flex h-8 w-full flex-row items-center rounded-md px-2 py-1.5 transition hover:bg-muted hover:text-primary",
                        pathname === "/ux-analysis" && "bg-muted text-blue-600"
                      )}
                    >
                      <Activity className="h-4 w-4" />
                      <motion.li variants={variants}>
                        {!isCollapsed && (
                          <p className="ml-2 text-sm font-medium">UX Analysis</p>
                        )}
                      </motion.li>
                    </Link>
                    <div className="flex flex-col gap-1 mt-2">
                      <div className="flex h-8 w-full flex-row items-center rounded-md px-2 py-1.5 transition hover:bg-muted hover:text-primary cursor-pointer">
                        <BookOpen className="h-4 w-4" />
                        {!isCollapsed && <p className="ml-2 text-sm font-medium">Resources</p>}
                      </div>
                      <Link
                        href="/calendar"
                        className={cn(
                          "flex h-8 w-full flex-row items-center rounded-md px-2 py-1.5 transition hover:bg-muted hover:text-primary",
                          pathname === "/calendar" && "bg-muted text-blue-600"
                        )}
                      >
                        <Calendar className="h-4 w-4" />
                        {!isCollapsed && <p className="ml-2 text-sm font-medium">Calendar</p>}
                      </Link>
                      <Link
                        href="/wallet"
                        className={cn(
                          "flex h-8 w-full flex-row items-center rounded-md px-2 py-1.5 transition hover:bg-muted hover:text-primary",
                          pathname === "/wallet" && "bg-muted text-blue-600"
                        )}
                      >
                        <Wallet2 className="h-4 w-4" />
                        {!isCollapsed && <p className="ml-2 text-sm font-medium">Wallet</p>}
                      </Link>
                    </div>
                  </div>
                </ScrollArea>
              </div>
              <div className="flex flex-col p-2">
                <Link
                  href="/settings/integrations"
                  className="mt-auto flex h-8 w-full flex-row items-center rounded-md px-2 py-1.5   transition hover:bg-muted hover:text-primary"
                >
                  <Settings className="h-4 w-4 shrink-0" />{" "}
                  <motion.li variants={variants}>
                    {!isCollapsed && (
                      <p className="ml-2 text-sm font-medium"> Settings</p>
                    )}
                  </motion.li>
                </Link>
                <div>
                  <AccountDropdown isCollapsed={isCollapsed} variants={variants} />
                </div>
              </div>
            </div>
          </div>
        </motion.ul>
      </motion.div>
    </motion.div>
  );
}
