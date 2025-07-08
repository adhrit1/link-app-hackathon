// Error handling utilities for LINK APP

export interface AppError {
  code: string;
  message: string;
  details?: string;
  retryable: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  context?: Record<string, any>;
}

export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorLog: AppError[] = [];
  private maxLogSize = 100;

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  logError(error: AppError): void {
    this.errorLog.push(error);
    
    // Keep log size manageable
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog = this.errorLog.slice(-this.maxLogSize);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('App Error:', error);
    }

    // Send to error tracking service in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToErrorService(error);
    }
  }

  private sendToErrorService(error: AppError): void {
    // Implement error tracking service integration
    // e.g., Sentry, LogRocket, etc.
    try {
      fetch('/api/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(error),
      }).catch(() => {
        // Silently fail if error reporting fails
      });
    } catch {
      // Silently fail if error reporting fails
    }
  }

  getRecentErrors(): AppError[] {
    return [...this.errorLog];
  }

  clearLog(): void {
    this.errorLog = [];
  }
}

// Error codes and messages
export const ERROR_CODES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  API_ERROR: 'API_ERROR',
  AUTH_ERROR: 'AUTH_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  PERMISSION_ERROR: 'PERMISSION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  SERVER_ERROR: 'SERVER_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  RATE_LIMIT_ERROR: 'RATE_LIMIT_ERROR',
} as const;

export const ERROR_MESSAGES = {
  [ERROR_CODES.NETWORK_ERROR]: 'Connection failed. Please check your internet connection.',
  [ERROR_CODES.API_ERROR]: 'Something went wrong. Please try again.',
  [ERROR_CODES.AUTH_ERROR]: 'Authentication failed. Please log in again.',
  [ERROR_CODES.VALIDATION_ERROR]: 'Please check your input and try again.',
  [ERROR_CODES.PERMISSION_ERROR]: 'You don\'t have permission to perform this action.',
  [ERROR_CODES.NOT_FOUND]: 'The requested resource was not found.',
  [ERROR_CODES.SERVER_ERROR]: 'Server error. Please try again later.',
  [ERROR_CODES.TIMEOUT_ERROR]: 'Request timed out. Please try again.',
  [ERROR_CODES.RATE_LIMIT_ERROR]: 'Too many requests. Please wait a moment.',
} as const;

// Create error with proper typing
export function createError(
  code: keyof typeof ERROR_CODES,
  details?: string,
  context?: Record<string, any>
): AppError {
  return {
    code: ERROR_CODES[code],
    message: ERROR_MESSAGES[code],
    details,
    retryable: isRetryableError(code),
    severity: getErrorSeverity(code),
    timestamp: new Date(),
    context,
  };
}

function isRetryableError(code: keyof typeof ERROR_CODES): boolean {
  const retryableCodes = [
    ERROR_CODES.NETWORK_ERROR,
    ERROR_CODES.API_ERROR,
    ERROR_CODES.SERVER_ERROR,
    ERROR_CODES.TIMEOUT_ERROR,
    ERROR_CODES.RATE_LIMIT_ERROR,
  ] as const;
  return retryableCodes.includes(ERROR_CODES[code] as any);
}

function getErrorSeverity(code: keyof typeof ERROR_CODES): AppError['severity'] {
  const severityMap: Record<string, AppError['severity']> = {
    [ERROR_CODES.NETWORK_ERROR]: 'medium',
    [ERROR_CODES.API_ERROR]: 'medium',
    [ERROR_CODES.AUTH_ERROR]: 'high',
    [ERROR_CODES.VALIDATION_ERROR]: 'low',
    [ERROR_CODES.PERMISSION_ERROR]: 'medium',
    [ERROR_CODES.NOT_FOUND]: 'low',
    [ERROR_CODES.SERVER_ERROR]: 'high',
    [ERROR_CODES.TIMEOUT_ERROR]: 'medium',
    [ERROR_CODES.RATE_LIMIT_ERROR]: 'low',
  };
  return severityMap[ERROR_CODES[code]] || 'medium';
}

// Retry mechanism
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000,
  backoff: number = 2
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      // Wait before retrying with exponential backoff
      await new Promise(resolve => 
        setTimeout(resolve, delay * Math.pow(backoff, attempt))
      );
    }
  }
  
  throw lastError!;
}

// API error wrapper
export async function apiCall<T>(
  url: string,
  options: RequestInit = {},
  retryConfig?: { maxRetries: number; delay: number }
): Promise<T> {
  const errorHandler = ErrorHandler.getInstance();
  
  return withRetry(
    async () => {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorCode = getErrorCodeFromStatus(response.status);
        const error = createError(errorCode, `HTTP ${response.status}: ${response.statusText}`);
        errorHandler.logError(error);
        throw new Error(error.message);
      }

      return response.json();
    },
    retryConfig?.maxRetries || 3,
    retryConfig?.delay || 1000
  );
}

function getErrorCodeFromStatus(status: number): keyof typeof ERROR_CODES {
  if (status >= 500) return 'SERVER_ERROR';
  if (status === 404) return 'NOT_FOUND';
  if (status === 401) return 'AUTH_ERROR';
  if (status === 403) return 'PERMISSION_ERROR';
  if (status === 422) return 'VALIDATION_ERROR';
  if (status === 429) return 'RATE_LIMIT_ERROR';
  if (status === 408) return 'TIMEOUT_ERROR';
  return 'API_ERROR';
}

// Error boundary hook
export function useErrorHandler() {
  const errorHandler = ErrorHandler.getInstance();
  
  const handleError = (error: unknown, context?: Record<string, any>) => {
    let appError: AppError;
    
    if (error instanceof Error) {
      appError = createError('API_ERROR', error.message, context);
    } else {
      appError = createError('API_ERROR', String(error), context);
    }
    
    errorHandler.logError(appError);
    return appError;
  };
  
  return { handleError, logError: errorHandler.logError.bind(errorHandler) };
}

// Global error handler
export function setupGlobalErrorHandling(): void {
  const errorHandler = ErrorHandler.getInstance();
  
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    const error = createError('API_ERROR', event.reason?.message || 'Unhandled promise rejection');
    errorHandler.logError(error);
    event.preventDefault();
  });
  
  // Handle JavaScript errors
  window.addEventListener('error', (event) => {
    const error = createError('API_ERROR', event.error?.message || event.message);
    errorHandler.logError(error);
  });
}

// Error recovery utilities
export function canRecoverFromError(error: AppError): boolean {
  return error.retryable && error.severity !== 'critical';
}

export function getRecoveryAction(error: AppError): string {
  if (error.code === ERROR_CODES.AUTH_ERROR) {
    return 'Please log in again to continue.';
  }
  if (error.code === ERROR_CODES.NETWORK_ERROR) {
    return 'Please check your internet connection and try again.';
  }
  if (error.code === ERROR_CODES.RATE_LIMIT_ERROR) {
    return 'Please wait a moment before trying again.';
  }
  return 'Please try again or contact support if the problem persists.';
}

// Export singleton instance
export const errorHandler = ErrorHandler.getInstance(); 