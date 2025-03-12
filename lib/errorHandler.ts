/**
 * Simple error handler utility for consistent error handling across the application
 * Prevents application crashes and provides error visibility
 */

/**
 * Error response structure
 */
export interface ErrorResult {
  message: string;
  details?: unknown;
}

/**
 * Result type for functions wrapped with tryCatch
 */
export interface Result<T> {
  data?: T;
  error?: ErrorResult;
}

/**
 * Handles exceptions and returns a structured error response
 * @param error The error to handle
 * @param defaultMessage Default message to use if error doesn't have one
 * @param logError Whether to log the error (defaults to true)
 * @returns Structured error response with message and details
 */
export function handleError(
  error: unknown,
  defaultMessage = 'An unexpected error occurred',
  logError = true
): ErrorResult {
  // Initialize the error response
  const errorResponse: ErrorResult = {
    message: defaultMessage,
  };

  // Handle different error types
  if (error instanceof Error) {
    errorResponse.message = error.message || defaultMessage;
    
    // Add stack trace to details in non-production environments
    if (process.env.NODE_ENV !== 'production') {
      errorResponse.details = {
        stack: error.stack
      };
    }
  } else if (typeof error === 'string') {
    errorResponse.message = error;
  } else if (error && typeof error === 'object') {
    // Handle API error responses or other object errors
    const errorObj = error as Record<string, unknown>;
    
    if (typeof errorObj.message === 'string') {
      errorResponse.message = errorObj.message;
    }
    
    // Include additional details if available
    if (Object.keys(errorObj).length > 0) {
      errorResponse.details = filterSensitiveData(errorObj);
    }
  }

  // Log the error if enabled
  if (logError) {
    logErrorToConsole(error, errorResponse);
  }

  return errorResponse;
}

/**
 * Logs error to console with appropriate formatting
 */
function logErrorToConsole(originalError: unknown, formattedError: ErrorResult): void {
  console.error('Error occurred:', formattedError.message);
  
  if (formattedError.details) {
    console.error('Details:', formattedError.details);
  }
  
  if (originalError instanceof Error && originalError.stack) {
    console.error('Stack:', originalError.stack);
  }
}

/**
 * Removes sensitive data from error objects
 */
function filterSensitiveData(data: Record<string, unknown>): Record<string, unknown> {
  const sensitiveFields = ['password', 'token', 'secret', 'key', 'authorization', 'cookie'];
  const filtered = { ...data };
  
  for (const key of Object.keys(filtered)) {
    if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
      filtered[key] = '[REDACTED]';
    } else if (filtered[key] && typeof filtered[key] === 'object') {
      filtered[key] = filterSensitiveData(filtered[key] as Record<string, unknown>);
    }
  }
  
  return filtered;
}

/**
 * Wraps an async function with error handling to prevent crashes
 * @param fn The async function to wrap
 * @returns A wrapped function that handles errors
 */
export function tryCatch<T, Args extends unknown[]>(
  fn: (...args: Args) => Promise<T>
): (...args: Args) => Promise<Result<T>> {
  return async (...args: Args) => {
    try {
      const result = await fn(...args);
      return { data: result };
    } catch (error) {
      const errorResult = handleError(error);
      return { error: errorResult };
    }
  };
} 