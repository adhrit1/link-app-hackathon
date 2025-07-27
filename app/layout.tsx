import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ConditionalLayout } from "@/components/conditional-layout";
import { AuthProvider } from "@/lib/AuthContext";
import { ConditionalChatModal } from "./components/ConditionalChatModal";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AgentSystemProvider } from "@/components/AgentSystem";
import { ConditionalBearAgent } from "@/components/ConditionalBearAgent";
import { NotificationProvider, ToastContainer } from "@/components/ui/notifications";
import { SkipLink } from "@/components/ui/accessibility";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LINK APP - UC Berkeley Student Hub",
  description: "Your comprehensive student experience platform",
  keywords: ["UC Berkeley", "student", "university", "campus", "academic"],
  authors: [{ name: "UC Berkeley" }],
  robots: "index, follow",
  openGraph: {
    title: "LINK APP - UC Berkeley Student Hub",
    description: "Your comprehensive student experience platform",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "LINK APP - UC Berkeley Student Hub",
    description: "Your comprehensive student experience platform",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable}`}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <SkipLink href="#main-content">Skip to main content</SkipLink>
        <AuthProvider>
          <NotificationProvider>
          <SidebarProvider>
            <AgentSystemProvider>
              <ConditionalLayout>
                {children}
                  <ConditionalChatModal />
                  <ConditionalBearAgent />
              </ConditionalLayout>
            </AgentSystemProvider>
          </SidebarProvider>
            <ToastContainer />
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
