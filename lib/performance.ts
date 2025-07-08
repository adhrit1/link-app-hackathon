// Performance optimization utilities for LINK APP

// Cache configuration
const CACHE_CONFIG = {
  // API response cache (5 minutes)
  API_CACHE_TTL: 5 * 60 * 1000,
  // User preferences cache (1 hour)
  USER_CACHE_TTL: 60 * 60 * 1000,
  // Static data cache (24 hours)
  STATIC_CACHE_TTL: 24 * 60 * 60 * 1000,
  // Max cache size
  MAX_CACHE_SIZE: 100,
};

// Simple in-memory cache with TTL
class Cache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  set(key: string, data: any, ttl: number = CACHE_CONFIG.API_CACHE_TTL): void {
    // Clean expired entries
    this.cleanup();
    
    // Remove oldest entries if cache is full
    if (this.cache.size >= CACHE_CONFIG.MAX_CACHE_SIZE) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  get(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > entry.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }

  clear(): void {
    this.cache.clear();
  }
}

// Global cache instance
export const cache = new Cache();

// Debounce utility
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle utility
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Lazy loading utility
export function lazyLoad<T>(
  loader: () => Promise<T>,
  cacheKey?: string
): Promise<T> {
  if (cacheKey) {
    const cached = cache.get(cacheKey);
    if (cached) {
      return Promise.resolve(cached);
    }
  }

  return loader().then((result) => {
    if (cacheKey) {
      cache.set(cacheKey, result);
    }
    return result;
  });
}

// Performance monitoring
export class PerformanceMonitor {
  public metrics: Map<string, number[]> = new Map();

  startTimer(name: string): () => void {
    const start = performance.now();
    return () => {
      const duration = performance.now() - start;
      if (!this.metrics.has(name)) {
        this.metrics.set(name, []);
      }
      this.metrics.get(name)!.push(duration);
    };
  }

  getAverageTime(name: string): number {
    const times = this.metrics.get(name);
    if (!times || times.length === 0) return 0;
    return times.reduce((a, b) => a + b, 0) / times.length;
  }

  getMetrics(): Record<string, { avg: number; count: number }> {
    const result: Record<string, { avg: number; count: number }> = {};
    for (const [name, times] of this.metrics.entries()) {
      result[name] = {
        avg: this.getAverageTime(name),
        count: times.length,
      };
    }
    return result;
  }

  clear(): void {
    this.metrics.clear();
  }
}

export const performanceMonitor = new PerformanceMonitor();

// Image optimization
export function optimizeImage(url: string, width: number, height?: number): string {
  // Add image optimization parameters
  const params = new URLSearchParams();
  params.set('w', width.toString());
  if (height) params.set('h', height.toString());
  params.set('q', '80'); // Quality
  params.set('fit', 'crop');
  
  return `${url}?${params.toString()}`;
}

// Preload critical resources
export function preloadResource(url: string, type: 'image' | 'script' | 'style'): void {
  const link = document.createElement('link');
  link.rel = type === 'image' ? 'preload' : 'prefetch';
  link.as = type;
  link.href = url;
  document.head.appendChild(link);
}

// Intersection Observer for lazy loading
export function createIntersectionObserver(
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverInit = {}
): IntersectionObserver {
  return new IntersectionObserver(callback, {
    rootMargin: '50px',
    threshold: 0.1,
    ...options,
  });
}

// Virtual scrolling utilities
export function calculateVirtualScrollRange(
  containerHeight: number,
  itemHeight: number,
  totalItems: number,
  scrollTop: number
): { start: number; end: number } {
  const start = Math.floor(scrollTop / itemHeight);
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const end = Math.min(start + visibleCount + 1, totalItems);
  
  return { start, end };
}

// Memory management
export function cleanupMemory(): void {
  // Clear caches
  cache.clear();
  
  // Clear performance metrics
  performanceMonitor.clear();
  
  // Force garbage collection if available
  if (window.gc) {
    window.gc();
  }
}

// Export cache config for use in components
export { CACHE_CONFIG }; 