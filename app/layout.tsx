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
import { setupGlobalErrorHandling } from "@/lib/error-handling";
import { SkipLink } from "@/components/ui/accessibility";
import { useEffect } from "react";

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
  keywords: ["UC Berkeley", "student", "university", "campus", "academic"],
  authors: [{ name: "LINK APP Team" }],
  viewport: "width=device-width, initial-scale=1",
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

// Client-side initialization component
function ClientInitializer() {
  useEffect(() => {
    // Setup global error handling
    setupGlobalErrorHandling();
    
    // Preload critical resources
    const preloadResources = () => {
      // Preload critical images
      const criticalImages = [
        "/berkley-logo.jpeg",
        "/logo.jpeg",
      ];
      
      criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
      });
      
      // Preload critical fonts
      const fontLink = document.createElement('link');
      fontLink.rel = 'preload';
      fontLink.as = 'font';
      fontLink.href = '/fonts/geist-sans.woff2';
      fontLink.crossOrigin = 'anonymous';
      document.head.appendChild(fontLink);
    };
    
    preloadResources();
    
    // Setup service worker for offline support
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // Silently fail if service worker registration fails
      });
    }
    
    // Setup performance monitoring
    if (typeof window !== 'undefined') {
      // Monitor Core Web Vitals
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'largest-contentful-paint') {
            console.log('LCP:', entry.startTime);
          }
          if (entry.entryType === 'first-input') {
            const firstInputEntry = entry as PerformanceEventTiming;
            console.log('FID:', firstInputEntry.processingStart - firstInputEntry.startTime);
          }
          if (entry.entryType === 'layout-shift') {
            const layoutShiftEntry = entry as any;
            console.log('CLS:', layoutShiftEntry.value);
          }
        }
      });
      
      observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
    }
  }, []);

  return null;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* DNS prefetch for performance */}
        <link rel="dns-prefetch" href="//api.berkeley.edu" />
        <link rel="dns-prefetch" href="//groq.com" />
        
        {/* Meta tags for accessibility */}
        <meta name="theme-color" content="#000000" />
        <meta name="color-scheme" content="light dark" />
        
        {/* Structured data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "LINK APP",
              "description": "UC Berkeley Student Hub - Comprehensive student experience platform",
              "url": "https://linkapp.berkeley.edu",
              "applicationCategory": "EducationalApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              }
            })
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Skip link for accessibility */}
        <SkipLink href="#main-content">Skip to main content</SkipLink>
        
        <NotificationProvider>
          <AuthProvider>
            <SidebarProvider>
              <AgentSystemProvider>
                <ConditionalLayout>
                  <main id="main-content" tabIndex={-1}>
                    {children}
                  </main>
                </ConditionalLayout>
                <ConditionalBearAgent />
              </AgentSystemProvider>
              <ConditionalChatModal />
            </SidebarProvider>
          </AuthProvider>
          
          {/* Toast notifications */}
          <ToastContainer />
          
          {/* Client-side initializer */}
          <ClientInitializer />
        </NotificationProvider>
      </body>
    </html>
  );
}
