/**
 * Error Monitoring Service for PayPing
 * Centralized error handling, logging, and monitoring
 */

import auditService, { AUDIT_EVENTS } from './auditService.js';

// Error severity levels
export const ERROR_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

// Error categories
export const ERROR_CATEGORIES = {
  AUTH: 'authentication',
  FIREBASE: 'firebase',
  PAYMENT: 'payment',
  EMAIL: 'email',
  VALIDATION: 'validation',
  NETWORK: 'network',
  UI: 'ui',
  SYSTEM: 'system'
};

// Error sources
export const ERROR_SOURCES = {
  CLIENT: 'client',
  SERVER: 'server',
  THIRD_PARTY: 'third_party'
};

class ErrorMonitoringService {
  constructor() {
    this.isInitialized = false;
    this.errorQueue = [];
    this.maxQueueSize = 100;
    this.isOnline = navigator.onLine;
    this.errorCounts = new Map();
    this.setupGlobalErrorHandlers();
    this.setupNetworkMonitoring();
  }

  /**
   * Initialize error monitoring
   */
  initialize() {
    if (this.isInitialized) return;

    // In production, you might integrate with services like Sentry
    console.log('Error monitoring service initialized');
    this.isInitialized = true;

    // Process any queued errors
    this.processErrorQueue();
  }

  /**
   * Setup global error handlers
   */
  setupGlobalErrorHandlers() {
    // Capture uncaught JavaScript errors
    window.addEventListener('error', (event) => {
      this.logError({
        message: event.message,
        stack: event.error?.stack,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        category: ERROR_CATEGORIES.SYSTEM,
        severity: ERROR_SEVERITY.HIGH,
        source: ERROR_SOURCES.CLIENT,
        type: 'javascript_error'
      });
    });

    // Capture unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.logError({
        message: event.reason?.message || 'Unhandled promise rejection',
        stack: event.reason?.stack,
        category: ERROR_CATEGORIES.SYSTEM,
        severity: ERROR_SEVERITY.HIGH,
        source: ERROR_SOURCES.CLIENT,
        type: 'promise_rejection',
        reason: event.reason
      });
    });

    // Capture React errors (if using error boundary)
    if (window.React) {
      this.setupReactErrorBoundary();
    }
  }

  /**
   * Setup network monitoring
   */
  setupNetworkMonitoring() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.processErrorQueue();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  /**
   * Log error with context
   */
  async logError(errorData) {
    try {
      const enrichedError = this.enrichErrorData(errorData);
      
      // Update error counts for rate limiting
      this.updateErrorCounts(enrichedError);
      
      // Check if we should rate limit this error
      if (this.shouldRateLimit(enrichedError)) {
        return;
      }

      // Queue error if offline
      if (!this.isOnline) {
        this.queueError(enrichedError);
        return;
      }

      // Log to audit service
      await auditService.logEvent(AUDIT_EVENTS.SYSTEM_ERROR, {
        error: this.sanitizeErrorForAudit(enrichedError),
        severity: enrichedError.severity,
        category: enrichedError.category,
        timestamp: enrichedError.timestamp
      });

      // Log to console for development
      this.logToConsole(enrichedError);

      // In production, send to external monitoring service
      await this.sendToExternalService(enrichedError);

    } catch (error) {
      console.error('Failed to log error:', error);
    }
  }

  /**
   * Enrich error data with context
   */
  enrichErrorData(errorData) {
    const userAgent = navigator.userAgent;
    const url = window.location.href;
    const timestamp = new Date().toISOString();
    
    return {
      id: this.generateErrorId(),
      timestamp,
      url,
      userAgent,
      userId: this.getCurrentUserId(),
      sessionId: this.getSessionId(),
      buildVersion: this.getBuildVersion(),
      ...errorData,
      severity: errorData.severity || ERROR_SEVERITY.MEDIUM,
      category: errorData.category || ERROR_CATEGORIES.SYSTEM,
      source: errorData.source || ERROR_SOURCES.CLIENT
    };
  }

  /**
   * Generate unique error ID
   */
  generateErrorId() {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get current user ID
   */
  getCurrentUserId() {
    try {
      // Try to get from auth context or local storage
      const authData = JSON.parse(localStorage.getItem('authData') || '{}');
      return authData.uid || 'anonymous';
    } catch {
      return 'anonymous';
    }
  }

  /**
   * Get session ID
   */
  getSessionId() {
    let sessionId = sessionStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
  }

  /**
   * Get build version
   */
  getBuildVersion() {
    return import.meta.env.VITE_APP_VERSION || 'development';
  }

  /**
   * Update error counts for rate limiting
   */
  updateErrorCounts(errorData) {
    const key = `${errorData.category}_${errorData.message}`;
    const count = this.errorCounts.get(key) || 0;
    this.errorCounts.set(key, count + 1);

    // Clean old counts every hour
    if (count === 1) {
      setTimeout(() => {
        this.errorCounts.delete(key);
      }, 3600000); // 1 hour
    }
  }

  /**
   * Check if error should be rate limited
   */
  shouldRateLimit(errorData) {
    const key = `${errorData.category}_${errorData.message}`;
    const count = this.errorCounts.get(key) || 0;
    
    // Rate limit: max 10 identical errors per hour
    return count > 10;
  }

  /**
   * Queue error for later processing
   */
  queueError(errorData) {
    if (this.errorQueue.length >= this.maxQueueSize) {
      this.errorQueue.shift(); // Remove oldest error
    }
    this.errorQueue.push(errorData);
  }

  /**
   * Process queued errors
   */
  async processErrorQueue() {
    if (!this.isOnline || this.errorQueue.length === 0) return;

    const errors = [...this.errorQueue];
    this.errorQueue = [];

    for (const error of errors) {
      try {
        await this.sendToExternalService(error);
      } catch (err) {
        console.error('Failed to process queued error:', err);
        // Re-queue if failed
        this.queueError(error);
      }
    }
  }

  /**
   * Log to console with appropriate level
   */
  logToConsole(errorData) {
    const logMethod = this.getConsoleMethod(errorData.severity);
    const message = `[${errorData.severity.toUpperCase()}] ${errorData.category}: ${errorData.message}`;
    
    logMethod(message, {
      stack: errorData.stack,
      context: errorData.context,
      timestamp: errorData.timestamp
    });
  }

  /**
   * Get appropriate console method for severity
   */
  getConsoleMethod(severity) {
    switch (severity) {
      case ERROR_SEVERITY.CRITICAL:
      case ERROR_SEVERITY.HIGH:
        return console.error;
      case ERROR_SEVERITY.MEDIUM:
        return console.warn;
      case ERROR_SEVERITY.LOW:
      default:
        return console.log;
    }
  }

  /**
   * Send error to external monitoring service
   */
  async sendToExternalService(errorData) {
    try {
      // In production, this would send to Sentry, LogRocket, etc.
      const endpoint = import.meta.env.VITE_ERROR_MONITORING_ENDPOINT;
      
      if (!endpoint) {
        return; // No external service configured
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorData)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      // Don't throw errors in error logging to avoid infinite loops
      console.warn('Failed to send error to external service:', error);
    }
  }

  /**
   * Sanitize error data for audit log
   */
  sanitizeErrorForAudit(errorData) {
    // Remove sensitive data that shouldn't be logged
    const sensitiveFields = ['password', 'token', 'apiKey', 'secret'];
    const sanitized = { ...errorData };

    // Remove sensitive fields from message and stack
    sensitiveFields.forEach(field => {
      if (sanitized.message) {
        sanitized.message = sanitized.message.replace(new RegExp(field, 'gi'), '[REDACTED]');
      }
      if (sanitized.stack) {
        sanitized.stack = sanitized.stack.replace(new RegExp(field, 'gi'), '[REDACTED]');
      }
    });

    // Remove large objects that might contain sensitive data
    delete sanitized.context?.formData;
    delete sanitized.context?.requestBody;

    return sanitized;
  }

  /**
   * Log authentication error
   */
  async logAuthError(error, context = {}) {
    await this.logError({
      message: error.message || 'Authentication error',
      stack: error.stack,
      category: ERROR_CATEGORIES.AUTH,
      severity: ERROR_SEVERITY.HIGH,
      context: {
        authMethod: context.authMethod,
        errorCode: error.code,
        ...context
      }
    });
  }

  /**
   * Log Firebase error
   */
  async logFirebaseError(error, operation, context = {}) {
    await this.logError({
      message: error.message || 'Firebase error',
      stack: error.stack,
      category: ERROR_CATEGORIES.FIREBASE,
      severity: this.getFirebaseErrorSeverity(error.code),
      context: {
        operation,
        errorCode: error.code,
        ...context
      }
    });
  }

  /**
   * Log payment error
   */
  async logPaymentError(error, context = {}) {
    await this.logError({
      message: error.message || 'Payment error',
      stack: error.stack,
      category: ERROR_CATEGORIES.PAYMENT,
      severity: ERROR_SEVERITY.HIGH,
      context: {
        paymentMethod: context.paymentMethod,
        amount: context.amount,
        currency: context.currency,
        errorCode: error.code,
        ...context
      }
    });
  }

  /**
   * Log network error
   */
  async logNetworkError(error, url, method = 'GET') {
    await this.logError({
      message: error.message || 'Network error',
      stack: error.stack,
      category: ERROR_CATEGORIES.NETWORK,
      severity: ERROR_SEVERITY.MEDIUM,
      context: {
        url,
        method,
        status: error.status,
        statusText: error.statusText
      }
    });
  }

  /**
   * Log validation error
   */
  async logValidationError(field, value, rule, context = {}) {
    await this.logError({
      message: `Validation failed for field: ${field}`,
      category: ERROR_CATEGORIES.VALIDATION,
      severity: ERROR_SEVERITY.LOW,
      context: {
        field,
        value: typeof value === 'string' ? value.substring(0, 100) : value,
        rule,
        ...context
      }
    });
  }

  /**
   * Get Firebase error severity based on error code
   */
  getFirebaseErrorSeverity(errorCode) {
    const criticalCodes = ['permission-denied', 'unavailable'];
    const highCodes = ['not-found', 'already-exists', 'failed-precondition'];
    
    if (criticalCodes.includes(errorCode)) return ERROR_SEVERITY.CRITICAL;
    if (highCodes.includes(errorCode)) return ERROR_SEVERITY.HIGH;
    return ERROR_SEVERITY.MEDIUM;
  }

  /**
   * Get error statistics
   */
  getErrorStatistics() {
    const stats = {
      totalErrors: Array.from(this.errorCounts.values()).reduce((sum, count) => sum + count, 0),
      errorsByCategory: {},
      errorsBySeverity: {},
      queuedErrors: this.errorQueue.length,
      isOnline: this.isOnline
    };

    // Calculate category and severity breakdowns would require more tracking
    return stats;
  }

  /**
   * Clear error statistics
   */
  clearStatistics() {
    this.errorCounts.clear();
    this.errorQueue = [];
  }

  /**
   * Test error monitoring
   */
  async testErrorMonitoring() {
    try {
      await this.logError({
        message: 'Test error for monitoring validation',
        category: ERROR_CATEGORIES.SYSTEM,
        severity: ERROR_SEVERITY.LOW,
        context: { test: true }
      });

      return {
        success: true,
        message: 'Error monitoring test completed successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }
}

// Create and export singleton instance
const errorMonitoring = new ErrorMonitoringService();

// Initialize on load
if (typeof window !== 'undefined') {
  errorMonitoring.initialize();
}

export default errorMonitoring;
