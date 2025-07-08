"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  CheckCircle, 
  AlertCircle, 
  Info, 
  X, 
  Bell,
  BellOff,
  Settings
} from "lucide-react";
import { Button } from "./button";

// Notification types
export type NotificationType = "success" | "error" | "warning" | "info";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  dismissible?: boolean;
  timestamp: Date;
}

// Notification context
interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, "id" | "timestamp">) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  markAsRead: (id: string) => void;
  unreadCount: number;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within NotificationProvider");
  }
  return context;
}

// Notification provider
export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [readNotifications, setReadNotifications] = useState<Set<string>>(new Set());

  const addNotification = useCallback((notification: Omit<Notification, "id" | "timestamp">) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification: Notification = {
      ...notification,
      id,
      timestamp: new Date(),
      dismissible: notification.dismissible ?? true,
      duration: notification.duration ?? 5000,
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Auto-dismiss after duration
    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    setReadNotifications(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
    setReadNotifications(new Set());
  }, []);

  const markAsRead = useCallback((id: string) => {
    setReadNotifications(prev => new Set(prev).add(id));
  }, []);

  const unreadCount = notifications.length - readNotifications.size;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        clearNotifications,
        markAsRead,
        unreadCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

// Toast notification component
export function ToastNotification({ notification }: { notification: Notification }) {
  const { removeNotification } = useNotifications();

  const typeConfig = {
    success: {
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    error: {
      icon: AlertCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
    },
    warning: {
      icon: AlertCircle,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
    },
    info: {
      icon: Info,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
  };

  const config = typeConfig[notification.type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className={cn(
        "flex items-start space-x-3 p-4 rounded-lg border shadow-lg max-w-sm",
        config.bgColor,
        config.borderColor
      )}
    >
      <Icon className={cn("h-5 w-5 mt-0.5 flex-shrink-0", config.color)} />
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-gray-900">{notification.title}</h4>
        {notification.message && (
          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
        )}
        {notification.action && (
          <button
            onClick={notification.action.onClick}
            className="text-sm font-medium text-blue-600 hover:text-blue-500 mt-2"
          >
            {notification.action.label}
          </button>
        )}
      </div>
      {notification.dismissible && (
        <button
          onClick={() => removeNotification(notification.id)}
          className="text-gray-400 hover:text-gray-600 flex-shrink-0"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </motion.div>
  );
}

// Toast container
export function ToastContainer() {
  const { notifications } = useNotifications();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {notifications.map((notification) => (
          <ToastNotification key={notification.id} notification={notification} />
        ))}
      </AnimatePresence>
    </div>
  );
}

// In-app notification component
export function InAppNotification({ notification }: { notification: Notification }) {
  const { removeNotification, markAsRead } = useNotifications();

  const typeConfig = {
    success: {
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    error: {
      icon: AlertCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
    },
    warning: {
      icon: AlertCircle,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
    },
    info: {
      icon: Info,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
  };

  const config = typeConfig[notification.type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className={cn(
        "flex items-start space-x-3 p-4 rounded-lg border",
        config.bgColor,
        config.borderColor
      )}
      onClick={() => markAsRead(notification.id)}
    >
      <Icon className={cn("h-5 w-5 mt-0.5 flex-shrink-0", config.color)} />
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-gray-900">{notification.title}</h4>
        {notification.message && (
          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
        )}
        <p className="text-xs text-gray-500 mt-2">
          {notification.timestamp.toLocaleTimeString()}
        </p>
      </div>
      {notification.dismissible && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            removeNotification(notification.id);
          }}
          className="text-gray-400 hover:text-gray-600 flex-shrink-0"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </motion.div>
  );
}

// Notification center
export function NotificationCenter() {
  const { notifications, unreadCount, clearNotifications } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        {unreadCount > 0 ? (
          <div className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          </div>
        ) : (
          <BellOff className="h-5 w-5" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-80 bg-white rounded-lg border shadow-lg z-50"
          >
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Notifications</h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={clearNotifications}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Clear all
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  <BellOff className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p>No notifications</p>
                </div>
              ) : (
                <div className="p-2 space-y-2">
                  {notifications.map((notification) => (
                    <InAppNotification key={notification.id} notification={notification} />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Quick notification helpers
export function showSuccess(title: string, message?: string) {
  const { addNotification } = useNotifications();
  addNotification({ type: "success", title, message });
}

export function showError(title: string, message?: string) {
  const { addNotification } = useNotifications();
  addNotification({ type: "error", title, message });
}

export function showWarning(title: string, message?: string) {
  const { addNotification } = useNotifications();
  addNotification({ type: "warning", title, message });
}

export function showInfo(title: string, message?: string) {
  const { addNotification } = useNotifications();
  addNotification({ type: "info", title, message });
}
 