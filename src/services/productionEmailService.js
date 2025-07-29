import emailjs from '@emailjs/browser';
import auditService, { AUDIT_EVENTS } from './auditService.js';

/**
 * Production Email Service for PayPing
 * Supports both SendGrid (production) and EmailJS (development/fallback)
 */

// Email service configuration
const EMAIL_CONFIG = {
  sendgrid: {
    apiKey: import.meta.env.VITE_SENDGRID_API_KEY,
    fromEmail: import.meta.env.VITE_FROM_EMAIL || 'noreply@payping.com',
    fromName: import.meta.env.VITE_FROM_NAME || 'PayPing'
  },
  emailjs: {
    serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || 'your_service_id',
    templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'your_template_id',
    publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'your_public_key'
  },
  templates: {
    paymentReminder: import.meta.env.VITE_SENDGRID_PAYMENT_REMINDER_TEMPLATE || 'template_payment_reminder',
    paymentReceived: import.meta.env.VITE_SENDGRID_PAYMENT_RECEIVED_TEMPLATE || 'template_payment_received',
    accountWelcome: import.meta.env.VITE_SENDGRID_WELCOME_TEMPLATE || 'template_welcome',
    passwordReset: import.meta.env.VITE_SENDGRID_PASSWORD_RESET_TEMPLATE || 'template_password_reset'
  }
};

// Email delivery status constants
export const EMAIL_STATUS = {
  PENDING: 'pending',
  SENT: 'sent',
  DELIVERED: 'delivered',
  OPENED: 'opened',
  CLICKED: 'clicked',
  BOUNCED: 'bounced',
  FAILED: 'failed',
  UNSUBSCRIBED: 'unsubscribed'
};

class ProductionEmailService {
  constructor() {
    this.isProduction = import.meta.env.PROD;
    this.useSendGrid = !!EMAIL_CONFIG.sendgrid.apiKey;
    
    // Initialize EmailJS as fallback
    if (EMAIL_CONFIG.emailjs.publicKey !== 'your_public_key') {
      emailjs.init(EMAIL_CONFIG.emailjs.publicKey);
    }
  }

  // Check if email service is properly configured
  isConfigured() {
    if (this.useSendGrid) {
      return EMAIL_CONFIG.sendgrid.apiKey !== undefined && 
             EMAIL_CONFIG.sendgrid.fromEmail !== undefined;
    } else {
      return EMAIL_CONFIG.emailjs.serviceId !== 'your_service_id' &&
             EMAIL_CONFIG.emailjs.templateId !== 'your_template_id' &&
             EMAIL_CONFIG.emailjs.publicKey !== 'your_public_key';
    }
  }

  /**
   * Send email using appropriate service
   */
  async sendEmail(emailData) {
    try {
      if (this.useSendGrid) {
        return await this.sendEmailSendGrid(emailData);
      } else {
        return await this.sendEmailJS(emailData);
      }
    } catch (error) {
      console.error('Email send error:', error);
      await auditService.logEvent(AUDIT_EVENTS.EMAIL_SENT, {
        success: false,
        error: error.message,
        to: emailData.to,
        template: emailData.templateId
      });
      
      return {
        success: false,
        error: error.message,
        status: EMAIL_STATUS.FAILED
      };
    }
  }

  /**
   * Send email using SendGrid API
   */
  async sendEmailSendGrid(emailData) {
    try {
      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${EMAIL_CONFIG.sendgrid.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          personalizations: [{
            to: [{ email: emailData.to, name: emailData.toName }],
            dynamic_template_data: emailData.templateData || {}
          }],
          from: {
            email: EMAIL_CONFIG.sendgrid.fromEmail,
            name: EMAIL_CONFIG.sendgrid.fromName
          },
          template_id: emailData.templateId,
          tracking_settings: {
            click_tracking: { enable: true },
            open_tracking: { enable: true },
            subscription_tracking: { enable: true }
          },
          custom_args: {
            category: emailData.category || 'general',
            user_id: emailData.userId,
            resource_id: emailData.resourceId
          }
        })
      });

      if (response.ok) {
        const result = {
          success: true,
          messageId: response.headers.get('X-Message-Id'),
          status: EMAIL_STATUS.SENT,
          provider: 'sendgrid'
        };

        await auditService.logEvent(AUDIT_EVENTS.EMAIL_SENT, {
          success: true,
          to: emailData.to,
          template: emailData.templateId,
          messageId: result.messageId,
          provider: 'sendgrid'
        });

        return result;
      } else {
        const error = await response.text();
        throw new Error(`SendGrid API error: ${error}`);
      }
    } catch (error) {
      console.error('SendGrid send error:', error);
      throw error;
    }
  }

  /**
   * Send email using EmailJS (fallback/development)
   */
  async sendEmailJS(emailData) {
    try {
      const result = await emailjs.send(
        EMAIL_CONFIG.emailjs.serviceId,
        emailData.templateId || EMAIL_CONFIG.emailjs.templateId,
        emailData.templateData,
        EMAIL_CONFIG.emailjs.publicKey
      );

      const emailResult = {
        success: true,
        messageId: result.text,
        status: EMAIL_STATUS.SENT,
        provider: 'emailjs'
      };

      await auditService.logEvent(AUDIT_EVENTS.EMAIL_SENT, {
        success: true,
        to: emailData.to,
        template: emailData.templateId,
        messageId: result.text,
        provider: 'emailjs'
      });

      return emailResult;
    } catch (error) {
      console.error('EmailJS send error:', error);
      throw error;
    }
  }

  /**
   * Send payment reminder email
   */
  async sendPaymentReminder(customer, payment, reminderType = 'standard') {
    const templateData = {
      to_email: customer.email,
      to_name: customer.name,
      customer_name: customer.name,
      customer_email: customer.email,
      payment_amount: payment.amount,
      payment_due_date: payment.dueDate,
      payment_description: payment.description || 'Payment Due',
      days_overdue: this.calculateDaysOverdue(payment.dueDate),
      company_name: 'PayPing',
      payment_link: `${window.location.origin}/pay/${payment.id}`,
      reminder_type: reminderType,
      unsubscribe_link: this.generateUnsubscribeLink(customer.email),
      from_name: 'PayPing Support',
      reply_to: 'support@payping.com'
    };

    return await this.sendEmail({
      to: customer.email,
      toName: customer.name,
      templateId: EMAIL_CONFIG.templates.paymentReminder,
      templateData,
      category: 'payment_reminder',
      userId: payment.userId,
      resourceId: payment.id
    });
  }

  /**
   * Send payment received confirmation
   */
  async sendPaymentReceived(customer, payment) {
    const templateData = {
      to_email: customer.email,
      to_name: customer.name,
      customer_name: customer.name,
      payment_amount: payment.amount,
      payment_date: new Date().toLocaleDateString(),
      payment_method: payment.method || 'Online',
      receipt_number: payment.receiptNumber || payment.id,
      company_name: 'PayPing'
    };

    return await this.sendEmail({
      to: customer.email,
      toName: customer.name,
      templateId: EMAIL_CONFIG.templates.paymentReceived,
      templateData,
      category: 'payment_confirmation',
      userId: payment.userId,
      resourceId: payment.id
    });
  }

  /**
   * Send welcome email to new users
   */
  async sendWelcomeEmail(user) {
    const templateData = {
      to_email: user.email,
      to_name: user.displayName || user.email,
      user_name: user.displayName || user.email,
      user_email: user.email,
      dashboard_link: `${window.location.origin}/dashboard`,
      support_email: 'support@payping.com',
      company_name: 'PayPing',
      from_name: 'PayPing Team'
    };

    return await this.sendEmail({
      to: user.email,
      toName: user.displayName,
      templateId: EMAIL_CONFIG.templates.accountWelcome,
      templateData,
      category: 'account_welcome',
      userId: user.uid
    });
  }

  /**
   * Send bulk payment reminders
   */
  async sendBulkReminders(reminders) {
    const results = [];
    
    for (const reminder of reminders) {
      try {
        const result = await this.sendPaymentReminder(
          reminder.customer,
          reminder.payment,
          reminder.type
        );
        results.push({
          customerId: reminder.customer.id,
          paymentId: reminder.payment.id,
          customerName: reminder.customer.name,
          customerEmail: reminder.customer.email,
          ...result
        });
        
        // Rate limiting - wait 100ms between emails
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        results.push({
          customerId: reminder.customer.id,
          paymentId: reminder.payment.id,
          customerName: reminder.customer.name,
          customerEmail: reminder.customer.email,
          success: false,
          error: error.message
        });
      }
    }

    await auditService.logEvent(AUDIT_EVENTS.EMAIL_SENT, {
      type: 'bulk_reminders',
      totalSent: results.filter(r => r.success).length,
      totalFailed: results.filter(r => !r.success).length,
      totalProcessed: results.length
    });

    return {
      totalSent: results.filter(r => r.success).length,
      totalFailed: results.filter(r => !r.success).length,
      results
    };
  }

  /**
   * Calculate days overdue
   */
  calculateDaysOverdue(dueDate) {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = today - due;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  }

  /**
   * Generate unsubscribe link
   */
  generateUnsubscribeLink(customerEmail) {
    const encoded = btoa(customerEmail);
    return `${window.location.origin}/unsubscribe?token=${encoded}`;
  }

  /**
   * Validate email configuration
   */
  validateConfiguration() {
    const issues = [];

    if (this.useSendGrid) {
      if (!EMAIL_CONFIG.sendgrid.apiKey) {
        issues.push('SendGrid API key not configured');
      }
      if (!EMAIL_CONFIG.sendgrid.fromEmail) {
        issues.push('From email address not configured');
      }
      if (!EMAIL_CONFIG.templates.paymentReminder) {
        issues.push('Payment reminder template not configured');
      }
    } else {
      if (EMAIL_CONFIG.emailjs.serviceId === 'your_service_id') {
        issues.push('EmailJS service ID not configured');
      }
      if (EMAIL_CONFIG.emailjs.templateId === 'your_template_id') {
        issues.push('EmailJS template ID not configured');
      }
      if (EMAIL_CONFIG.emailjs.publicKey === 'your_public_key') {
        issues.push('EmailJS public key not configured');
      }
    }

    return {
      isValid: issues.length === 0,
      issues,
      provider: this.useSendGrid ? 'sendgrid' : 'emailjs'
    };
  }

  /**
   * Test email configuration
   */
  async testConfiguration(testEmail) {
    try {
      const result = await this.sendPaymentReminder(
        { email: testEmail, name: 'Test User' },
        {
          id: 'test-payment',
          amount: '$100.00',
          dueDate: new Date().toISOString(),
          description: 'Test Payment Reminder',
          userId: 'test-user'
        },
        'test'
      );

      return {
        ...result,
        message: result.success ? 'Test email sent successfully!' : result.error
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Failed to send test email'
      };
    }
  }

  /**
   * Get configuration status
   */
  getConfigurationStatus() {
    const validation = this.validateConfiguration();
    
    return {
      isConfigured: validation.isValid,
      provider: validation.provider,
      issues: validation.issues,
      sendgridConfigured: !!EMAIL_CONFIG.sendgrid.apiKey,
      emailjsConfigured: EMAIL_CONFIG.emailjs.serviceId !== 'your_service_id',
      message: validation.isValid 
        ? `Email service is ready (using ${validation.provider})` 
        : 'Please configure email service credentials'
    };
  }
}

// Create and export singleton instance
const emailService = new ProductionEmailService();
export default emailService;
