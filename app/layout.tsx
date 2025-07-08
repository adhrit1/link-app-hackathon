import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ConditionalLayout } from "@/components/conditional-layout";
import { AuthProvider } from "@/lib/AuthContext";
import { ConditionalChatModal } from "./components/ConditionalChatModal";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AgentSystemProvider } from "@/components/AgentSystem";
import { ConditionalBearAgent } from "@/components/ConditionalBearAgent";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LINK APP - UC Berkeley Student Hub",
  description: "Your comprehensive student experience platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <SidebarProvider>
            <AgentSystemProvider>
              <ConditionalLayout>
                {children}
              </ConditionalLayout>
              <ConditionalBearAgent />
            </AgentSystemProvider>
            <ConditionalChatModal />
          </SidebarProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
