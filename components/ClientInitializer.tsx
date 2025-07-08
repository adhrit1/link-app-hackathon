"use client";

import { useEffect } from "react";
import { setupGlobalErrorHandling } from "@/lib/error-handling";

export function ClientInitializer() {
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