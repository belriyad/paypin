import { collection, addDoc, serverTimestamp, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase.js';

/**
 * Audit Logging Service for PayPing
 * Tracks all user actions for compliance and security
 */

const AUDIT_COLLECTION = 'auditLogs';

// Audit event types
export const AUDIT_EVENTS = {
  // Authentication
  USER_LOGIN: 'user_login',
  USER_LOGOUT: 'user_logout',
  USER_SIGNUP: 'user_signup',
  
  // Customer operations
  CUSTOMER_CREATED: 'customer_created',
  CUSTOMER_UPDATED: 'customer_updated',
  CUSTOMER_DELETED: 'customer_deleted',
  CUSTOMER_BULK_IMPORT: 'customer_bulk_import',
  CUSTOMER_EXPORT: 'customer_export',
  
  // Payment operations
  PAYMENT_CREATED: 'payment_created',
  PAYMENT_UPDATED: 'payment_updated',
  PAYMENT_DELETED: 'payment_deleted',
  PAYMENT_STATUS_CHANGED: 'payment_status_changed',
  
  // Template operations
  TEMPLATE_CREATED: 'template_created',
  TEMPLATE_UPDATED: 'template_updated',
  TEMPLATE_DELETED: 'template_deleted',
  TEMPLATE_USED: 'template_used',
  
  // Email operations
  EMAIL_SENT: 'email_sent',
  EMAIL_OPENED: 'email_opened',
  EMAIL_CLICKED: 'email_clicked',
  EMAIL_BOUNCED: 'email_bounced',
  
  // Settings
  SETTINGS_UPDATED: 'settings_updated',
  
  // Data operations
  DATA_EXPORT: 'data_export',
  DATA_IMPORT: 'data_import',
  
  // Security events
  UNAUTHORIZED_ACCESS: 'unauthorized_access',
  PASSWORD_RESET: 'password_reset',
  ACCOUNT_LOCKED: 'account_locked'
};

class AuditService {
  /**
   * Log an audit event
   * @param {string} eventType - Type of event from AUDIT_EVENTS
   * @param {Object} details - Event details and metadata
   * @param {string} resourceId - ID of affected resource (optional)
   * @param {Object} oldValue - Previous value for update operations (optional)
   * @param {Object} newValue - New value for update operations (optional)
   */
  async logEvent(eventType, details = {}, resourceId = null, oldValue = null, newValue = null) {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.warn('Cannot log audit event: No authenticated user');
        return;
      }

      const auditEntry = {
        eventType,
        userId: user.uid,
        userEmail: user.email,
        userName: user.displayName || 'Unknown',
        timestamp: serverTimestamp(),
        details,
        resourceId,
        oldValue: oldValue ? this.sanitizeData(oldValue) : null,
        newValue: newValue ? this.sanitizeData(newValue) : null,
        ipAddress: await this.getClientIP(),
        userAgent: navigator.userAgent,
        sessionId: this.getSessionId()
      };

      await addDoc(collection(db, AUDIT_COLLECTION), auditEntry);
      
      // Also log to console in development
      if (import.meta.env.DEV) {
        console.log('Audit Event:', auditEntry);
      }
      
    } catch (error) {
      console.error('Failed to log audit event:', error);
      // Don't throw error to avoid breaking application flow
    }
  }

  /**
   * Get audit logs for current user
   * @param {number} limitCount - Number of logs to retrieve
   * @param {string} eventTypeFilter - Filter by event type (optional)
   */
  async getUserAuditLogs(limitCount = 100, eventTypeFilter = null) {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');

      let q = query(
        collection(db, AUDIT_COLLECTION),
        where('userId', '==', user.uid),
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      );

      if (eventTypeFilter) {
        q = query(
          collection(db, AUDIT_COLLECTION),
          where('userId', '==', user.uid),
          where('eventType', '==', eventTypeFilter),
          orderBy('timestamp', 'desc'),
          limit(limitCount)
        );
      }

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate?.()?.toISOString() || doc.data().timestamp
      }));
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      throw error;
    }
  }

  /**
   * Sanitize sensitive data before logging
   */
  sanitizeData(data) {
    if (!data || typeof data !== 'object') return data;

    const sanitized = { ...data };
    const sensitiveFields = ['password', 'creditCard', 'ssn', 'bankAccount'];
    
    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    }

    // Mask email addresses partially
    if (sanitized.email) {
      const [local, domain] = sanitized.email.split('@');
      if (local && domain) {
        sanitized.email = `${local.substring(0, 2)}***@${domain}`;
      }
    }

    // Mask phone numbers
    if (sanitized.phone) {
      sanitized.phone = sanitized.phone.replace(/\d(?=\d{4})/g, '*');
    }

    return sanitized;
  }

  /**
   * Get client IP address (best effort)
   */
  async getClientIP() {
    try {
      // In production, you might use a service like ipapi.co
      // For now, return a placeholder
      return 'client-ip-not-available';
    } catch {
      return 'unknown';
    }
  }

  /**
   * Get or create session ID
   */
  getSessionId() {
    let sessionId = sessionStorage.getItem('payping_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('payping_session_id', sessionId);
    }
    return sessionId;
  }

  /**
   * Log customer-related events
   */
  async logCustomerEvent(eventType, customer, oldCustomer = null) {
    await this.logEvent(
      eventType,
      { 
        customerName: customer.name,
        customerEmail: customer.email?.substring(0, 2) + '***@' + customer.email?.split('@')[1],
        action: eventType.split('_')[1] // created, updated, deleted
      },
      customer.id,
      oldCustomer,
      customer
    );
  }

  /**
   * Log payment-related events
   */
  async logPaymentEvent(eventType, payment, oldPayment = null) {
    await this.logEvent(
      eventType,
      {
        paymentAmount: payment.amount,
        paymentStatus: payment.status,
        customerId: payment.customerId,
        action: eventType.split('_')[1]
      },
      payment.id,
      oldPayment,
      payment
    );
  }

  /**
   * Log authentication events
   */
  async logAuthEvent(eventType, details = {}) {
    await this.logEvent(eventType, {
      authMethod: details.method || 'email',
      ...details
    });
  }

  /**
   * Log data export/import events
   */
  async logDataEvent(eventType, details = {}) {
    await this.logEvent(eventType, {
      recordCount: details.count || 0,
      dataType: details.type || 'unknown',
      exportFormat: details.format || 'json',
      ...details
    });
  }

  /**
   * Log security events
   */
  async logSecurityEvent(eventType, details = {}) {
    await this.logEvent(eventType, {
      severity: details.severity || 'medium',
      threat: details.threat || 'unknown',
      ...details
    });
  }

  /**
   * Test audit service connection and functionality
   */
  async testConnection() {
    try {
      const user = auth.currentUser;
      if (!user) {
        return {
          success: false,
          message: 'Audit service requires authentication'
        };
      }

      // Test logging a simple event
      await this.logEvent('SYSTEM_TEST', {
        message: 'Audit service connection test',
        timestamp: new Date().toISOString()
      });

      return {
        success: true,
        message: 'Audit service connection successful'
      };
    } catch (error) {
      return {
        success: false,
        message: `Audit service connection failed: ${error.message}`
      };
    }
  }
}

// Create and export singleton instance
const auditService = new AuditService();
export default auditService;
