"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Loader2, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Skeleton component for content loading
export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}

// Card skeleton for module cards
export function CardSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-6 space-y-4">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[150px]" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[80%]" />
        <Skeleton className="h-4 w-[60%]" />
      </div>
    </div>
  );
}

// Table skeleton
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      <div className="flex space-x-4">
        <Skeleton className="h-4 w-[100px]" />
        <Skeleton className="h-4 w-[150px]" />
        <Skeleton className="h-4 w-[120px]" />
        <Skeleton className="h-4 w-[80px]" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex space-x-4">
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-4 w-[150px]" />
          <Skeleton className="h-4 w-[120px]" />
          <Skeleton className="h-4 w-[80px]" />
        </div>
      ))}
    </div>
  );
}

// Progress bar component
export function ProgressBar({
  progress,
  className,
  showPercentage = true,
}: {
  progress: number;
  className?: string;
  showPercentage?: boolean;
}) {
  const clampedProgress = Math.max(0, Math.min(100, progress));
  
  return (
    <div className={cn("w-full", className)}>
      <div className="flex justify-between text-sm text-muted-foreground mb-2">
        <span>Progress</span>
        {showPercentage && <span>{Math.round(clampedProgress)}%</span>}
      </div>
      <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
        <motion.div
          className="h-full bg-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${clampedProgress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

// Loading spinner with different sizes
export function LoadingSpinner({
  size = "default",
  className,
}: {
  size?: "sm" | "default" | "lg" | "xl";
  className?: string;
}) {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-6 w-6",
    lg: "h-8 w-8",
    xl: "h-12 w-12",
  };

  return (
    <Loader2
      className={cn("animate-spin", sizeClasses[size], className)}
    />
  );
}

// Full page loading state
export function FullPageLoader({
  message = "Loading...",
  showProgress = false,
  progress = 0,
}: {
  message?: string;
  showProgress?: boolean;
  progress?: number;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <LoadingSpinner size="xl" className="mx-auto mb-4" />
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="text-lg font-medium text-foreground"
        >
          {message}
        </motion.p>
        {showProgress && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="w-64 mx-auto"
          >
            <ProgressBar progress={progress} />
          </motion.div>
        )}
      </div>
    </div>
  );
}

// Module-specific loading state
export function ModuleLoader({
  moduleName,
  description,
}: {
  moduleName: string;
  description?: string;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <LoadingSpinner size="lg" className="text-white" />
        </motion.div>
        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="text-xl font-semibold text-gray-900 mb-2"
        >
          Loading {moduleName}...
        </motion.h3>
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="text-gray-600"
          >
            {description}
          </motion.p>
        )}
      </div>
    </div>
  );
}

// Status indicator with different states
export function StatusIndicator({
  status,
  message,
  className,
}: {
  status: "loading" | "success" | "error" | "pending";
  message: string;
  className?: string;
}) {
  const statusConfig = {
    loading: {
      icon: Loader2,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      iconClass: "animate-spin",
    },
    success: {
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
      iconClass: "",
    },
    error: {
      icon: AlertCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      iconClass: "",
    },
    pending: {
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      iconClass: "",
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "flex items-center space-x-3 p-3 rounded-lg",
        config.bgColor,
        className
      )}
    >
      <Icon className={cn("h-5 w-5", config.color, config.iconClass)} />
      <span className={cn("text-sm font-medium", config.color)}>
        {message}
      </span>
    </motion.div>
  );
}

// Loading overlay for modals/dialogs
export function LoadingOverlay({
  isVisible,
  message = "Processing...",
}: {
  isVisible: boolean;
  message?: string;
}) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <div className="text-center space-y-3">
            <LoadingSpinner size="lg" />
            <p className="text-sm text-muted-foreground">{message}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Pulse loading animation
export function PulseLoader({
  count = 3,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div className={cn("flex space-x-2", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="w-2 h-2 bg-primary rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  );
}

// Shimmer effect for text
export function ShimmerText({
  className,
  lines = 1,
}: {
  className?: string;
  lines?: number;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-gradient-to-r from-muted via-background to-muted bg-[length:200%_100%] animate-pulse rounded"
          style={{
            animation: "shimmer 2s infinite",
          }}
        />
      ))}
    </div>
  );
}

// Loading button with different states
export function LoadingButton({
  loading,
  children,
  loadingText = "Loading...",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  loadingText?: string;
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      disabled={loading}
      {...props}
    >
      {loading && <LoadingSpinner size="sm" />}
      {loading ? loadingText : children}
    </button>
  );
} 