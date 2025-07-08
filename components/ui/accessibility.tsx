"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

// Focus trap hook for modals and dialogs
export function useFocusTrap(enabled: boolean = true) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled || !ref.current) return;

    const element = ref.current;
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Tab") {
        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    element.addEventListener("keydown", handleKeyDown);
    firstElement?.focus();

    return () => {
      element.removeEventListener("keydown", handleKeyDown);
    };
  }, [enabled]);

  return ref;
}

// Skip link for keyboard navigation
export function SkipLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md"
    >
      {children}
    </a>
  );
}

// Screen reader only text
export function SrOnly({ children }: { children: React.ReactNode }) {
  return <span className="sr-only">{children}</span>;
}

// Live region for announcements
export function LiveRegion({
  children,
  role = "status",
  "aria-live": ariaLive = "polite",
  className,
}: {
  children: React.ReactNode;
  role?: "status" | "alert" | "log";
  "aria-live"?: "polite" | "assertive" | "off";
  className?: string;
}) {
  return (
    <div
      role={role}
      aria-live={ariaLive}
      className={cn("sr-only", className)}
    >
      {children}
    </div>
  );
}

// High contrast mode support
export function HighContrastText({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "text-foreground",
        "dark:text-foreground",
        "print:text-black",
        className
      )}
    >
      {children}
    </span>
  );
}

// Keyboard navigation indicator
export function KeyboardIndicator({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
    >
      {children}
    </span>
  );
}

// Reduced motion support
export function ReducedMotionWrapper({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("motion-reduce:animate-none", className)}>
      {children}
    </div>
  );
}

// Accessible button with proper ARIA attributes
export function AccessibleButton({
  children,
  onClick,
  disabled = false,
  loading = false,
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedby,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedby}
      aria-busy={loading}
      className={cn(
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    >
      {loading && <SrOnly>Loading</SrOnly>}
      {children}
    </button>
  );
}

// Accessible form field with proper labeling
export function AccessibleFormField({
  label,
  id,
  error,
  required = false,
  children,
  className,
}: {
  label: string;
  id: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-foreground"
      >
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
      {children}
      {error && (
        <p
          id={`${id}-error`}
          className="text-sm text-destructive"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}

// Accessible table with proper headers
export function AccessibleTable({
  headers,
  children,
  caption,
  className,
}: {
  headers: string[];
  children: React.ReactNode;
  caption?: string;
  className?: string;
}) {
  return (
    <table className={cn("w-full", className)}>
      {caption && <caption className="sr-only">{caption}</caption>}
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th
              key={index}
              scope="col"
              className="text-left text-sm font-medium text-muted-foreground p-2"
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  );
}

// Accessible list with proper ARIA attributes
export function AccessibleList({
  items,
  type = "ul",
  className,
}: {
  items: string[];
  type?: "ul" | "ol";
  className?: string;
}) {
  const Component = type;
  
  return (
    <Component className={cn("list-disc list-inside space-y-1", className)}>
      {items.map((item, index) => (
        <li key={index} className="text-sm text-foreground">
          {item}
        </li>
      ))}
    </Component>
  );
}

// Accessible dialog with proper focus management
export function AccessibleDialog({
  isOpen,
  onClose,
  title,
  children,
  className,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  const focusTrapRef = useFocusTrap(isOpen);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      <div
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      <motion.div
        ref={focusTrapRef}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={cn(
          "relative bg-background rounded-lg shadow-lg p-6 max-w-md w-full mx-4",
          className
        )}
      >
        <h2 id="dialog-title" className="text-lg font-semibold mb-4">
          {title}
        </h2>
        {children}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
          aria-label="Close dialog"
        >
          ×
        </button>
      </motion.div>
    </div>
  );
}

// Accessible progress indicator
export function AccessibleProgress({
  value,
  max = 100,
  label,
  className,
}: {
  value: number;
  max?: number;
  label?: string;
  className?: string;
}) {
  const percentage = Math.round((value / max) * 100);
  
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <div className="flex justify-between text-sm">
          <span>{label}</span>
          <span>{percentage}%</span>
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
        className="w-full bg-secondary rounded-full h-2 overflow-hidden"
      >
        <div
          className="h-full bg-primary rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// Accessible toggle switch
export function AccessibleToggle({
  checked,
  onChange,
  label,
  disabled = false,
  className,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  disabled?: boolean;
  className?: string;
}) {
  const id = React.useId();
  
  return (
    <div className={cn("flex items-center space-x-3", className)}>
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          checked ? "bg-primary" : "bg-secondary",
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        )}
      >
        <span
          className={cn(
            "inline-block h-4 w-4 transform rounded-full bg-background transition-transform",
            checked ? "translate-x-6" : "translate-x-1"
          )}
        />
      </button>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
    </div>
  );
}

// Accessible breadcrumb navigation
export function AccessibleBreadcrumb({
  items,
  className,
}: {
  items: Array<{ label: string; href?: string }>;
  className?: string;
}) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <span className="mx-2 text-muted-foreground" aria-hidden="true">
                /
              </span>
            )}
            {item.href ? (
              <a
                href={item.href}
                className="text-sm text-primary hover:text-primary/80"
                aria-current={index === items.length - 1 ? "page" : undefined}
              >
                {item.label}
              </a>
            ) : (
              <span
                className="text-sm text-muted-foreground"
                aria-current="page"
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

// Accessibility utilities
export const accessibilityUtils = {
  // Generate unique IDs
  generateId: (prefix: string = "id") => `${prefix}-${Math.random().toString(36).substr(2, 9)}`,
  
  // Check if element is focusable
  isFocusable: (element: HTMLElement) => {
    const tabIndex = element.getAttribute("tabindex");
    return (
      element.tagName === "BUTTON" ||
      element.tagName === "A" ||
      element.tagName === "INPUT" ||
      element.tagName === "SELECT" ||
      element.tagName === "TEXTAREA" ||
      (tabIndex !== null && tabIndex !== "-1")
    );
  },
  
  // Get all focusable elements
  getFocusableElements: (container: HTMLElement) => {
    return Array.from(
      container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ).filter((el) => !el.hasAttribute("disabled")) as HTMLElement[];
  },
  
  // Announce to screen readers
  announce: (message: string, priority: "polite" | "assertive" = "polite") => {
    const announcement = document.createElement("div");
    announcement.setAttribute("aria-live", priority);
    announcement.setAttribute("aria-atomic", "true");
    announcement.className = "sr-only";
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  },
}; 