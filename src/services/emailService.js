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

class EmailService {
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
    return (
      EMAILJS_CONFIG.serviceId !== 'your_service_id' &&
      EMAILJS_CONFIG.templateId !== 'your_template_id' &&
      EMAILJS_CONFIG.publicKey !== 'your_public_key'
    );
  }

  // Send a payment reminder email
  async sendPaymentReminder(customerData, paymentData, template, companyData) {
    try {
      if (!this.isConfigured()) {
        console.warn('EmailJS not configured - simulating email send');
        return this.simulateEmailSend(customerData, paymentData, template);
      }

      // Prepare template variables for EmailJS
      const templateParams = {
        to_email: customerData.email,
        to_name: customerData.name,
        from_name: companyData?.name || 'PayPing',
        from_email: companyData?.email || 'noreply@payping.com',
        subject: this.processTemplate(template.subject || 'Payment Reminder', {
          customer_name: customerData.name,
          invoice_number: paymentData.invoice || paymentData.id,
          amount: this.formatCurrency(paymentData.amount),
          due_date: this.formatDate(paymentData.dueDate),
          company_name: companyData?.name || 'PayPing'
        }),
        message: this.processTemplate(template.content, {
          customer_name: customerData.name,
          invoice_number: paymentData.invoice || paymentData.id,
          amount: this.formatCurrency(paymentData.amount),
          due_date: this.formatDate(paymentData.dueDate),
          days_overdue: this.calculateDaysOverdue(paymentData.dueDate),
          company_name: companyData?.name || 'PayPing',
          company_email: companyData?.email || 'support@payping.com',
          company_phone: companyData?.phone || ''
        })
      };

      // Send email via EmailJS
      const response = await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        templateParams
      );

      console.log('Email sent successfully:', response.status, response.text);
      
      return {
        success: true,
        messageId: response.text,
        recipient: customerData.email,
        subject: templateParams.subject
      };

    } catch (error) {
      console.error('Failed to send email:', error);
      
      return {
        success: false,
        error: error.message,
        recipient: customerData.email
      };
    }
  }

  // Send bulk reminders
  async sendBulkReminders(customersData, paymentsData, template, companyData) {
    const results = [];
    
    for (const customer of customersData) {
      // Find outstanding payments for this customer
      const customerPayments = paymentsData.filter(
        payment => payment.customerId === customer.id && 
        (payment.status === 'pending' || payment.status === 'overdue')
      );

      for (const payment of customerPayments) {
        try {
          const result = await this.sendPaymentReminder(
            customer, 
            payment, 
            template, 
            companyData
          );
          
          results.push({
            customerId: customer.id,
            customerName: customer.name,
            paymentId: payment.id,
            ...result
          });

          // Add small delay between emails to avoid rate limiting
          await this.delay(1000);
        } catch (error) {
          results.push({
            customerId: customer.id,
            customerName: customer.name,
            paymentId: payment.id,
            success: false,
            error: error.message
          });
        }
      }
    }

    return results;
  }

  // Send receipt confirmation
  async sendPaymentReceipt(customerData, paymentData, companyData) {
    try {
      if (!this.isConfigured()) {
        console.warn('EmailJS not configured - simulating receipt send');
        return {
          success: true,
          simulated: true,
          recipient: customerData.email,
          subject: 'Payment Receipt'
        };
      }

      const templateParams = {
        to_email: customerData.email,
        to_name: customerData.name,
        from_name: companyData?.name || 'PayPing',
        from_email: companyData?.email || 'noreply@payping.com',
        subject: `Payment Receipt - Invoice ${paymentData.invoice || paymentData.id}`,
        message: `Dear ${customerData.name},

Thank you for your payment! This email confirms we have received your payment.

Payment Details:
- Invoice Number: ${paymentData.invoice || paymentData.id}
- Amount Paid: ${this.formatCurrency(paymentData.amount)}
- Payment Date: ${this.formatDate(new Date())}
- Payment Method: ${paymentData.paymentMethod || 'Not specified'}

If you have any questions about this payment, please contact us.

Best regards,
${companyData?.name || 'PayPing Team'}
${companyData?.email || 'support@payping.com'}
${companyData?.phone || ''}`
      };

      const response = await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        templateParams
      );

      return {
        success: true,
        messageId: response.text,
        recipient: customerData.email,
        subject: templateParams.subject
      };

    } catch (error) {
      console.error('Failed to send receipt:', error);
      return {
        success: false,
        error: error.message,
        recipient: customerData.email
      };
    }
  }

  // Process template variables
  processTemplate(template, variables) {
    let processed = template;
    
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{${key}}`, 'g');
      processed = processed.replace(regex, value || '');
    });

    return processed;
  }

  // Format currency
  formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  }

  // Format date
  formatDate(date) {
    if (!date) return 'Not specified';
    const dateObj = date.toDate ? date.toDate() : new Date(date);
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Calculate days overdue
  calculateDaysOverdue(dueDate) {
    if (!dueDate) return 0;
    
    const due = dueDate.toDate ? dueDate.toDate() : new Date(dueDate);
    const today = new Date();
    const diffTime = today - due;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(0, diffDays);
  }

  // Utility delay function
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Simulate email send when EmailJS is not configured
  simulateEmailSend(customerData, paymentData, template) {
    console.log('🔧 EMAIL SIMULATION - EmailJS Not Configured');
    console.log('To send real emails, please:');
    console.log('1. Sign up at https://emailjs.com');
    console.log('2. Set up email service (Gmail, Outlook, etc.)');
    console.log('3. Create email template');
    console.log('4. Add environment variables to .env:');
    console.log('   VITE_EMAILJS_SERVICE_ID=your_service_id');
    console.log('   VITE_EMAILJS_TEMPLATE_ID=your_template_id');
    console.log('   VITE_EMAILJS_PUBLIC_KEY=your_public_key');
    console.log('');
    console.log('📧 SIMULATED EMAIL:');
    console.log('To:', customerData.email);
    console.log('Subject:', template.subject || 'Payment Reminder');
    console.log('Content:', template.content?.substring(0, 100) + '...');
    
    return {
      success: true,
      simulated: true,
      recipient: customerData.email,
      subject: template.subject || 'Payment Reminder',
      message: 'Email simulated - configure EmailJS for real sending'
    };
  }

  // Test email configuration
  async testEmailConfig() {
    try {
      if (!this.isConfigured()) {
        return {
          success: false,
          error: 'EmailJS not configured',
          instructions: [
            '1. Sign up at https://emailjs.com',
            '2. Create email service',
            '3. Create email template',
            '4. Add environment variables to .env file'
          ]
        };
      }

      // Send test email
      const testParams = {
        to_email: 'test@example.com',
        to_name: 'Test User',
        from_name: 'PayPing Test',
        subject: 'EmailJS Configuration Test',
        message: 'This is a test email to verify EmailJS configuration.'
      };

      await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        testParams
      );

      return {
        success: true,
        message: 'EmailJS configuration is working correctly'
      };

    } catch (error) {
      return {
        success: false,
        error: error.message,
        troubleshooting: [
          'Check your EmailJS service ID',
          'Verify your template ID',
          'Ensure public key is correct',
          'Check EmailJS dashboard for service status'
        ]
      };
    }
  }
}

// Export singleton instance
export default new EmailService();
